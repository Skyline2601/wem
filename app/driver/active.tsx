import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, Alert, Animated,
} from 'react-native';
import { WemMap as MapView, Marker, Polyline } from '../../components/shared/WemMap';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import {
  Colors, Typography, Spacing, Radius, Shadow,
  DEMO_ROUTE, DEMO_PICKUP, DEMO_DROPOFF, DEMO_RIDER,
  calculateFare,
} from '../../constants';
import { RecordingBadge } from '../../components/shared/Badges';

const TOTAL_DURATION = 60;
const fare = calculateFare(7.2, 14, 'standard', DEMO_RIDER.hasPass);

type RidePhase = 'to_pickup' | 'active' | 'arrived';

export default function DriverActiveScreen() {
  const router = useRouter();
  const { theme } = useTheme();
const styles = useMemo(() => StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.bg },

  statusBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    backgroundColor: theme.card,
    borderBottomWidth: 1, borderBottomColor: theme.border,
  },
  statusLeft: {},
  statusPhase: { fontSize: Typography.base, fontWeight: '800', color: theme.text },
  statusRider: { fontSize: Typography.xs, color: theme.subtext, marginTop: 2 },

  progressTrack: { height: 3, backgroundColor: theme.border },
  progressFill: { height: 3, backgroundColor: Colors.driverCyan },

  mapContainer: { flex: 1, position: 'relative' },
  map: { flex: 1 },
  carMarker: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.driverCyan,
    alignItems: 'center', justifyContent: 'center',
    
  },
  pickupMarker: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  dropoffMarker: { alignItems: 'center' },

  sosBtn: {
    position: 'absolute', top: Spacing.md, right: Spacing.md,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.red,
    alignItems: 'center', justifyContent: 'center',
    
  },
  sosBtnText: { color: Colors.white, fontWeight: '900', fontSize: 11, marginTop: 2 },
  sosCancelBtn: {
    position: 'absolute', top: Spacing.md, right: Spacing.md,
    backgroundColor: Colors.red, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center', 
  },
  sosCancelTitle: { color: Colors.white, fontWeight: '900', fontSize: Typography.base },
  sosCancelSub: { color: 'rgba(255,255,255,0.75)', fontSize: Typography.xs, marginTop: 4 },

  btStatus: {
    position: 'absolute', top: Spacing.md, left: Spacing.md,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: theme.card,
    borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: Colors.green,
  },
  btStatusText: { fontSize: 11, fontWeight: '700', color: Colors.green },

  bottomPanel: {
    backgroundColor: theme.card,
    padding: Spacing.md, gap: Spacing.md,
    borderTopWidth: 1, borderTopColor: theme.border,
  },
  destRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  destIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,119,204,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  destCopy: { flex: 1 },
  destLabel: { fontSize: Typography.base, fontWeight: '800', color: theme.text },
  destSub: { fontSize: Typography.xs, color: theme.subtext, marginTop: 2 },

  earningsRow: {
    flexDirection: 'row',
    backgroundColor: theme.bg,
    borderRadius: Radius.md, padding: Spacing.md,
    gap: Spacing.md,
  },
  earningStat: { flex: 1, alignItems: 'center' },
  earningValue: { fontSize: Typography.md, fontWeight: '900' },
  earningLabel: { fontSize: Typography.xs, color: theme.subtext, marginTop: 2 },

  riderNote: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  riderNoteText: { fontSize: Typography.xs, color: theme.subtext },

  endBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.driverCyan,
    borderRadius: Radius.lg, paddingVertical: 16,
    
  },
  endBtnDisabled: { backgroundColor: theme.border },
  endBtnText: { fontSize: Typography.md, fontWeight: '900', color: theme.bg },
  endBtnTextDisabled: { color: theme.subtext },
}), [theme]);
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState<RidePhase>('to_pickup');
  const [carPosition, setCarPosition] = useState(DEMO_ROUTE[0]);
  const [routeIndex, setRouteIndex] = useState(0);
  const [sosActive, setSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);

  const mapRef = useRef<MapView>(null);
  const sosTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const progress = Math.min(elapsed / TOTAL_DURATION, 1);
  const etaMinutes = Math.max(0, Math.round((1 - progress) * 14));

  // ── Ride simulation ────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1;
        // Phase transitions
        if (next === 8 && phase === 'to_pickup') setPhase('active');
        if (next >= TOTAL_DURATION) {
          clearInterval(timer);
          setPhase('arrived');
        }
        return next;
      });

      setRouteIndex(prev => {
        const next = Math.min(prev + 1, DEMO_ROUTE.length - 1);
        setCarPosition(DEMO_ROUTE[next]);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    mapRef.current?.animateToRegion({
      ...carPosition,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    }, 600);
  }, [carPosition]);

  // ── SOS ───────────────────────────────────────────────────────────────────
  function activateSOS() {
    setSosActive(true);
    setSosCountdown(5);
    sosTimerRef.current = setInterval(() => {
      setSosCountdown(prev => {
        if (prev <= 1) {
          clearInterval(sosTimerRef.current!);
          Alert.alert(
            '🆘 SOS Activated',
            'Dispatch notified. Your location is live. Stay safe.',
            [{ text: 'Cancel SOS', style: 'destructive', onPress: cancelSOS }]
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function cancelSOS() {
    if (sosTimerRef.current) clearInterval(sosTimerRef.current);
    setSosActive(false);
    setSosCountdown(5);
  }

  function endRide() {
    Alert.alert(
      'End Ride',
      'Confirm you\'ve dropped off the rider at their destination.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End Ride', style: 'destructive', onPress: () => router.replace('/driver/home') },
      ]
    );
  }

  const phaseLabel = phase === 'to_pickup'
    ? `Heading to pickup · ${Math.max(0, 8 - elapsed)} min`
    : phase === 'active'
      ? `Ride in progress · ${etaMinutes} min remaining`
      : 'Arrived at destination';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={theme.bg} />

      {/* ── Status header ── */}
      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
          <Text style={styles.statusPhase}>{phaseLabel}</Text>
          <Text style={styles.statusRider}>
            {DEMO_RIDER.name} {DEMO_RIDER.lastName} · ⭐ 4.95
          </Text>
        </View>
        <RecordingBadge />
      </View>

      {/* ── Progress bar ── */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>

      {/* ── Map ── */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: DEMO_ROUTE[0].latitude,
            longitude: DEMO_ROUTE[0].longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Polyline coordinates={DEMO_ROUTE} strokeColor={Colors.driverCyan} strokeWidth={4} />
          <Marker coordinate={carPosition} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.carMarker}>
              <Ionicons name="car" size={18} color={theme.bg} />
            </View>
          </Marker>
          <Marker coordinate={DEMO_PICKUP}>
            <View style={styles.pickupMarker}>
              <Ionicons name="person" size={14} color={Colors.white} />
            </View>
          </Marker>
          <Marker coordinate={DEMO_DROPOFF}>
            <View style={styles.dropoffMarker}>
              <Ionicons name="location" size={20} color={Colors.brand} />
            </View>
          </Marker>
        </MapView>

        {/* SOS overlay */}
        {sosActive ? (
          <TouchableOpacity style={styles.sosCancelBtn} onPress={cancelSOS}>
            <Text style={styles.sosCancelTitle}>SOS in {sosCountdown}s</Text>
            <Text style={styles.sosCancelSub}>Tap to cancel</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.sosBtn} onPress={activateSOS} activeOpacity={0.85}>
            <Ionicons name="alert-circle" size={20} color={Colors.white} />
            <Text style={styles.sosBtnText}>SOS</Text>
          </TouchableOpacity>
        )}

        {/* Bluetooth button status */}
        <View style={styles.btStatus}>
          <Ionicons name="bluetooth" size={12} color={Colors.green} />
          <Text style={styles.btStatusText}>Armed</Text>
        </View>
      </View>

      {/* ── Bottom panel ── */}
      <View style={styles.bottomPanel}>

        {/* Destination */}
        <View style={styles.destRow}>
          <View style={styles.destIcon}>
            <Ionicons name="location" size={18} color={Colors.brand} />
          </View>
          <View style={styles.destCopy}>
            <Text style={styles.destLabel}>{DEMO_DROPOFF.name}</Text>
            <Text style={styles.destSub}>{DEMO_DROPOFF.address}</Text>
          </View>
          <Ionicons name="navigate" size={20} color={Colors.driverCyan} />
        </View>

        {/* Earnings preview */}
        <View style={styles.earningsRow}>
          {[
            ['Your earnings', `$${fare.driverEarnings}`, Colors.driverCyan],
            ['Gas adj.',      `+$${fare.gas > 0 ? fare.gas : '1.08'}`, Colors.green],
            ['Pickup comp.',  '+$0.04',                  Colors.green],
          ].map(([label, value, color]) => (
            <View key={label as string} style={styles.earningStat}>
              <Text style={[styles.earningValue, { color: color as string }]}>{value as string}</Text>
              <Text style={styles.earningLabel}>{label as string}</Text>
            </View>
          ))}
        </View>

        {/* Rider note */}
        <View style={styles.riderNote}>
          <Ionicons name="shield-checkmark" size={14} color={Colors.certText} />
          <Text style={styles.riderNoteText}>
            Female Driver Option ride · Dash cam active · Route monitored
          </Text>
        </View>

        {/* End ride button */}
        <TouchableOpacity
          style={[styles.endBtn, phase !== 'arrived' && styles.endBtnDisabled]}
          onPress={endRide}
          activeOpacity={0.85}
        >
          <Ionicons
            name="checkmark-circle"
            size={22}
            color={phase === 'arrived' ? theme.bg : theme.subtext}
          />
          <Text style={[styles.endBtnText, phase !== 'arrived' && styles.endBtnTextDisabled]}>
            {phase === 'arrived' ? 'Complete Ride' : `Complete Ride (${etaMinutes} min)`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

