import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {LineChart, BarChart, PieChart} from 'react-native-gifted-charts';
import moment from 'moment';
import {useSelector} from 'react-redux';
import {RootState} from '../../../state/store';
import {getCallLogs} from '../../../database/RealmService';
import {Colors} from '../../../utility/constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { fontR } from '../../../utility/Scaling';

type ChartFilter = 'day' | 'week';
type ChartType = 'duration' | 'count';
type CallTypeFilter = 'all' | 'INCOMING' | 'OUTGOING' | 'MISSED';

const Home = () => {
  const {selectedFilter} = useSelector((state: RootState) => state.callLogs);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [incomingCalls, setIncomingCalls] = useState(0);
  const [outgoingCalls, setOutgoingCalls] = useState(0);
  const [missedCalls, setMissedCalls] = useState(0);
  const [loading, setLoading] = useState(true);
  const [durationLoading, setDurationLoading] = useState(false);
  const [countLoading, setCountLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const [durationFilter, setDurationFilter] = useState<ChartFilter>('day');
  const [countFilter, setCountFilter] = useState<ChartFilter>('week');
  const [callTypeFilter, setCallTypeFilter] = useState<CallTypeFilter>('all');
  const [showFilterMenu, setShowFilterMenu] = useState<{
    type: ChartType | 'callType' | null;
    visible: boolean;
  }>({type: null, visible: false});

  const calculateAnalytics = async () => {
    setLoading(true);

    const realmLogs = getCallLogs();
    const allLogs = Array.from(realmLogs);

    const dailyStats: any = {};
    const weeklyStats: any = {};
    let incomingCallsCount = 0;
    let outgoingCallsCount = 0;
    let missedCallsCount = 0;

    allLogs.forEach((log: any) => {
      const date = moment(log.timestamp);
      const day = date.format('YYYY-MM-DD');
      const week = date.format('YYYY-ww');
      const durationInMinutes = log.duration / 60;

      // Counting call types
      if (log.type === 'INCOMING') incomingCallsCount += 1;
      if (log.type === 'OUTGOING') outgoingCallsCount += 1;
      if (log.type === 'MISSED') missedCallsCount += 1;

      // Daily stats
      if (!dailyStats[day]) {
        dailyStats[day] = {
          totalDuration: 0,
          calls: 0,
          INCOMING: 0,
          OUTGOING: 0,
          MISSED: 0,
        };
      }
      dailyStats[day].totalDuration += durationInMinutes;
      dailyStats[day].calls += 1;
      dailyStats[day][log.type] += 1;

      // Weekly stats
      if (!weeklyStats[week]) {
        weeklyStats[week] = {
          totalDuration: 0,
          calls: 0,
          INCOMING: 0,
          OUTGOING: 0,
          MISSED: 0,
        };
      }
      weeklyStats[week].totalDuration += durationInMinutes;
      weeklyStats[week].calls += 1;
      weeklyStats[week][log.type] += 1;
    });

    const dailyDataArray = Object.keys(dailyStats).map(day => ({
      value: dailyStats[day].totalDuration,
      count: dailyStats[day].calls,
      INCOMING: dailyStats[day].INCOMING,
      OUTGOING: dailyStats[day].OUTGOING,
      MISSED: dailyStats[day].MISSED,
      label: moment(day).format('D/M'),
    }));

    const weeklyDataArray = Object.keys(weeklyStats).map(week => ({
      value: weeklyStats[week].totalDuration,
      count: weeklyStats[week].calls,
      INCOMING: weeklyStats[week].INCOMING,
      OUTGOING: weeklyStats[week].OUTGOING,
      MISSED: weeklyStats[week].MISSED,
      label: `W${week.split('-')[1]}`,
    }));

    setDailyData(dailyDataArray);
    setWeeklyData(weeklyDataArray);
    setIncomingCalls(incomingCallsCount);
    setOutgoingCalls(outgoingCallsCount);
    setMissedCalls(missedCallsCount);

    const totalCalls =
      incomingCallsCount + outgoingCallsCount + missedCallsCount;

    setPieChartData([
      {
        value: incomingCallsCount,
        label: 'Incoming',
        color: '#34A853',
        percentage:
          totalCalls > 0
            ? Math.round((incomingCallsCount / totalCalls) * 100)
            : 0,
      },
      {
        value: outgoingCallsCount,
        label: 'Outgoing',
        color: '#FBBC05',
        percentage:
          totalCalls > 0
            ? Math.round((outgoingCallsCount / totalCalls) * 100)
            : 0,
      },
      {
        value: missedCallsCount,
        label: 'Missed',
        color: '#EA4335',
        percentage:
          totalCalls > 0
            ? Math.round((missedCallsCount / totalCalls) * 100)
            : 0,
      },
    ]);

    setLoading(false);
  };

  useEffect(() => {
    calculateAnalytics();
  }, [selectedFilter]);

  const getDurationChartData = () => {
    return durationFilter === 'day' ? dailyData : weeklyData;
  };

  const getCountChartData = () => {
    const data = countFilter === 'day' ? dailyData : weeklyData;

    if (callTypeFilter === 'all') {
      return data.map(item => ({...item, value: item.count}));
    } else {
      return data.map(item => ({
        ...item,
        value: item[callTypeFilter],
        label: item.label,
      }));
    }
  };

  const toggleFilterMenu = (type: ChartType | 'callType') => {
    setShowFilterMenu({
      type,
      visible: showFilterMenu.type !== type || !showFilterMenu.visible,
    });
  };

  const setFilter = async (type: ChartType, filter: ChartFilter) => {
    if (type === 'duration') {
      setDurationLoading(true);
      setDurationFilter(filter);
      setTimeout(() => setDurationLoading(false), 300);
    }

    if (type === 'count') {
      setCountLoading(true);
      setCountFilter(filter);
      setTimeout(() => setCountLoading(false), 300);
    }

    setShowFilterMenu({type: null, visible: false});
  };

  const setCallType = (filter: CallTypeFilter) => {
    setCallTypeFilter(filter);
    setShowFilterMenu({type: null, visible: false});
  };

  const renderFilterButton = (type: ChartType, currentFilter: ChartFilter) => {
    return (
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => toggleFilterMenu(type)}>
          <Text style={styles.filterButtonText}>
            {currentFilter === 'day' ? 'Day' : 'Week'}
          </Text>
        </TouchableOpacity>
        {showFilterMenu.type === type && showFilterMenu.visible && (
          <View style={styles.filterMenu}>
            <TouchableOpacity
              style={styles.filterMenuItem}
              onPress={() => setFilter(type, 'day')}>
              <Text>Day</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterMenuItem}
              onPress={() => setFilter(type, 'week')}>
              <Text>Week</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderCallTypeFilterButton = () => {
    const getFilterText = () => {
      switch (callTypeFilter) {
        case 'INCOMING':
          return 'Incoming';
        case 'OUTGOING':
          return 'Outgoing';
        case 'MISSED':
          return 'Missed';
        default:
          return 'All Types';
      }
    };

    return (
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => toggleFilterMenu('callType')}>
          <Text style={styles.filterButtonText}>{getFilterText()}</Text>
        </TouchableOpacity>
        {showFilterMenu.type === 'callType' && showFilterMenu.visible && (
          <View style={styles.filterMenu}>
            <TouchableOpacity
              style={styles.filterMenuItem}
              onPress={() => setCallType('all')}>
              <Text>All Types</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterMenuItem}
              onPress={() => setCallType('INCOMING')}>
              <Text>Incoming</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterMenuItem}
              onPress={() => setCallType('OUTGOING')}>
              <Text>Outgoing</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterMenuItem}
              onPress={() => setCallType('MISSED')}>
              <Text>Missed</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{marginTop: 40}}
        />
      ) : (
        <ScrollView
          style={[
            styles.container,
            {paddingTop: Platform.OS === 'ios' ? 0 : insets.top},
            {backgroundColor: darkMode ? Colors.carbon : '#f5f5f5'},
          ]}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.chartHeader}>
            <Text
              style={[
                styles.header,
                {color: darkMode ? Colors.white : Colors.black},
              ]}>
              Call Duration Analytics
            </Text>
            {renderFilterButton('duration', durationFilter)}
          </View>
          {durationLoading ? (
            <View style={{justifyContent:"center", alignItems:"center"}}>
              <ActivityIndicator
                size="large"
                color="#1DA1F2"
                style={{marginTop: 100}}
              />
            </View>
          ) : (
            <LineChart
              data={getDurationChartData()}
              height={250}
              showValuesOnTopOfBars
              spacing={40}
              color="#1DA1F2"
              textColor={darkMode ? Colors.white : Colors.black}
              thickness={2}
              noOfSections={5}
              yAxisTextStyle={{color: darkMode ? Colors.white : Colors.black}}
              xAxisLabelTextStyle={{
                color: darkMode ? Colors.white : Colors.black,
              }}
              hideRules
              style={styles.chart}
            />
          )}

          <View style={styles.chartHeader}>
            <Text
              style={[
                styles.header,
                {color: darkMode ? Colors.white : Colors.black},
              ]}>
              Call Count Analytics
            </Text>
            <View style={styles.filterRow}>
              {renderFilterButton('count', countFilter)}
              <View style={{width: 10}} />
              {renderCallTypeFilterButton()}
            </View>
          </View>
          {countLoading ? (
            <View style={{justifyContent:"center", alignItems:"center"}}>
              <ActivityIndicator
                size="large"
                color="#FF6384"
                style={{marginTop: 100}}
              />
            </View>
          ) : (
            <BarChart
              data={getCountChartData()}
              height={250}
              spacing={40}
              barWidth={30}
              frontColor="#FF6384"
              yAxisTextStyle={{color: darkMode ? Colors.white : Colors.black}}
              xAxisLabelTextStyle={{
                color: darkMode ? Colors.white : Colors.black,
              }}
              hideRules
              style={styles.chart}
              barInnerComponent={(item: any) => (
              <Text
                style={{
                  color: darkMode ? Colors.white : Colors.black,
                  fontSize: fontR(10),
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {item.value}
              </Text>
            )}
            />
          )}

          <View style={styles.chartHeader}>
            <Text
              style={[
                styles.header,
                {color: darkMode ? Colors.white : Colors.black},
              ]}>
              Call Type Distribution
            </Text>
          </View>
          <View
            style={[
              styles.pieWrapper,
              {backgroundColor: darkMode ? Colors.argent : Colors.white},
            ]}>
            <PieChart
              data={pieChartData}
              donut
              showText
              textColor="white"
              textSize={14}
              focusOnPress
              radius={100}
              innerRadius={60}
              centerLabelComponent={() => (
                <View style={[styles.centerLabel]}>
                  <Text style={styles.totalCallsText}>
                    {incomingCalls + outgoingCalls + missedCalls}
                  </Text>
                  <Text style={styles.totalCallsLabel}>Total Calls</Text>
                </View>
              )}
              style={[
                styles.chart,
                {backgroundColor: darkMode ? Colors.argent : Colors.white},
              ]}
            />
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendColor, {backgroundColor: '#34A853'}]}
                />
                <View style={styles.legendTextContainer}>
                  <Text style={styles.legendLabel}>Incoming</Text>
                  <Text style={styles.legendCount}>{incomingCalls}</Text>
                  <Text style={styles.legendPercentage}>
                    {pieChartData[0]?.percentage || 0}%
                  </Text>
                </View>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendColor, {backgroundColor: '#FBBC05'}]}
                />
                <View style={styles.legendTextContainer}>
                  <Text style={styles.legendLabel}>Outgoing</Text>
                  <Text style={styles.legendCount}>{outgoingCalls}</Text>
                  <Text style={styles.legendPercentage}>
                    {pieChartData[1]?.percentage || 0}%
                  </Text>
                </View>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendColor, {backgroundColor: '#EA4335'}]}
                />
                <View style={styles.legendTextContainer}>
                  <Text style={styles.legendLabel}>Missed</Text>
                  <Text style={styles.legendCount}>{missedCalls}</Text>
                  <Text style={styles.legendPercentage}>
                    {pieChartData[2]?.percentage || 0}%
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  chart: {
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 10,
  },
  pieWrapper: {
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalCallsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  totalCallsLabel: {
    fontSize: 14,
    color: '#666',
  },
  legend: {
    marginTop: 20,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  legendTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendLabel: {
    fontSize: 16,
    color: '#000',
    width: '30%',
  },
  legendCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'right',
    width: '30%',
  },
  legendPercentage: {
    fontSize: 16,
    color: '#000',
    textAlign: 'right',
    width: '30%',
  },
  filterContainer: {
    position: 'relative',
  },
  filterButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  filterMenu: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
    minWidth: 100,
  },
  filterMenuItem: {
    padding: 8,
  },
});

export default Home;
