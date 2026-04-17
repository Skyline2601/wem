/**
 * Driver Earnings — detailed pay breakdown by day/week/month
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { Colors, Typography, Radius } from '../../constants';

type Period = 'week' | 'month';

const WEEK_DAYS = [
  { day: 'Mon', trips: 6,  gross: 98.40,  base: 73.80, gas: 8.76,  pickup: 4.84, tips: 11.00 },
  { day: 'Tue', trips: 9,  gross: 142.60, base: 107.0, gas: 12.72, pickup: 6.88, tips: 16.00 },
  { day: 'Wed', trips: 5,  gross: 84.20,  base: 63.15, gas: 7.50,  pickup: 3.55, tips: 10.00 },
  { day: 'Thu', trips: 8,  gross: 127.40, base: 95.55, gas: 10.80, pickup: 6.05, tips: 15.00 },
  { day: 'Fri', trips: 12, gross: 198.80, base: 149.1, gas: 17.73, pickup: 9.97, tips: 22.00 },
  { day: 'Sat', trips: 3,  gross: 32.80,  base: 24.60, gas: 2.93,  pickup: 1.27, tips: 4.00  },
  { day: 'Sun', trips: 0,  gross: 0,      base: 0,     gas: 0,     pickup: 0,    tips: 0     },
];

const MONTH_WEEKS = [
  { label: 'Week 1', gross: 684.20, trips: 43 },
  { label: 'Week 2', gross: 721.80, trips: 46 },
  { label: 'Week 3', gross: 598.40, trips: 38 },
  { label: 'Week 4', gross: 412.60, trips: 27 },
];

function AnimatedBar({ progress, color, maxH = 80 }: { progress: number; color: string; maxH?: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: progress, duration: 800, useNativeDriver: false }).start();
  }, []);
  const height = anim.interpolate({ inputRange: [0, 1], outputRange: [0, maxH * progress] });
  return (
    <View style={{ height: maxH, justifyContent: 'flex-end' }}>
      <Animated.View style={{ height, backgroundColor: color, borderRadius: 4, minHeight: progress > 0 ? 4 : 0 }} />
    </View>
  );
}

export default function DriverEarningsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: theme.bg },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: theme.bg },
  headerTitle:    { fontSize: Typography.md, fontWeight: '800', color: theme.text },
  content:        { padding: 14, gap: 12 },
  sectionLabel:   { fontSize: 11, fontWeight: '700', color: theme.muted, letterSpacing: 0.8, marginBottom: 12 },

  toggle:         { flexDirection: 'row', backgroundColor: theme.card, borderRadius: Radius.lg, padding: 4, borderWidth: 1, borderColor: theme.border },
  toggleBtn:      { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: Radius.md },
  toggleBtnActive:{ backgroundColor: Colors.driverCyan + '22', borderWidth: 1, borderColor: Colors.driverCyan + '44' },
  toggleText:     { fontSize: Typography.sm, fontWeight: '600', color: theme.subtext },
  toggleTextActive:{ color: Colors.driverCyan, fontWeight: '800' },

  totalCard:      { backgroundColor: theme.card, borderRadius: Radius.xl, padding: 20, borderWidth: 1, borderColor: theme.border, gap: 6 },
  totalLabel:     { fontSize: 11, fontWeight: '700', color: theme.muted, letterSpacing: 0.8 },
  totalAmount:    { fontSize: 44, fontWeight: '900', color: theme.text },
  totalSub:       { fontSize: Typography.sm, color: theme.subtext },
  legend:         { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  legendItem:     { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot:      { width: 8, height: 8, borderRadius: 4 },
  legendText:     { fontSize: Typography.xs, color: theme.subtext },

  chartCard:      { backgroundColor: theme.card, borderRadius: Radius.xl, padding: 18, borderWidth: 1, borderColor: theme.border },
  barsRow:        { flexDirection: 'row', gap: 6, alignItems: 'flex-end', paddingBottom: 8 },
  barCol:         { flex: 1, alignItems: 'center', gap: 4 },
  barDay:         { fontSize: 11, fontWeight: '600', color: theme.subtext },
  barTrips:       { fontSize: 10, color: theme.muted },

  dayDetail:      { marginTop: 16, backgroundColor: theme.bg, borderRadius: Radius.lg, padding: 14 },
  dayDetailTitle: { fontSize: Typography.base, fontWeight: '800', color: theme.text, marginBottom: 12 },
  dayDetailGrid:  { gap: 8 },
  dayDetailRow:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dayDetailLabel: { flex: 1, fontSize: Typography.sm, color: theme.subtext },
  dayDetailVal:   { fontSize: Typography.sm, fontWeight: '700' },
  dayDetailDivider: { height: 1, backgroundColor: theme.border, marginVertical: 4 },

  insightCard:    { borderRadius: Radius.xl, borderWidth: 1, padding: 18, gap: 0 },
  insightRow:     { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  insightIcon:    { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  insightCopy:    { flex: 1 },
  insightTitle:   { fontSize: Typography.base, fontWeight: '700' },
  insightSub:     { fontSize: Typography.xs, marginTop: 2, lineHeight: 17 },
  insightVal:     { fontSize: Typography.md, fontWeight: '900' },
  insightDivider: { height: 1, backgroundColor: 'rgba(0,0,0,0.06)' },
})
  const [period, setPeriod] = useState<Period>('week');
  const [selected, setSelected] = useState(3); // Thu selected by default

  const weekTotal   = WEEK_DAYS.reduce((a, d) => a + d.gross, 0);
  const monthTotal  = MONTH_WEEKS.reduce((a, w) => a + w.gross, 0);
  const weekTrips   = WEEK_DAYS.reduce((a, d) => a + d.trips, 0);
  const monthTrips  = MONTH_WEEKS.reduce((a, w) => a + w.trips, 0);
  const maxGross    = Math.max(...WEEK_DAYS.map(d => d.gross), 1);
  const maxWeekGross = Math.max(...MONTH_WEEKS.map(w => w.gross), 1);

  const selDay = WEEK_DAYS[selected];
  const wemShare = selDay.base + selDay.gas + selDay.pickup;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" />

      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Earnings</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Period toggle */}
        <View style={s.toggle}>
          {(['week', 'month'] as Period[]).map(p => (
            <TouchableOpacity key={p.label || p.id || i}
              key={p}
              style={[s.toggleBtn, period === p && s.toggleBtnActive]}
              onPress={() => setPeriod(p)}>
              <Text style={[s.toggleText, period === p && s.toggleTextActive]}>
                {p === 'week' ? 'This Week' : 'This Month'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Total */}
        <View style={s.totalCard}>
          <Text style={s.totalLabel}>{period === 'week' ? 'WEEK TOTAL' : 'MONTH TOTAL'}</Text>
          <Text style={s.totalAmount}>${(period === 'week' ? weekTotal : monthTotal).toFixed(2)}</Text>
          <Text style={s.totalSub}>
            {period === 'week' ? weekTrips : monthTrips} trips completed
          </Text>

          {/* Pay breakdown legend */}
          <View style={s.legend}>
            {[
              { label: 'Base (75%)', color: Colors.driverCyan },
              { label: 'Gas adj',   color: Colors.green },
              { label: 'Pickup',    color: Colors.amber },
              { label: 'Tips',      color: '#A78BFA' },
            ].map(l => (
              <View key={l.label} style={s.legendItem}>
                <View style={[s.legendDot, { backgroundColor: l.color }]} />
                <Text style={s.legendText}>{l.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bar chart */}
        {period === 'week' ? (
          <View style={s.chartCard}>
            <Text style={s.sectionLabel}>DAILY BREAKDOWN</Text>
            <View style={s.barsRow}>
              {WEEK_DAYS.map((day, i) => (
                <TouchableOpacity
                  key={day.day}
                  style={s.barCol}
                  onPress={() => setSelected(i)}
                  activeOpacity={0.8}>
                  <AnimatedBar
                    progress={day.gross / maxGross}
                    color={i === selected ? Colors.driverCyan : theme.border}
                    maxH={100}
                  />
                  <Text style={[s.barDay, i === selected && { color: Colors.driverCyan }]}>{day.day}</Text>
                  {day.trips > 0 && (
                    <Text style={s.barTrips}>{day.trips}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Selected day detail */}
            {selDay.trips > 0 && (
              <View style={s.dayDetail}>
                <Text style={s.dayDetailTitle}>{selDay.day} — ${selDay.gross.toFixed(2)}</Text>
                <View style={s.dayDetailGrid}>
                  {[
                    { label: 'Base pay (75%)', value: selDay.base,    color: Colors.driverCyan },
                    { label: 'Gas adjustment', value: selDay.gas,     color: Colors.green },
                    { label: 'Pickup comp',    value: selDay.pickup,  color: Colors.amber },
                    { label: 'Tips (100%)',    value: selDay.tips,    color: '#A78BFA' },
                  ].map(item => (
                    <View key={item.label} style={s.dayDetailRow}>
                      <View style={[s.legendDot, { backgroundColor: item.color }]} />
                      <Text style={s.dayDetailLabel}>{item.label}</Text>
                      <Text style={[s.dayDetailVal, { color: item.color }]}>${item.value.toFixed(2)}</Text>
                    </View>
                  ))}
                  <View style={s.dayDetailDivider} />
                  <View style={s.dayDetailRow}>
                    <View style={[s.legendDot, { backgroundColor: theme.text }]} />
                    <Text style={[s.dayDetailLabel, { color: theme.text, fontWeight: '700' }]}>Your total</Text>
                    <Text style={[s.dayDetailVal, { color: Colors.green, fontWeight: '900' }]}>${selDay.gross.toFixed(2)}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={s.chartCard}>
            <Text style={s.sectionLabel}>WEEKLY BREAKDOWN</Text>
            <View style={s.barsRow}>
              {MONTH_WEEKS.map((week, i) => (
                <View key={week.label} style={s.barCol}>
                  <AnimatedBar progress={week.gross / maxWeekGross} color={Colors.driverCyan} maxH={100} />
                  <Text style={s.barDay}>{week.label.replace('Week ', 'W')}</Text>
                  <Text style={s.barTrips}>{week.trips}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

                {/* ── Earnings insights ── */}
        <View style={[s.insightCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={s.sectionLabel}>EARNINGS BREAKDOWN</Text>

          {/* Pay structure */}
          <View style={s.insightRow}>
            <View style={[s.insightIcon, { backgroundColor: Colors.brand + '18' }]}>
              <Ionicons name="cash" size={18} color={Colors.brand} />
            </View>
            <View style={s.insightCopy}>
              <Text style={[s.insightTitle, { color: theme.text }]}>75% base pay — Year 1</Text>
              <Text style={[s.insightSub, { color: theme.subtext }]}>Increases to 78% in Year 2 automatically</Text>
            </View>
            <Text style={[s.insightVal, { color: Colors.brand }]}>75%</Text>
          </View>

          <View style={s.insightDivider} />

          {/* Gas adjustment */}
          <View style={s.insightRow}>
            <View style={[s.insightIcon, { backgroundColor: Colors.green + '18' }]}>
              <Ionicons name="speedometer" size={18} color={Colors.green} />
            </View>
            <View style={s.insightCopy}>
              <Text style={[s.insightTitle, { color: theme.text }]}>$0.15/mi gas adjustment</Text>
              <Text style={[s.insightSub, { color: theme.subtext }]}>Goes 100% to you on every mile driven</Text>
            </View>
            <Text style={[s.insightVal, { color: Colors.green }]}>100%</Text>
          </View>

          <View style={s.insightDivider} />

          {/* Tips */}
          <View style={s.insightRow}>
            <View style={[s.insightIcon, { backgroundColor: '#A78BFA18' }]}>
              <Ionicons name="heart" size={18} color="#A78BFA" />
            </View>
            <View style={s.insightCopy}>
              <Text style={[s.insightTitle, { color: theme.text }]}>Tips are always yours</Text>
              <Text style={[s.insightSub, { color: theme.subtext }]}>Every tip goes directly to you, no deductions</Text>
            </View>
            <Text style={[s.insightVal, { color: '#A78BFA' }]}>100%</Text>
          </View>

          <View style={s.insightDivider} />

          {/* Pickup comp */}
          <View style={s.insightRow}>
            <View style={[s.insightIcon, { backgroundColor: Colors.amber + '18' }]}>
              <Ionicons name="navigate" size={18} color={Colors.amber} />
            </View>
            <View style={s.insightCopy}>
              <Text style={[s.insightTitle, { color: theme.text }]}>Pickup compensation</Text>
              <Text style={[s.insightSub, { color: theme.subtext }]}>Extra pay when pickup is over 1 mile away</Text>
            </View>
            <Text style={[s.insightVal, { color: Colors.amber }]}>+Pay</Text>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
