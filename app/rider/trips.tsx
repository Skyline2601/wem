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
  { id: 1, date: 'Today',        time: '9:14 AM', from: 'Home',             to: 'Baylor Medical Center', fare: 18.66, pass: true, tier: 'Standard', driver: 'Maria S.',   rating: 5, mins: 22 },
  { id: 2, date: 'Yesterday',    time: '8:30 PM', from: 'The Rustic',       to: 'Home',                  fare: 14.22, pass: true, tier: 'Standard', driver: 'Jordan K.',  rating: 5, mins: 16, safeRide: true },
  { id: 3, date: 'Yesterday',    time: '6:45 PM', from: 'Home',             to: 'The Rustic',            fare: 13.10, pass: true, tier: 'Standard', driver: 'Maria S.',   rating: 5, mins: 14 },
  { id: 4, date: 'Tue Apr 1',    time: '7:00 AM', from: 'Home',             to: 'Love Field Airport',    fare: 24.80, pass: true, tier: 'Standard', driver: 'Alex R.',    rating: 4, mins: 28 },
  { id: 5, date: 'Mon Mar 31',   time: '9:30 PM', from: 'Deep Ellum',       to: 'Home',                  fare: 16.40, pass: false, tier: 'Standard', driver: 'Sam T.',    rating: 5, mins: 19, safeRide: true },
  { id: 6, date: 'Sat Mar 29',   time: '8:00 PM', from: 'Home',             to: 'Reunion Tower',         fare: 38.50, pass: true, tier: 'Noir',      driver: 'Marcus J.',  rating: 5, mins: 32 },
];

export default function RiderTripsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: theme.bg },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: theme.card, borderBottomWidth: 1, borderBottomColor: theme.border },
  headerTitle:  { fontSize: Typography.md, fontWeight: '800', color: theme.text },
  content:      { padding: 14, gap: 10 },

  savingsBanner:{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.brandGlow, borderRadius: Radius.xl, padding: 14, borderWidth: 1, borderColor: Colors.brand + '33' },
  savingsIcon:  { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.brand + '20', alignItems: 'center', justifyContent: 'center' },
  savingsCopy:  { flex: 1 },
  savingsTitle: { fontSize: Typography.base, fontWeight: '800', color: theme.text },
  savingsSub:   { fontSize: Typography.xs, color: theme.subtext, marginTop: 2 },

  tabs:         { flexDirection: 'row', gap: 8 },
  tab:          { paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border },
  tabActive:    { backgroundColor: Colors.brandGlow, borderColor: Colors.brand + '44' },
  tabText:      { fontSize: Typography.sm, fontWeight: '600', color: theme.subtext },
  tabTextActive:{ color: Colors.brand, fontWeight: '800' },

  tripCard:     { backgroundColor: theme.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: theme.border, padding: 16, gap: 12 },
  tripTop:      { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  tripDate:     { fontSize: Typography.xs, color: theme.muted, fontWeight: '600' },
  tripBadges:   { flexDirection: 'row', gap: 6, marginTop: 4, flexWrap: 'wrap' },
  passBadge:    { backgroundColor: Colors.brandGlow, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  passBadgeText:{ fontSize: 10, fontWeight: '700', color: Colors.brand },
  safeBadge:    { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.brandGlow, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  safeBadgeText:{ fontSize: 10, fontWeight: '700', color: Colors.brand },
  tierBadge:    { borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  tierText:     { fontSize: 10, fontWeight: '700' },
  tripFare:     { fontSize: Typography.xl, fontWeight: '900', color: theme.text },

  tripRoute:    { flexDirection: 'row', gap: 10 },
  routeDots:    { alignItems: 'center', paddingTop: 4 },
  dotFrom:      { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.brand },
  routeLine:    { width: 1.5, height: 18, backgroundColor: theme.border },
  dotTo:        { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.green },
  routeLabels:  { flex: 1, gap: 8 },
  routeFrom:    { fontSize: Typography.base, fontWeight: '700', color: theme.text },
  routeTo:      { fontSize: Typography.base, fontWeight: '700', color: theme.text },

  tripFooter:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tripDriver:   { fontSize: Typography.xs, color: theme.subtext },
  stars:        { flexDirection: 'row', gap: 2 },
})
  const [filter, setFilter] = useState<'all' | 'pass' | 'saferide'>('all');

  const filtered = TRIPS.filter(t => {
    if (filter === 'pass') return t.pass;
    if (filter === 'saferide') return t.safeRide;
    return true;
  });

  const totalSpent   = filtered.reduce((a, t) => a + t.fare, 0);
  const passTrips    = TRIPS.filter(t => t.pass).length;
  const savedAmount  = TRIPS.reduce((a, t) => a + (t.pass ? t.fare * 0.08 : 0), 0); // ~8% savings estimate

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Trip History</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Pass savings banner */}
        <View style={s.savingsBanner}>
          <View style={s.savingsIcon}>
            <Ionicons name="star" size={18} color={Colors.brand} />
          </View>
          <View style={s.savingsCopy}>
            <Text style={s.savingsTitle}>Wem Pass saved you ${savedAmount.toFixed(2)}</Text>
            <Text style={s.savingsSub}>{passTrips} of {TRIPS.length} trips used Pass pricing</Text>
          </View>
        </View>

        {/* Filters */}
        <View style={s.tabs}>
          {[
            { key: 'all',      label: 'All trips' },
            { key: 'pass',     label: 'Pass rides' },
            { key: 'saferide', label: 'Wem Go' },
          ].map(f => (
            <TouchableOpacity
              key={f.key}
              style={[s.tab, filter === f.key && s.tabActive]}
              onPress={() => setFilter(f.key as any)}>
              <Text style={[s.tabText, filter === f.key && s.tabTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Trip list */}
        {filtered.map(trip => (
          <View key={trip.id} style={s.tripCard}>
            <View style={s.tripTop}>
              <View>
                <Text style={s.tripDate}>{trip.date} · {trip.time}</Text>
                <View style={s.tripBadges}>
                  {trip.pass && (
                    <View style={s.passBadge}>
                      <Text style={s.passBadgeText}>✦ Pass</Text>
                    </View>
                  )}
                  {trip.safeRide && (
                    <View style={s.safeBadge}>
                      <Ionicons name="moon" size={10} color={Colors.brand} />
                      <Text style={s.safeBadgeText}>Wem Go</Text>
                    </View>
                  )}
                  {trip.tier !== 'Standard' && (
                    <View style={[s.tierBadge, { borderColor: '#A78BFA44' }]}>
                      <Text style={[s.tierText, { color: '#A78BFA' }]}>{trip.tier}</Text>
                    </View>
                  )}
                </View>
              </View>
              <Text style={s.tripFare}>${trip.fare.toFixed(2)}</Text>
            </View>

            <View style={s.tripRoute}>
              <View style={s.routeDots}>
                <View style={s.dotFrom} />
                <View style={s.routeLine} />
                <View style={s.dotTo} />
              </View>
              <View style={s.routeLabels}>
                <Text style={s.routeFrom}>{trip.from}</Text>
                <Text style={s.routeTo}>{trip.to}</Text>
              </View>
            </View>

            <View style={s.tripFooter}>
              <Text style={s.tripDriver}>{trip.driver} · {trip.mins} min</Text>
              <View style={s.stars}>
                {[1,2,3,4,5].map(n => (
                  <Ionicons key={n} name="star" size={12} color={n <= trip.rating ? Colors.amber : theme.border} />
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

