/**
 * Driver Home
 * - Animated earnings overview
 * - Bottom nav: Earnings · Trips · Claude (rotating rim) · Profile · Settings
 * - Online toggle shows incoming ride requests
 * - Dark/light mode with 1.5s animated transition
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Animated, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow, DEMO_DRIVER } from '../../constants';
import { useTheme } from '../../context/ThemeContext';

// ── Demo data ─────────────────────────────────────────────────────────────────
const TODAY = {
  gross: 127.40, base: 95.55, gasAdj: 10.80, pickupComp: 6.05, tips: 15.00,
  trips: 8, miles: 46.2, onlineHours: 4.38, acceptance: 94, rating: 4.98,
};
const WEEK  = { gross: 684.20, trips: 43, miles: 298 };
const GOAL  = 800;
const RECENT = [
  { time: '9:22 AM', from: 'Uptown',          to: 'Love Field',   base: 14.40, gas: 1.08, tip: 3.00, miles: '7.2 mi' },
  { time: '8:05 AM', from: 'Knox-Henderson',  to: 'Downtown',     base:  9.00, gas: 0.72, tip: 2.00, miles: '4.8 mi' },
  { time: '7:18 AM', from: 'Lower Greenville', to: 'Uptown',      base:  6.75, gas: 0.47, tip: 1.00, miles: '3.1 mi' },
];

// Simulated incoming ride request
const DEMO_REQUEST = {
  rider: 'Jessica T.',
  rating: 4.92,
  from: 'Uptown Dallas',
  to: 'Baylor Medical Center',
  miles: 7.2, mins: 18,
  base: 14.40, gas: 1.08, tip: 0,
  tier: 'Standard',
  passMember: true,
  pickupDist: '0.4 mi',
  pickupMins: 3,
};

// ── Animated arc ──────────────────────────────────────────────────────────────
function AnimatedArc({ progress, size = 72, stroke = 6, color = Colors.driverCyan, trackColor = '#0F2A45' }: {
  progress: number; size?: number; stroke?: number; color?: string; trackColor?: string;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: progress, duration: 1000, useNativeDriver: false }).start();
  }, []);
  return (
    <View style={{ width: size, height: size }}>
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
        <View style={{ width: size, height: size, borderRadius: size/2, borderWidth: stroke, borderColor: trackColor }} />
      </View>
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
        <View style={{
          width: size, height: size, borderRadius: size/2, borderWidth: stroke,
          borderColor: color,
          borderTopColor:    progress > 0.75 ? color : 'transparent',
          borderRightColor:  progress > 0.5  ? color : 'transparent',
          borderBottomColor: progress > 0.25 ? color : 'transparent',
          borderLeftColor:   color,
          transform: [{ rotate: `${-90 + progress * 360}deg` }],
          opacity: progress > 0 ? 1 : 0,
        }} />
      </View>
    </View>
  );
}

function AnimatedBar({ progress, color, height = 5, trackColor = '#0F2A45' }: { progress: number; color: string; height?: number; trackColor?: string }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: progress, duration: 900, useNativeDriver: false }).start();
  }, []);
  const width = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', `${Math.min(progress * 100, 100)}%`] });
  return (
    <View style={{ height, backgroundColor: trackColor, borderRadius: height/2, overflow: 'hidden' }}>
      <Animated.View style={{ height, width, backgroundColor: color, borderRadius: height/2 }} />
    </View>
  );
}

function AnimatedNumber({ value, prefix = '', style }: { value: number; prefix?: string; style?: any }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    Animated.timing(anim, { toValue: value, duration: 1000, useNativeDriver: false }).start();
    const id = anim.addListener(({ value: v }) => {
      setDisplay(value % 1 === 0 ? Math.floor(v).toString() : v.toFixed(2));
    });
    return () => anim.removeListener(id);
  }, []);
  return <Text style={style}>{prefix}{display}</Text>;
}

export default function DriverHomeScreen() {
  const router  = useRouter();
  const { theme, fadeAnim, toggleMode } = useTheme();
const s = useMemo(() => StyleSheet.create({
  safe:         { flex: 1 },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 14 },
  headerLeft:   { flex: 1 },
  headerRight:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  greeting:     { fontSize: Typography.lg, fontWeight: '800' },
  onlineRow:    { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  onlineDot:    { width: 7, height: 7, borderRadius: 4 },
  onlineText:   { fontSize: Typography.sm },
  avatar:       { width: 38, height: 38, borderRadius: 19, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  avatarText:   { fontSize: 13, fontWeight: '800' },

  content:      { padding: 14, gap: 12 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },

  heroCard:     { borderRadius: Radius.xl, padding: 18, borderWidth: 1, gap: 16 },
  heroTop:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroLeft:     { flex: 1 },
  heroLabel:    { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  heroAmount:   { fontSize: 42, fontWeight: '900', marginTop: 4 },
  heroTrips:    { fontSize: Typography.sm, marginTop: 4 },
  heroArc:      { alignItems: 'center', justifyContent: 'center' },
  arcCenter:    { position: 'absolute', alignItems: 'center', justifyContent: 'center', width: 90, height: 90 },
  arcPct:       { fontSize: 17, fontWeight: '900' },
  arcLabel:     { fontSize: 10 },

  breakdownGrid:  { gap: 10 },
  breakdownItem:  { gap: 5 },
  breakdownTopRow:{ flexDirection: 'row', alignItems: 'center', gap: 6 },
  breakdownDot:   { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  breakdownLabel: { flex: 1, fontSize: Typography.sm },
  breakdownVal:   { fontSize: Typography.sm, fontWeight: '700' },

  weekCard:     { borderRadius: Radius.xl, padding: 18, borderWidth: 1, gap: 10 },
  weekTop:      { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  weekAmount:   { fontSize: 30, fontWeight: '900', marginTop: 4 },
  weekSub:      { fontSize: Typography.sm, marginTop: 2 },
  weekGoalWrap: { alignItems: 'flex-end' },
  weekGoalLabel:{ fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  weekGoalAmt:  { fontSize: Typography.lg, fontWeight: '800' },
  weekRemain:   { fontSize: Typography.sm },

  statsRow:     { flexDirection: 'row', gap: 10 },
  statCard:     { flex: 1, borderRadius: Radius.xl, borderWidth: 1, padding: 14, alignItems: 'center', gap: 8 },
  statArcCenter:{ alignItems: 'center', justifyContent: 'center' },
  statValue:    { fontSize: 14, fontWeight: '900' },
  statLabel:    { fontSize: 11, fontWeight: '600' },

  recentCard:   { borderRadius: Radius.xl, borderWidth: 1, overflow: 'hidden' },
  recentHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 12 },
  seeAll:       { fontSize: Typography.sm, fontWeight: '700' },
  rideRow:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  rideLeft:     { flex: 1 },
  rideTime:     { fontSize: Typography.xs, fontWeight: '600' },
  rideRoute:    { fontSize: Typography.base, fontWeight: '700', marginTop: 2 },
  rideMiles:    { fontSize: Typography.xs, marginTop: 1 },
  rideRight:    { alignItems: 'flex-end' },
  rideTotal:    { fontSize: Typography.md, fontWeight: '900' },
  rideBreak:    { fontSize: Typography.xs, marginTop: 1 },

  // ── Ride request card ──
  requestCard:  { position: 'absolute', left: 14, right: 14, bottom: 110, backgroundColor: theme.card, borderRadius: Radius.xl, borderWidth: 2, borderColor: '#00E5FF', padding: 18, gap: 14, shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 18, elevation: 12 },
  requestHeader:{ flexDirection: 'row', alignItems: 'center', gap: 10 },
  requestPulse: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.green + '22', alignItems: 'center', justifyContent: 'center' },
  requestPulseDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.green },
  requestTitle: { flex: 1, fontSize: Typography.lg, fontWeight: '900', color: theme.text },
  requestTimer: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.amber + '22', borderWidth: 2, borderColor: Colors.amber, alignItems: 'center', justifyContent: 'center' },
  requestTimerText: { fontSize: Typography.base, fontWeight: '900', color: Colors.amber },

  requestRoute: { flexDirection: 'row', gap: 12 },
  routeDots:    { alignItems: 'center', paddingTop: 4, gap: 0 },
  routeDotFrom: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.driverCyan },
  routeLineReq: { width: 1.5, height: 32, backgroundColor: theme.border },
  routeDotTo:   { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.green },
  routeLabels:  { flex: 1, gap: 4 },
  routeFrom:    { fontSize: Typography.md, fontWeight: '800', color: theme.text },
  routePickupDist: { fontSize: Typography.xs, color: theme.subtext },
  routeTo:      { fontSize: Typography.md, fontWeight: '800', color: theme.text, marginTop: 8 },
  routeTripDist:{ fontSize: Typography.xs, color: theme.subtext },

  requestEarnings: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: theme.bg, borderRadius: Radius.lg, padding: 12 },
  requestEarningsItem: { flex: 1, alignItems: 'center' },
  requestEarningsLabel:{ fontSize: Typography.xs, color: theme.subtext, fontWeight: '600' },
  requestEarningsVal:  { fontSize: Typography.lg, fontWeight: '800', marginTop: 2 },
  requestEarningsDivider: { width: 1, height: 40, backgroundColor: theme.border },

  requestPassBadge: { backgroundColor: Colors.brand + '18', borderRadius: Radius.md, padding: 8, alignItems: 'center' },
  requestPassText:  { fontSize: Typography.sm, fontWeight: '700', color: Colors.brand },

  requestBtns:    { flexDirection: 'row', gap: 10 },
  requestDecline: { flex: 1, paddingVertical: 16, borderRadius: Radius.lg, borderWidth: 1, borderColor: theme.border, alignItems: 'center' },
  requestDeclineText: { fontSize: Typography.base, fontWeight: '700', color: theme.subtext },
  requestAccept:  { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: Radius.lg, backgroundColor: Colors.green },
  requestAcceptText: { fontSize: Typography.md, fontWeight: '900', color: Colors.white },

  // ── Safety Hub card ──
  safetyCard:        { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.brand, borderRadius: Radius.xl, padding: 16, borderWidth: 0, gap: 12, shadowColor: Colors.brand, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 5 },
  safetyLeft:        { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 14 },
  safetyIconWrap:    { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  safetyCopy:        { flex: 1 },
  safetyTitleRow:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  safetyTitle:       { fontSize: Typography.lg, fontWeight: '900', color: Colors.white },
  safetyActiveBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.green + '22', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
  safetyActiveDot:   { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.green },
  safetyActiveText:  { fontSize: 9, fontWeight: '800', color: Colors.green, letterSpacing: 0.5 },
  safetySub:         { fontSize: Typography.xs, color: 'rgba(255,255,255,0.75)', marginTop: 3 },

  // ── Bottom nav ──
  bottomNav:      { flexDirection: 'row', borderTopWidth: 1, paddingBottom: 20, paddingTop: 10, paddingHorizontal: 8, alignItems: 'flex-end' },
  navItem:        { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 4 },
  navLabel:       { fontSize: 10, fontWeight: '600' },

  navClaudeBtn:   { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 4 },
  navClaudeOuter: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', marginTop: -24 },
  navClaudeRing:  { position: 'absolute', width: 56, height: 56, borderRadius: 28 },
  navClaudeArc1:  {
    position: 'absolute', width: 56, height: 56, borderRadius: 28,
    borderWidth: 2.5, borderColor: 'transparent',
    borderTopColor: '#00E5FF', borderRightColor: '#00E5FF88',
    shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: 8,
  },
  navClaudeArc2:  {
    position: 'absolute', width: 56, height: 56, borderRadius: 28,
    borderWidth: 2.5, borderColor: 'transparent',
    borderBottomColor: '#00E5FF55', borderLeftColor: '#00E5FF22',
  },
  navClaudeInner: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', shadowColor: '#0077CC', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 8 },
  navClaudeIcon:  { fontSize: 22, color: Colors.white, fontWeight: '900' },
  navClaudeLabel: { fontSize: 10, fontWeight: '800' },
}), [theme]);
  const driver  = DEMO_DRIVER;
  const isDark  = theme.mode === 'dark';

  const [isOnline, setIsOnline]         = useState(false);
  const [showRequest, setShowRequest]   = useState(false);
  const [requestTimer, setRequestTimer] = useState(15);
  const requestAnim = useRef(new Animated.Value(0)).current;

  // Rotating liquid light for Claude button
  const rotateAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 2200, useNativeDriver: false })
    ).start();
  }, []);
  const rotateDeg = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  // Slide-up request card animation
  useEffect(() => {
    if (showRequest) {
      Animated.spring(requestAnim, { toValue: 1, useNativeDriver: false, tension: 65, friction: 9 }).start();
    } else {
      Animated.timing(requestAnim, { toValue: 0, duration: 250, useNativeDriver: false }).start();
    }
  }, [showRequest]);

  // When driver goes online, simulate incoming request after 3 seconds
  useEffect(() => {
    if (isOnline) {
      const t = setTimeout(() => setShowRequest(true), 3000);
      return () => clearTimeout(t);
    } else {
      setShowRequest(false);
      setRequestTimer(15);
    }
  }, [isOnline]);

  // Request countdown timer
  useEffect(() => {
    if (!showRequest) return;
    if (requestTimer <= 0) { setShowRequest(false); return; }
    const t = setInterval(() => setRequestTimer(n => n - 1), 1000);
    return () => clearInterval(t);
  }, [showRequest, requestTimer]);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const total    = TODAY.base + TODAY.gasAdj + TODAY.pickupComp + TODAY.tips;

  const requestSlide = requestAnim.interpolate({
    inputRange: [0, 1], outputRange: [300, 0],
  });

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <SafeAreaView style={[s.safe, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

        {/* Header */}
        <View style={[s.header, { backgroundColor: theme.bg }]}>
          <View style={s.headerLeft}>
            <Text style={[s.greeting, { color: theme.text }]}>{greeting}, {driver.name.split(' ')[0]}</Text>
            <View style={s.onlineRow}>
              <View style={[s.onlineDot, { backgroundColor: isOnline ? Colors.green : theme.muted }]} />
              <Text style={[s.onlineText, { color: theme.subtext }]}>
                {isOnline ? 'Online · accepting rides' : 'Offline'}
              </Text>
            </View>
          </View>
          <View style={s.headerRight}>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: theme.border, true: Colors.green + '88' }}
              thumbColor={isOnline ? Colors.green : theme.subtext}
            />
            <TouchableOpacity
              style={[s.avatar, { backgroundColor: theme.accentGlow, borderColor: theme.accent + '44' }]}
              onPress={() => router.push('/driver/profile')}>
              <Text style={[s.avatarText, { color: theme.accent }]}>MS</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={[s.content, { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}>

          {/* Earnings hero */}
          {/* ── Safety Hub card ── */}
        <TouchableOpacity
          style={s.safetyCard}
          onPress={() => router.push('/driver/safety')}
          activeOpacity={0.88}
        >
          <View style={s.safetyLeft}>
            <View style={s.safetyIconWrap}>
              <Ionicons name="shield-checkmark" size={26} color="#00E5FF" />
            </View>
            <View style={s.safetyCopy}>
              <View style={s.safetyTitleRow}>
                <Text style={s.safetyTitle}>Safety Hub</Text>
                <View style={s.safetyActiveBadge}>
                  <View style={s.safetyActiveDot} />
                  <Text style={s.safetyActiveText}>ACTIVE</Text>
                </View>
              </View>
              <Text style={s.safetySub}>Dash cam · Route monitoring · SOS ready</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#00E5FF" />
        </TouchableOpacity>

        {/* ── Earnings hero ── */}
        <View style={[s.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={s.heroTop}>
              <View style={s.heroLeft}>
                <Text style={[s.heroLabel, { color: theme.muted }]}>TODAY</Text>
                <AnimatedNumber value={total} prefix="$" style={[s.heroAmount, { color: theme.text }]} />
                <Text style={[s.heroTrips, { color: theme.subtext }]}>
                  {TODAY.trips} trips · {TODAY.miles} mi · {TODAY.onlineHours.toFixed(1)}h online
                </Text>
              </View>
              <View style={s.heroArc}>
                <AnimatedArc progress={total / (GOAL / 5)} size={90} stroke={7} color={theme.accent} trackColor={theme.border} />
                <View style={s.arcCenter}>
                  <Text style={[s.arcPct, { color: theme.accent }]}>{Math.round((total / (GOAL / 5)) * 100)}%</Text>
                  <Text style={[s.arcLabel, { color: theme.subtext }]}>goal</Text>
                </View>
              </View>
            </View>

            {/* Breakdown bars */}
            <View style={s.breakdownGrid}>
              {[
                { label: 'Base (75%)',  value: TODAY.base,        color: theme.accent },
                { label: 'Gas adj',     value: TODAY.gasAdj,      color: Colors.green },
                { label: 'Pickup comp', value: TODAY.pickupComp,  color: Colors.amber },
                { label: 'Tips',        value: TODAY.tips,        color: '#A78BFA' },
              ].map(item => (
                <View key={item.label} style={s.breakdownItem}>
                  <View style={s.breakdownTopRow}>
                    <View style={[s.breakdownDot, { backgroundColor: item.color }]} />
                    <Text style={[s.breakdownLabel, { color: theme.subtext }]}>{item.label}</Text>
                    <Text style={[s.breakdownVal, { color: item.color }]}>${item.value.toFixed(2)}</Text>
                  </View>
                  <AnimatedBar progress={item.value / total} color={item.color} trackColor={theme.border} />
                </View>
              ))}
            </View>
          </View>

          {/* Weekly progress */}
          <View style={[s.weekCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={s.weekTop}>
              <View>
                <Text style={[s.sectionLabel, { color: theme.muted }]}>THIS WEEK</Text>
                <AnimatedNumber value={WEEK.gross} prefix="$" style={[s.weekAmount, { color: theme.text }]} />
                <Text style={[s.weekSub, { color: theme.subtext }]}>{WEEK.trips} trips · {WEEK.miles} mi</Text>
              </View>
              <View style={s.weekGoalWrap}>
                <Text style={[s.weekGoalLabel, { color: theme.muted }]}>GOAL</Text>
                <Text style={[s.weekGoalAmt, { color: theme.subtext }]}>${GOAL}</Text>
              </View>
            </View>
            <AnimatedBar progress={WEEK.gross / GOAL} color={theme.accent} height={8} trackColor={theme.border} />
            <Text style={[s.weekRemain, { color: theme.subtext }]}>
              ${(GOAL - WEEK.gross).toFixed(2)} to reach your weekly goal
            </Text>
          </View>

          {/* Stats row */}
          <View style={s.statsRow}>
            {[
              { label: 'Acceptance', value: `${TODAY.acceptance}%`, color: Colors.green,  progress: TODAY.acceptance / 100, track: theme.border },
              { label: 'Rating',     value: `${TODAY.rating}`,      color: Colors.amber,  progress: TODAY.rating / 5, track: theme.border },
              { label: 'Online',     value: `${TODAY.onlineHours.toFixed(1)}h`, color: theme.accent, progress: TODAY.onlineHours / 8, track: theme.border },
            ].map(stat => (
              <View key={stat.label} style={[s.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <AnimatedArc progress={stat.progress} size={64} stroke={5} color={stat.color} trackColor={stat.track || theme.border} />
                <View style={[s.statArcCenter, { width: 64, height: 64, position: 'absolute' }]}>
                  <Text style={[s.statValue, { color: stat.color }]}>{stat.value}</Text>
                </View>
                <Text style={[s.statLabel, { color: theme.subtext }]}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Recent rides */}
          <View style={[s.recentCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={s.recentHeader}>
              <Text style={[s.sectionLabel, { color: theme.muted }]}>RECENT RIDES</Text>
              <TouchableOpacity onPress={() => router.push('/driver/trips')}>
                <Text style={[s.seeAll, { color: theme.accent }]}>See all</Text>
              </TouchableOpacity>
            </View>
            {RECENT.map((ride, i) => (
              <View key={i} style={[s.rideRow, i < RECENT.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
                <View style={s.rideLeft}>
                  <Text style={[s.rideTime, { color: theme.muted }]}>{ride.time}</Text>
                  <Text style={[s.rideRoute, { color: theme.text }]}>{ride.from} → {ride.to}</Text>
                  <Text style={[s.rideMiles, { color: theme.subtext }]}>{ride.miles}</Text>
                </View>
                <View style={s.rideRight}>
                  <Text style={[s.rideTotal, { color: Colors.green }]}>${(ride.base + ride.gas + ride.tip).toFixed(2)}</Text>
                  <Text style={[s.rideBreak, { color: theme.subtext }]}>Base ${ride.base.toFixed(2)}</Text>
                  {ride.tip > 0 && <Text style={[s.rideBreak, { color: '#A78BFA' }]}>+ ${ride.tip.toFixed(2)} tip</Text>}
                </View>
              </View>
            ))}
          </View>

        </ScrollView>

        {/* ── Incoming ride request (slide up when online) ── */}
        {showRequest && (
          <Animated.View style={[s.requestCard, { transform: [{ translateY: requestSlide }] }]}>
            <View style={s.requestHeader}>
              <View style={s.requestPulse}>
                <View style={s.requestPulseDot} />
              </View>
              <Text style={s.requestTitle}>Ride Request</Text>
              <View style={s.requestTimer}>
                <Text style={s.requestTimerText}>{requestTimer}s</Text>
              </View>
            </View>

            <View style={s.requestRoute}>
              <View style={s.routeDots}>
                <View style={s.routeDotFrom} />
                <View style={s.routeLineReq} />
                <View style={s.routeDotTo} />
              </View>
              <View style={s.routeLabels}>
                <Text style={s.routeFrom}>{DEMO_REQUEST.from}</Text>
                <Text style={s.routePickupDist}>Pickup {DEMO_REQUEST.pickupDist} · {DEMO_REQUEST.pickupMins} min away</Text>
                <Text style={s.routeTo}>{DEMO_REQUEST.to}</Text>
                <Text style={s.routeTripDist}>{DEMO_REQUEST.miles} mi · ~{DEMO_REQUEST.mins} min ride</Text>
              </View>
            </View>

            <View style={s.requestEarnings}>
              {[
                { label: 'Base (75%)', value: DEMO_REQUEST.base,  color: Colors.driverCyan },
                { label: 'Gas adj',    value: DEMO_REQUEST.gas,   color: Colors.green },
              ].map(e => (
                <View key={e.label} style={s.requestEarningsItem}>
                  <Text style={s.requestEarningsLabel}>{e.label}</Text>
                  <Text style={[s.requestEarningsVal, { color: e.color }]}>${e.value.toFixed(2)}</Text>
                </View>
              ))}
              <View style={s.requestEarningsDivider} />
              <View style={s.requestEarningsItem}>
                <Text style={[s.requestEarningsLabel, { fontWeight: '800', color: theme.text }]}>You earn</Text>
                <Text style={[s.requestEarningsVal, { color: Colors.green, fontSize: 20, fontWeight: '900' }]}>
                  ${(DEMO_REQUEST.base + DEMO_REQUEST.gas).toFixed(2)}
                </Text>
              </View>
            </View>

            {DEMO_REQUEST.passMember && (
              <View style={s.requestPassBadge}>
                <Text style={s.requestPassText}>✦ Wem Pass member — reliable rider</Text>
              </View>
            )}

            <View style={s.requestBtns}>
              <TouchableOpacity
                style={s.requestDecline}
                onPress={() => { setShowRequest(false); setRequestTimer(15); }}>
                <Text style={s.requestDeclineText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.requestAccept}
                onPress={() => { setShowRequest(false); router.push('/driver/active'); }}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
                <Text style={s.requestAcceptText}>Accept Ride</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* ── Bottom nav ── */}
        <View style={[s.bottomNav, { backgroundColor: theme.navBg, borderTopColor: theme.navBorder }]}>
          <TouchableOpacity style={s.navItem} onPress={() => router.push('/driver/earnings')}>
            <Ionicons name="cash" size={22} color={theme.navActive} />
            <Text style={[s.navLabel, { color: theme.navActive }]}>Earnings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.navItem} onPress={() => router.push('/driver/trips')}>
            <Ionicons name="navigate" size={22} color={theme.navInactive} />
            <Text style={[s.navLabel, { color: theme.navInactive }]}>Trips</Text>
          </TouchableOpacity>

          {/* Claude center — rotating liquid rim */}
          <TouchableOpacity
            style={s.navClaudeBtn}
            onPress={() => router.push('/driver/support')}
            activeOpacity={0.85}>
            <View style={s.navClaudeOuter}>
              <Animated.View style={[s.navClaudeRing, { transform: [{ rotate: rotateDeg }] }]}>
                <View style={s.navClaudeArc1} />
                <View style={s.navClaudeArc2} />
              </Animated.View>
              <View style={[s.navClaudeInner, { backgroundColor: theme.accent }]}>
                <Text style={s.navClaudeIcon}>✦</Text>
              </View>
            </View>
            <Text style={[s.navClaudeLabel, { color: theme.accent }]}>Claude</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.navItem} onPress={() => router.push('/driver/profile')}>
            <Ionicons name="person" size={22} color={theme.navInactive} />
            <Text style={[s.navLabel, { color: theme.navInactive }]}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.navItem} onPress={() => router.push('/driver/settings')}>
            <Ionicons name="settings" size={22} color={theme.navInactive} />
            <Text style={[s.navLabel, { color: theme.navInactive }]}>Settings</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </Animated.View>
  );
}

