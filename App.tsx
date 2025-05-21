import React, { useEffect, useCallback, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/Navigation/Navigation';
import { PermissionsAndroid, AppState, Platform } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/state/store';
import CallLogDatabase, { ensureNumber } from './src/database/CallLogDatabase';
import CallLogs from 'react-native-call-log';

const App = () => {
  const [isSyncing, setIsSyncing] = useState(false);

  const checkAndRequestPermissions = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
          {
            title: 'Call Log Permission',
            message: 'This app needs access to your call history.',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return false;
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  }, []);

  const performInitialSync = useCallback(async () => {
    try {
      console.log('Starting initial sync...');
      setIsSyncing(true);
      const hasPermission = await checkAndRequestPermissions();
      if (!hasPermission) {
        console.log('Permission not granted, skipping sync');
        return;
      }

      const newestTimestamp = await CallLogDatabase.getNewestTimestamp();
      console.log('Newest existing timestamp:', newestTimestamp ? new Date(newestTimestamp) : 'None');

      const batchSize = 1000; 
      let offset = 0;
      let totalProcessed = 0;
      let hasMore = true;

      // For initial sync, fetch ALL logs regardless of timestamp
      const fetchAll = newestTimestamp === null;

      while (hasMore && !isSyncing) {
        console.log(`Fetching batch at offset ${offset}...`);
        const callLogs = await CallLogs.load(batchSize, offset > 0 ? { offset } : undefined);
        
        if (callLogs.length === 0) {
          hasMore = false;
          console.log('No more logs to fetch');
        } else {
          const logsToStore = fetchAll 
            ? callLogs
            : callLogs.filter(log => {
                const logTimestamp = typeof log.timestamp === 'string' 
                  ? parseInt(log.timestamp, 10) 
                  : log.timestamp;
                return logTimestamp > newestTimestamp!;
              });
          
          if (logsToStore.length > 0) {
            console.log(`Storing ${logsToStore.length} logs...`);
            const result = await CallLogDatabase.storeCallLogs(logsToStore);
            if (!result.success) {
              console.error('Failed to store batch:', result.error);
            }
          }
          
          offset += batchSize;
          totalProcessed += callLogs.length;
          console.log(`Processed ${totalProcessed} call logs (stored ${logsToStore.length})...`);
        }

        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await syncWithBackend();
      console.log('Initial sync completed');
      
      const totalInDB = await CallLogDatabase.getTotalCount();
      console.log('Total logs in database:', totalInDB);
      
      const realm = await CallLogDatabase.initialize();
      const allLogs = realm.objects('CallLog').sorted('timestamp');
      if (allLogs.length > 0) {
        console.log('Date range in DB:', {
          oldest: new Date(allLogs[0].timestamp),
          newest: new Date(allLogs[allLogs.length - 1].timestamp)
        });
      }
    } catch (error) {
      console.error('Initial sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [checkAndRequestPermissions, isSyncing]);

  const syncWithBackend = useCallback(async () => {
    try {
      const unsyncedLogs = await CallLogDatabase.getUnsyncedCallLogs();
      if (unsyncedLogs.length > 0) {
        console.log(`Found ${unsyncedLogs.length} unsynced logs, sending to backend...`);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await CallLogDatabase.markAsSynced(unsyncedLogs.map(log => log.id));
        console.log('Sync with backend completed');
      }
    } catch (error) {
      console.error('Backend sync failed:', error);
    }
  }, []);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === 'active' && !isSyncing) {
        try {
          const hasData = await CallLogDatabase.hasData();
          if (hasData) {
            await performInitialSync();
          }
        } catch (error) {
          console.error('Error during resume sync:', error);
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [performInitialSync, isSyncing]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing app...');
        await CallLogDatabase.initialize();
        
        const hasData = await CallLogDatabase.hasData();
        console.log(`Database has data: ${hasData}`);

        if (!hasData) {
          console.log('No data found, performing full sync');
          await CallLogDatabase.forceRefreshAllLogs();
        }
        await performInitialSync();
      } catch (error) {
        console.error('App initialization failed:', error);
      }
    };

    initializeApp();
  }, [performInitialSync]);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;