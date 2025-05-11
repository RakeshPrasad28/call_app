import { useState, useEffect, useCallback } from 'react';
import CallLogDatabase, { ICallLog } from '../database/CallLogDatabase';
import { useDispatch } from 'react-redux';
import { setLoading } from '../state/slice/callLogSlice';

const BATCH_SIZE = 100;

export const useCallLogs = (
  filter: 'ALL' | 'INCOMING' | 'OUTGOING' | 'MISSED',
) => {
  const [callLogs, setCallLogs] = useState<ICallLog[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const dispatch = useDispatch();

  const loadInitialData = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const realm = await CallLogDatabase.initialize();
      let query = realm.objects<ICallLog>('CallLog').sorted('timestamp', true);

      if (filter !== 'ALL') {
        query = query.filtered('type == $0', filter);
      }

      const total = query.length;
      const initialBatch = Array.from(query.slice(0, BATCH_SIZE));

      setCallLogs(initialBatch);
      setOffset(initialBatch.length);
      setHasMore(initialBatch.length < total);
      setTotalCount(total);
      
      console.log(`Initial load: ${initialBatch.length} of ${total} logs`);
      
      if (initialBatch.length > 0) {
        console.log('Sample log dates:', {
          first: new Date(initialBatch[0].timestamp),
          last: new Date(initialBatch[initialBatch.length - 1].timestamp)
        });
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [filter, dispatch]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isRefreshing) return;
  
    dispatch(setLoading(true));
    try {
      const { logs, totalCount: newTotalCount } = await CallLogDatabase.getCallLogsBatch(
        offset, 
        BATCH_SIZE, 
        filter
      );
      
      if (logs.length > 0) {
        setCallLogs(prev => [...prev, ...logs]);
        setOffset(prev => prev + logs.length);
        setHasMore(offset + logs.length < newTotalCount);
        setTotalCount(newTotalCount);
        
        console.log('Loaded batch date range:', {
          first: new Date(logs[0].timestamp),
          last: new Date(logs[logs.length-1].timestamp)
        });
      }
    } catch (error) {
      console.error('Error loading more call logs:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [offset, hasMore, filter, dispatch, isRefreshing]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await loadInitialData();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [loadInitialData]);

  useEffect(() => {
    loadInitialData();
  }, [filter, loadInitialData]);

  return {
    callLogs,
    loadMore,
    refresh,
    isRefreshing,
    hasMore,
    totalCount,
  };
};