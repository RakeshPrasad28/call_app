import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, StatusBar } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-gifted-charts';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import CallLogDatabase from '../../../database/CallLogDatabase';
import { Colors } from '../../../utility/constants';

const Home = () => {
  const { selectedFilter } = useSelector((state: RootState) => state.callLogs);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [incomingCalls, setIncomingCalls] = useState(0);
  const [outgoingCalls, setOutgoingCalls] = useState(0);
  const [missedCalls, setMissedCalls] = useState(0);
  const [loading, setLoading] = useState(true);

  const calculateAnalytics = async () => {
    setLoading(true);

    const allLogs = await CallLogDatabase.getCallLogsBatch(0, 1000, selectedFilter);

    const dailyStats: any = {};
    const weeklyStats: any = {};
    let incomingCallsCount = 0;
    let outgoingCallsCount = 0;
    let missedCallsCount = 0;

    allLogs.logs.forEach((log: any) => {
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
        dailyStats[day] = { totalDuration: 0, calls: 0 };
      }
      dailyStats[day].totalDuration += durationInMinutes;
      dailyStats[day].calls += 1;

      // Weekly stats
      if (!weeklyStats[week]) {
        weeklyStats[week] = { totalDuration: 0, calls: 0 };
      }
      weeklyStats[week].totalDuration += durationInMinutes;
      weeklyStats[week].calls += 1;
    });

    const dailyDataArray = Object.keys(dailyStats).map((day) => ({
      value: dailyStats[day].totalDuration,
      label: moment(day).format('MMM D'),
    }));

    const weeklyDataArray = Object.keys(weeklyStats).map((week) => ({
      value: weeklyStats[week].totalDuration,
      label: `W${week.split('-')[1]}`,
    }));

    setDailyData(dailyDataArray);
    setWeeklyData(weeklyDataArray);
    setIncomingCalls(incomingCallsCount);
    setOutgoingCalls(outgoingCallsCount);
    setMissedCalls(missedCallsCount);

    setPieChartData([
      { value: incomingCallsCount, label: 'Incoming Calls', color: '#34A853' },
      { value: outgoingCallsCount, label: 'Outgoing Calls', color: '#FBBC05' },
      { value: missedCallsCount, label: 'Missed Calls', color: '#EA4335' },
    ]);

    setLoading(false);
  };

  useEffect(() => {
    calculateAnalytics();
  }, [selectedFilter]);

  return (
    <>
     <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.header}>Daily Call Analytics</Text>
          <LineChart
            data={dailyData}
            height={250}
            showValuesOnTopOfBars
            spacing={40}
            color="#1DA1F2"
            textColor="#000"
            thickness={2}
            noOfSections={5}
            yAxisTextStyle={{ color: '#000' }}
            xAxisLabelTextStyle={{ color: '#000' }}
            hideRules
            style={styles.chart}
          />

          <Text style={styles.header}>Weekly Call Analytics</Text>
          <BarChart
            data={weeklyData}
            height={250}
            spacing={40}
            barWidth={30}
            frontColor="#FF6384"
            yAxisTextStyle={{ color: '#000' }}
            xAxisLabelTextStyle={{ color: '#000' }}
            hideRules
            style={styles.chart}
          />

          <Text style={styles.header}>Call Type Distribution</Text>
          <View style={styles.pieWrapper}>
            <Text style={styles.totalCalls}>
              {incomingCalls + outgoingCalls + missedCalls} Calls
            </Text>
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
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                  {incomingCalls + outgoingCalls + missedCalls}
                </Text>
              )}
              style={styles.chart}
            />
            <View style={styles.legend}>
              <View style={[styles.legendItem, { backgroundColor: '#34A853' }]}>
                <Text style={styles.legendText}>Incoming Calls</Text>
              </View>
              <View style={[styles.legendItem, { backgroundColor: '#FBBC05' }]}>
                <Text style={styles.legendText}>Outgoing Calls</Text>
              </View>
              <View style={[styles.legendItem, { backgroundColor: '#EA4335' }]}>
                <Text style={styles.legendText}>Missed Calls</Text>
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
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
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
  totalCalls: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  legend: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Home;
