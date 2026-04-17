import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import {
  Colors, Typography, Spacing, Radius, Shadow,
  DEMO_PICKUP, DEMO_DROPOFF, calculateFare,
} from '../../constants';
import { FemaleDriverPrefBadge, PassBadge } from '../../components/shared/Badges';

const REQUEST_TIMEOUT = 15; // seconds to accept or decline

export default function DriverRequestScreen() {
  const router = useRouter();
  const { theme } = useTheme();
const styles = useMemo(() => StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.bg },

  timerTrack: {
    height: 4,
    backgroundColor: theme.border,
  },
  timerFill: {
    height: 4,
    backgroundColor: Colors.driverCyan,
  },

  container: {
    flex: 1, padding: Spacing.lg, gap: Spacing.md,
  },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  headerTitle: { fontSize: Typography.xl, fontWeight: '900', color: theme.text },
  timerBadge: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: theme.card,
    borderWidth: 2, borderColor: Colors.driverCyan,
    alignItems: 'center', justifyContent: 'center',
  },
  timerText: { fontSize: Typography.base, fontWeight: '900', color: Colors.driverCyan },

  // Rider card
  riderCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: theme.card,
    borderRadius: Radius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: theme.border,
  },
  riderAvatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  riderAvatarText: { color: Colors.white, fontWeight: '800', fontSize: Typography.base },
  riderInfo: { flex: 1, gap: 4 },
  riderName: { fontSize: Typography.md, fontWeight: '800', color: theme.text },
  riderBadges: { flexDirection: 'row', gap: 6 },
  riderRating: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  riderRatingText: { fontSize: Typography.xs, color: theme.subtext },

  // Route
  routeCard: {
    backgroundColor: theme.card,
    borderRadius: Radius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: theme.border,
    gap: Spacing.sm,
  },
  routeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  routeIconCol: { alignItems: 'center', paddingTop: 4, width: 16 },
  pickupDot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: Colors.driverCyan,
    borderWidth: 2, borderColor: theme.bg,
  },
  routeLine: { width: 2, height: 32, backgroundColor: theme.border, marginTop: 2 },
  dropoffDot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: Colors.brand,
    borderWidth: 2, borderColor: theme.bg,
  },
  routeCopy: { flex: 1 },
  routeLabel: {
    fontSize: 9, fontWeight: '700', color: theme.subtext,
    letterSpacing: 0.8, marginBottom: 2,
  },
  routeMain: { fontSize: Typography.base, fontWeight: '800', color: theme.text },
  routeSub: { fontSize: Typography.xs, color: theme.subtext, marginTop: 1 },
  routeMeta: { alignItems: 'flex-end', gap: 2 },
  routeMetaText: { fontSize: Typography.xs, color: theme.subtext },

  // Trip details
  detailsRow: { flexDirection: 'row', gap: Spacing.sm },
  detailCard: {
    flex: 1, alignItems: 'center', gap: 4,
    backgroundColor: theme.card,
    borderRadius: Radius.md, padding: Spacing.md,
    borderWidth: 1, borderColor: theme.border,
  },
  detailValue: { fontSize: Typography.md, fontWeight: '900', color: theme.text },
  detailLabel: { fontSize: Typography.xs, color: theme.subtext },

  // Earnings
  earningsCard: {
    backgroundColor: theme.card,
    borderRadius: Radius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: theme.border,
  },
  earningsTitle: {
    fontSize: Typography.sm, fontWeight: '800', color: theme.text, marginBottom: Spacing.sm,
  },
  earningsRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1, borderBottomColor: theme.border,
  },
  earningsLabel: { fontSize: Typography.sm, color: theme.subtext },
  earningsValue: { fontSize: Typography.sm, fontWeight: '700', color: theme.text },
  earningsTotalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingTop: Spacing.sm,
  },
  earningsTotalLabel: { fontSize: Typography.base, fontWeight: '800', color: theme.text },
  earningsTotalValue: { fontSize: Typography.lg, fontWeight: '900', color: Colors.driverCyan },
  earningsNote: {
    fontSize: Typography.xs, color: Colors.green,
    marginTop: 6, lineHeight: 16,
  },

  // Buttons
  buttons: { flexDirection: 'row', gap: Spacing.md, marginTop: 'auto' },
  declineBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 18,
    backgroundColor: 'rgba(229,57,53,0.1)',
    borderRadius: Radius.lg,
    borderWidth: 2, borderColor: Colors.red,
  },
  declineBtnText: { fontSize: Typography.md, fontWeight: '800', color: Colors.red },
  acceptBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 18,
    backgroundColor: Colors.driverCyan,
    borderRadius: Radius.lg,
    
  },
  acceptBtnText: { fontSize: Typography.md, fontWeight: '900', color: theme.bg },
}), [theme]);
  const [timeLeft, setTimeLeft] = useState(REQUEST_TIMEOUT);
  const progressAnim = useState(new Animated.Value(1))[0];

  const fare = calculateFare(7.2, 14, 'standard', true); // rider has Pass

  // Countdown timer
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: REQUEST_TIMEOUT * 1000,
      useNativeDriver: false,
    }).start();

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-decline on timeout
          router.replace('/driver/home');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function accept() {
    router.replace('/driver/active');
  }

  function decline() {
    router.replace('/driver/home');
  }

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={theme.bg} />

      {/* ── Timer bar ── */}
      <View style={styles.timerTrack}>
        <Animated.View style={[styles.timerFill, { width: progressWidth }]} />
      </View>

      <View style={styles.container}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>New Ride Request</Text>
          <View style={styles.timerBadge}>
            <Text style={styles.timerText}>{timeLeft}s</Text>
          </View>
        </View>

        {/* ── Rider info ── */}
        <View style={styles.riderCard}>
          <View style={styles.riderAvatar}>
            <Text style={styles.riderAvatarText}>JT</Text>
          </View>
          <View style={styles.riderInfo}>
            <Text style={styles.riderName}>Jessica T.</Text>
            <View style={styles.riderBadges}>
              <PassBadge small />
              <FemaleDriverPrefBadge small />
            </View>
            <View style={styles.riderRating}>
              <Ionicons name="star" size={12} color={Colors.amber} />
              <Text style={styles.riderRatingText}> 4.95 rider</Text>
            </View>
          </View>
        </View>

        {/* ── Route ── */}
        <View style={styles.routeCard}>
          {/* Pickup */}
          <View style={styles.routeRow}>
            <View style={styles.routeIconCol}>
              <View style={styles.pickupDot} />
              <View style={styles.routeLine} />
            </View>
            <View style={styles.routeCopy}>
              <Text style={styles.routeLabel}>PICKUP</Text>
              <Text style={styles.routeMain}>{DEMO_PICKUP.name}</Text>
              <Text style={styles.routeSub}>{DEMO_PICKUP.address}</Text>
            </View>
            <View style={styles.routeMeta}>
              <Ionicons name="navigate" size={14} color={Colors.driverCyan} />
              <Text style={styles.routeMetaText}>0.4 mi away</Text>
            </View>
          </View>

          {/* Dropoff */}
          <View style={styles.routeRow}>
            <View style={styles.routeIconCol}>
              <View style={styles.dropoffDot} />
            </View>
            <View style={styles.routeCopy}>
              <Text style={styles.routeLabel}>DROPOFF</Text>
              <Text style={styles.routeMain}>{DEMO_DROPOFF.name}</Text>
              <Text style={styles.routeSub}>{DEMO_DROPOFF.address}</Text>
            </View>
            <View style={styles.routeMeta}>
              <Ionicons name="map" size={14} color={theme.subtext} />
              <Text style={styles.routeMetaText}>7.2 mi</Text>
            </View>
          </View>
        </View>

        {/* ── Trip details ── */}
        <View style={styles.detailsRow}>
          {[
            { icon: 'time',   label: 'Est. time',    value: '~14 min' },
            { icon: 'navigate',       label: 'Distance',     value: '7.2 mi'  },
            { icon: 'cash',   label: 'Your earnings', value: `$${fare.driverEarnings}` },
          ].map(item => (
            <View key={item.label} style={styles.detailCard}>
              <Ionicons name={item.icon as any} size={20} color={Colors.driverCyan} />
              <Text style={styles.detailValue}>{item.value}</Text>
              <Text style={styles.detailLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Earnings breakdown ── */}
        <View style={styles.earningsCard}>
          <Text style={styles.earningsTitle}>Your Pay Breakdown</Text>
          {[
            ['Base fare (75% Y1)',       `$${(fare.base * 0.75).toFixed(2)}`],
            ['Gas adj. ($0.15/mi) ⛽',     `+$${fare.base * 0.10 < 1 ? '1.08' : (fare.base * 0.10).toFixed(2)}`, true],
            ['Pickup comp (0.4 mi)',  '+$0.04',  true],
          ].map(([label, value, green]) => (
            <View key={label as string} style={styles.earningsRow}>
              <Text style={styles.earningsLabel}>{label as string}</Text>
              <Text style={[styles.earningsValue, green && { color: Colors.green }]}>
                {value as string}
              </Text>
            </View>
          ))}
          <View style={styles.earningsTotalRow}>
            <Text style={styles.earningsTotalLabel}>You earn</Text>
            <Text style={styles.earningsTotalValue}>${fare.driverEarnings}</Text>
          </View>
          <Text style={styles.earningsNote}>
            Gas adjustment ($0.15/mi) and pickup comp go 100% to you — Wem takes nothing from those. Base pay is 75% Y1, rising to 78% Year 2+.
          </Text>
        </View>

        {/* ── Buttons ── */}
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.declineBtn} onPress={decline} activeOpacity={0.85}>
            <Ionicons name="close" size={24} color={Colors.red} />
            <Text style={styles.declineBtnText}>Decline</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.acceptBtn} onPress={accept} activeOpacity={0.85}>
            <Ionicons name="checkmark" size={24} color={theme.bg} />
            <Text style={styles.acceptBtnText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

