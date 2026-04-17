import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { Colors, Typography, Radius } from '../../constants';

const TRIPS = [
  { id: 1, time: '9:22 AM', date: 'Today',     from: 'Uptown',           to: 'Love Field',        base: 14.40, gas: 1.08, tip: 3.00, miles: 7.2,  mins: 18, rating: 5,   tier: 'Standard' },
  { id: 2, time: '8:05 AM', date: 'Today',     from: 'Knox-Henderson',   to: 'Downtown Dallas',   base:  9.00, gas: 0.72, tip: 2.00, miles: 4.8,  mins: 12, rating: 5,   tier: 'Standard' },
  { id: 3, time: '7:18 AM', date: 'Today',     from: 'Lower Greenville', to: 'Uptown',            base:  6.75, gas: 0.47, tip: 1.00, miles: 3.1,  mins:  9, rating: 4,   tier: 'Standard' },
  { id: 4, time: '8:44 PM', date: 'Yesterday', from: 'Deep Ellum',       to: 'Plano',             base: 22.50, gas: 1.69, tip: 5.00, miles: 11.6, mins: 24, rating: 5,   tier: 'XL'       },
  { id: 5, time: '7:30 PM', date: 'Yesterday', from: 'Addison',          to: 'Las Colinas',       base: 11.25, gas: 0.84, tip: 2.00, miles: 5.4,  mins: 14, rating: 5,   tier: 'Standard' },
  { id: 6, time: '6:15 PM', date: 'Yesterday', from: 'Frisco',           to: 'Legacy West',       base: 13.50, gas: 1.01, tip: 3.00, miles: 6.8,  mins: 16, rating: 5,   tier: 'Standard' },
  { id: 7, time: '2:10 PM', date: 'Yesterday', from: 'McKinney',         to: 'Allen',             base:  9.00, gas: 0.68, tip: 0,    miles: 4.4,  mins: 11, rating: 4,   tier: 'Standard' },
];

const TIER_COLORS: Record<string, string> = {
  Standard: '#4A7A9B',
  XL:       Colors.amber,
  Noir:     '#A78BFA',
};

export default function DriverTripsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: theme.bg },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  headerTitle:  { fontSize: Typography.md, fontWeight: '800', color: theme.text },
  content:      { padding: 14, gap: 10 },

  tabs:         { flexDirection: 'row', gap: 8 },
  tab:          { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border },
  tabActive:    { backgroundColor: Colors.driverCyan + '22', borderColor: Colors.driverCyan + '66' },
  tabText:      { fontSize: Typography.sm, fontWeight: '600', color: theme.subtext },
  tabTextActive:{ color: Colors.driverCyan, fontWeight: '800' },

  summaryCard:  { flexDirection: 'row', backgroundColor: theme.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: theme.border, padding: 16 },
  summaryItem:  { flex: 1, alignItems: 'center' },
  summaryVal:   { fontSize: Typography.lg, fontWeight: '900', color: theme.text },
  summaryLabel: { fontSize: Typography.xs, color: theme.subtext, marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: theme.border },

  tripCard:     { backgroundColor: theme.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: theme.border, padding: 16, gap: 12 },
  tripTop:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tripMeta:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tripTime:     { fontSize: Typography.xs, color: theme.muted, fontWeight: '600' },
  tierBadge:    { borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  tierText:     { fontSize: 10, fontWeight: '700' },
  tripTotal:    { fontSize: Typography.lg, fontWeight: '900', color: Colors.green },

  tripRoute:    { flexDirection: 'row', gap: 10 },
  routeDots:    { alignItems: 'center', paddingTop: 4, gap: 0 },
  routeDotFrom: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.driverCyan },
  routeLine:    { width: 1.5, height: 18, backgroundColor: theme.border },
  routeDotTo:   { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.green },
  routeText:    { flex: 1, gap: 8 },
  routeFrom:    { fontSize: Typography.base, fontWeight: '700', color: theme.text },
  routeTo:      { fontSize: Typography.base, fontWeight: '700', color: theme.text },

  tripFooter:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tripStat:     { fontSize: Typography.xs, color: theme.subtext },
  tripBreakdown:{ flexDirection: 'row', gap: 8 },
  tripBreakdownItem: { fontSize: Typography.xs, color: theme.subtext },
  stars:        { flexDirection: 'row', gap: 1 },
})
  const [filter, setFilter] = useState<'all' | 'today' | 'yesterday'>('all');

  const filtered = filter === 'all' ? TRIPS : TRIPS.filter(t => t.date.toLowerCase() === filter);
  const totalEarned = filtered.reduce((a, t) => a + t.base + t.gas + t.tip, 0);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Trip History</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Filter tabs */}
        <View style={s.tabs}>
          {(['all', 'today', 'yesterday'] as const).map(f => (
            <TouchableOpacity
              key={f}
              style={[s.tab, filter === f && s.tabActive]}
              onPress={() => setFilter(f)}>
              <Text style={[s.tabText, filter === f && s.tabTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary */}
        <View style={s.summaryCard}>
          <View style={s.summaryItem}>
            <Text style={s.summaryVal}>${totalEarned.toFixed(2)}</Text>
            <Text style={s.summaryLabel}>Earned</Text>
          </View>
          <View style={s.summaryDivider} />
          <View style={s.summaryItem}>
            <Text style={s.summaryVal}>{filtered.length}</Text>
            <Text style={s.summaryLabel}>Trips</Text>
          </View>
          <View style={s.summaryDivider} />
          <View style={s.summaryItem}>
            <Text style={s.summaryVal}>{filtered.reduce((a, t) => a + t.miles, 0).toFixed(1)}</Text>
            <Text style={s.summaryLabel}>Miles</Text>
          </View>
          <View style={s.summaryDivider} />
          <View style={s.summaryItem}>
            <Text style={s.summaryVal}>{(totalEarned / (filtered.length || 1)).toFixed(2)}</Text>
            <Text style={s.summaryLabel}>Avg/trip</Text>
          </View>
        </View>

        {/* Trip list */}
        {filtered.map((trip, i) => (
          <View key={trip.id} style={s.tripCard}>
            <View style={s.tripTop}>
              <View style={s.tripMeta}>
                <Text style={s.tripTime}>{trip.time} · {trip.date}</Text>
                <View style={[s.tierBadge, { borderColor: TIER_COLORS[trip.tier] + '44' }]}>
                  <Text style={[s.tierText, { color: TIER_COLORS[trip.tier] }]}>{trip.tier}</Text>
                </View>
              </View>
              <Text style={s.tripTotal}>${(trip.base + trip.gas + trip.tip).toFixed(2)}</Text>
            </View>

            <View style={s.tripRoute}>
              <View style={s.routeDots}>
                <View style={s.routeDotFrom} />
                <View style={s.routeLine} />
                <View style={s.routeDotTo} />
              </View>
              <View style={s.routeText}>
                <Text style={s.routeFrom}>{trip.from}</Text>
                <Text style={s.routeTo}>{trip.to}</Text>
              </View>
            </View>

            <View style={s.tripFooter}>
              <Text style={s.tripStat}>{trip.miles} mi · {trip.mins} min</Text>
              <View style={s.tripBreakdown}>
                <Text style={s.tripBreakdownItem}>Base <Text style={{ color: Colors.driverCyan }}>${trip.base.toFixed(2)}</Text></Text>
                <Text style={s.tripBreakdownItem}>Gas <Text style={{ color: Colors.green }}>${trip.gas.toFixed(2)}</Text></Text>
                {trip.tip > 0 && <Text style={s.tripBreakdownItem}>Tip <Text style={{ color: '#A78BFA' }}>${trip.tip.toFixed(2)}</Text></Text>}
              </View>
              <View style={s.stars}>
                {[1,2,3,4,5].map(n => (
                  <Ionicons key={n} name="star" size={11} color={n <= trip.rating ? Colors.amber : theme.border} />
                ))}
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

