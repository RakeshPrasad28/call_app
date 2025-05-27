import React, { useEffect, useCallback, useState, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/Navigation/Navigation';
import { PermissionsAndroid, AppState, Platform } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/state/store';
import CallLogDatabase, { ensureNumber } from './src/database/CallLogDatabase';
import CallLog from 'react-native-call-log';
import { saveCallLogs, getCallLogs, getCallLogsCount } from './src/database/RealmService';

const BATCH_SIZE = 100;
const MAX_CALL_LOGS = 7000;
const FETCH_INTERVAL = 60 * 1000;
const INITIAL_LOAD_SIZE = 200;

const App = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [displayedLogs, setDisplayedLogs] = useState<any[]>([]);
  const [allLogsCount, setAllLogsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const loadingRef = useRef(false);

  const requestCallLogPermission = useCallback(async () => {
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

  const fetchAndSaveCallLogs = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setIsLoading(true);

    try {
      const now = Date.now();
      const oneDayInMillis = 24 * 60 * 60 * 1000;
      let totalFetched = 0;
      let currentMaxTimestamp = now;
      let currentMinTimestamp = now - oneDayInMillis;

      while (totalFetched < MAX_CALL_LOGS) {
        if (currentMinTimestamp >= currentMaxTimestamp) {
          break;
        }

        const logs = await CallLog.load(BATCH_SIZE, {
          minTimestamp: currentMinTimestamp.toString(),
          maxTimestamp: currentMaxTimestamp.toString(),
        });

        if (logs.length === 0) {
          currentMaxTimestamp = currentMinTimestamp;
          currentMinTimestamp = currentMinTimestamp - oneDayInMillis;
          continue;
        }

        // Save logs to Realm
        saveCallLogs(logs);
        totalFetched += logs.length;

        // Update UI incrementally
        if (isInitialLoad && totalFetched >= INITIAL_LOAD_SIZE) {
          updateUI();
          setIsInitialLoad(false);
        } else if (!isInitialLoad) {
          appendNewLogs(logs);
        }

        // Update the earliest timestamp from the current batch
        const timestamps = logs.map(log => parseInt(log.timestamp));
        const earliestTimestamp = Math.min(...timestamps);
        
        if (earliestTimestamp >= currentMaxTimestamp) {
          break;
        }

        currentMaxTimestamp = earliestTimestamp;
        currentMinTimestamp = currentMinTimestamp - oneDayInMillis;
      }

      // Final update with all data
      updateUI();
    } catch (error) {
      console.error("Error fetching call logs:", error);
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  const updateUI = () => {
    const allLogs = Array.from(getCallLogs());
    setAllLogsCount(allLogs.length);
    setDisplayedLogs(allLogs.slice(0,  allLogs.length));
  };

  const appendNewLogs = (newLogs: any[]) => {
    setDisplayedLogs(prevLogs => {
      // Filter out duplicates that might already be in the list
      const existingIds = new Set(prevLogs.map(log => log.id));
      const uniqueNewLogs = newLogs.filter(log => !existingIds.has(log.id));
      
      return [...uniqueNewLogs, ...prevLogs];
    });
    setAllLogsCount(getCallLogsCount());
  };

  useEffect(() => {
    const fetchLogs = async () => {
      const hasPermission = await requestCallLogPermission();
      if (hasPermission) {
        await fetchAndSaveCallLogs();
        
        const interval = setInterval(() => {
          fetchAndSaveCallLogs();
        }, FETCH_INTERVAL);

        return () => clearInterval(interval);
      }
    };

    fetchLogs();
  }, []);


  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;