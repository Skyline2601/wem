import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, TextInput, Animated, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius, Shadow, DEMO_RIDER, FARE_CONFIG } from '../../constants';
import WemCard from '../../components/shared/WemCard';
import { PassBadge, FemaleDriverPrefBadge } from '../../components/shared/Badges';
import WemButton from '../../components/shared/WemButton';
import { useTheme } from '../../context/ThemeContext';

// Wem Go — 6 slots (3 visible, 3 scrollable). empty:true = open slot
const WEM_GO_PLACES = [
  { id: 'home',      icon: 'home',      label: 'Home',      sub: '2847 Maple Ave',    empty: false },
  { id: 'work',      icon: 'briefcase', label: 'Work',      sub: '350 N St Paul St',  empty: false },
  { id: 'add1',      icon: 'add-circle',label: 'Add Place', sub: '',                  empty: true  },
  { id: 'airport',   icon: 'airplane',  label: 'Love Field',sub: 'DAL Airport',       empty: false },
  { id: 'add2',      icon: 'add-circle',label: 'Add Place', sub: '',                  empty: true  },
  { id: 'add3',      icon: 'add-circle',label: 'Add Place', sub: '',                  empty: true  },
];

export default function RiderHomeScreen() {
  const router = useRouter();
  const rider = DEMO_RIDER;
  const { theme, fadeAnim } = useTheme();
  const wemGoPlaces = WEM_GO_PLACES;
const styles = useMemo(() => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  greeting: {
    fontSize: Typography.lg,
    fontWeight: '800',
    color: theme.text,
  },
  subgreeting: {
    fontSize: Typography.sm,
    color: theme.subtext,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: Typography.sm,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: Spacing.md,
    gap: Spacing.md,
  },

  // Profile nudge
  nudgeCard: { marginBottom: 0 },
  nudgeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nudgeIcon: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.brandGlow,
    alignItems: 'center', justifyContent: 'center',
  },
  nudgeCopy: { flex: 1 },
  nudgeTitle: { fontSize: Typography.sm, fontWeight: '800', color: theme.text },
  nudgeSub: { fontSize: Typography.xs, color: theme.subtext, marginTop: 1 },
  nudgeBtns: { flexDirection: 'row', gap: 6 },
  nudgeLater: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: Radius.sm, borderWidth: 1, borderColor: theme.border,
  },
  nudgeLaterText: { fontSize: Typography.xs, fontWeight: '600', color: theme.muted },
  nudgeSetup: {
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: Radius.sm, backgroundColor: Colors.brand,
  },
  nudgeSetupText: { fontSize: Typography.xs, fontWeight: '700', color: Colors.white },

  // Book card
  bookCard: { padding: Spacing.md },
  claudeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: theme.card,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1, borderColor: theme.border,
  },
  claudeIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  claudeIconText: { color: Colors.white, fontSize: 16, fontWeight: '900' },
  claudeCopy: { flex: 1 },
  claudeLabel: { fontSize: Typography.base, fontWeight: '800', color: theme.text },
  claudeSub: { fontSize: Typography.xs, color: theme.subtext, marginTop: 2 },
  dividerRow: {
    flexDirection: 'row', alignItems: 'center',
    marginVertical: Spacing.md, gap: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.border },
  dividerText: { fontSize: Typography.xs, color: theme.muted, fontWeight: '600' },
  searchGlow:        {
    position: 'absolute',
    left: -3, right: -3, top: -3, bottom: -3,
    borderRadius: Radius.lg + 3,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#00E5FF',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 0,
    zIndex: 0,
  },
  searchBarGlowBorder: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: '#00E5FF',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
    searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: theme.bg,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: '#00E5FF33',
  },
  searchPlaceholder: { fontSize: Typography.base, color: theme.muted },

  // ── Wem Go section ──
  wemGoSection:      { backgroundColor: theme.mode === 'dark' ? '#0E2D52' : '#C8E0F8', borderRadius: Radius.xl, padding: 16, borderWidth: 1, borderColor: theme.mode === 'dark' ? '#0A84FF44' : '#0A84FF55', overflow: 'hidden' },
  wemGoHeader:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  wemGoTitleRow:     { flexDirection: 'row', alignItems: 'center', gap: 6 },
  wemGoSectionTitle: { fontSize: Typography.md, fontWeight: '900', color: theme.mode === 'dark' ? '#00AAFF' : '#0055CC', letterSpacing: 0.5 },
  wemGoSectionSub:   { fontSize: Typography.sm, color: theme.mode === 'dark' ? '#7EC8FF' : '#0055CC', fontWeight: '700' },
  wemGoScroll:       { gap: 10, paddingRight: 4 },
  wemGoTile:         { width: 100, alignItems: 'center', backgroundColor: theme.mode === 'dark' ? '#00AAFF14' : 'rgba(10,132,255,0.08)', borderRadius: Radius.lg, padding: 14, borderWidth: 1, borderColor: theme.mode === 'dark' ? '#00AAFF33' : 'rgba(10,132,255,0.2)', gap: 6 },
  wemGoTileEmpty:    { backgroundColor: 'transparent', borderColor: '#00AAFF18', borderStyle: 'dashed' },
  wemGoTileIcon:     { width: 46, height: 46, borderRadius: 23, backgroundColor: '#00AAFF22', alignItems: 'center', justifyContent: 'center' },
  wemGoTileIconEmpty:{ backgroundColor: 'transparent' },
  wemGoTileLabel:    { fontSize: Typography.sm, fontWeight: '800', color: theme.mode === 'dark' ? '#E0F4FF' : '#003399', textAlign: 'center' },
  wemGoTileLabelEmpty:{ color: theme.mode === 'dark' ? '#7EC8FF' : '#003399' },
  wemGoTileSub:      { fontSize: Typography.sm, color: theme.mode === 'dark' ? '#7EC8FF' : '#004499', textAlign: 'center', fontWeight: '600' },
  wemGoTileAdd:      { fontSize: Typography.sm, color: theme.mode === 'dark' ? '#7EC8FF' : '#003399', fontWeight: '800' },

  // Section label
  sectionLabel: {
    fontSize: Typography.xs, fontWeight: '700',
    color: theme.muted, letterSpacing: 0.8,
    marginBottom: -Spacing.sm,
  },

  // Pass card
  passCard: { padding: Spacing.md },
  passRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  passActive: { fontSize: 12, fontWeight: '700', color: Colors.green },
  passDesc: { fontSize: Typography.xs, color: theme.subtext, lineHeight: 18 },
  passPromoCard: { padding: Spacing.md },
  passPromoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  passPromoTitle: { fontSize: Typography.base, fontWeight: '800', color: theme.text },
  passPromoCopy: { fontSize: Typography.xs, color: theme.subtext, marginTop: 2 },
  passPromoBtn: {
    backgroundColor: Colors.brand, paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: Radius.md,
  },
  passPromoBtnText: { color: Colors.white, fontWeight: '700', fontSize: Typography.sm },

  // Safety card
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

  // Bottom nav
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: theme.card,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  // Pickup row on home
  pickupRow:     { flexDirection: 'row', alignItems: 'center', gap: 10, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 10, marginTop: 4 },
  pickupDotWrap: { width: 24, alignItems: 'center' },
  pickupDot:     { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.green },
  pickupCopy:    { flex: 1 },
  pickupLabel:   { fontSize: 10, fontWeight: '700', color: theme.muted, letterSpacing: 0.6 },
  pickupAddr:    { fontSize: Typography.base, fontWeight: '700', color: theme.text, marginTop: 1 },
  pickupChange:  { fontSize: Typography.sm, fontWeight: '700', color: Colors.brand },

  navItem:        { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 4 },
  navLabel:       { fontSize: 10, color: theme.muted, fontWeight: '600' },
  navLabelActive: { color: Colors.brand },
  navClaudeBtn:    { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 4 },
  navClaudeOuter:  { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', marginTop: -24 },
  navClaudeRing:   { position: 'absolute', width: 56, height: 56, borderRadius: 28 },
  navClaudeArc1:   {
    position: 'absolute', width: 56, height: 56, borderRadius: 28,
    borderWidth: 2.5, borderColor: 'transparent',
    borderTopColor: '#00E5FF',
    borderRightColor: '#00E5FF88',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  navClaudeArc2:   {
    position: 'absolute', width: 56, height: 56, borderRadius: 28,
    borderWidth: 2.5, borderColor: 'transparent',
    borderBottomColor: '#00E5FF55',
    borderLeftColor: '#00E5FF22',
  },
  navClaudeInner:  { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center', shadowColor: '#0077CC', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 8 },
  navClaudeIcon:   { fontSize: 22, color: Colors.white, fontWeight: '900' },
  navClaudeLabel:  { fontSize: 10, color: Colors.brand, fontWeight: '800' },
}), [theme]);
  // ── Auto Wem Go routing ───────────────────────────────────────────────
  // Production: checks GPS vs Google Places + time of night
  // Demo: set isAtVenue = true to preview the auto-routing behaviour
  useEffect(() => {
    const hour = new Date().getHours();
    const isNightTime = hour >= 21 || hour < 3;
    const isAtVenue = false; // flip to true to demo auto-routing
    if (isNightTime && isAtVenue) {
      router.replace('/rider/saferide');
    }
  }, []);

    const [profileComplete] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Pulse glow on destination search bar
  const pulseAnim = useRef(new Animated.Value(0)).current;
  // Rotating liquid light on Claude nav button
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Search bar pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1400, useNativeDriver: false }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1400, useNativeDriver: false }),
      ])
    ).start();
    // Claude button rotation — continuous spin
    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 2200, useNativeDriver: false })
    ).start();
  }, []);

  const glowOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.0, 1.0] });
  const glowScale   = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1.0, 1.02] });
  const rotateDeg   = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.bg} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}, {rider.name}</Text>
          <Text style={styles.subgreeting}>Where are you headed today?</Text>
        </View>
        <View style={styles.headerRight}>
          {rider.hasPass && <PassBadge small />}
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => router.push('/rider/profile')}
          >
            <Text style={styles.avatarText}>
              {rider.name[0]}{rider.lastName[0]}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Profile completion nudge ── */}
        {!profileComplete && (
          <WemCard style={styles.nudgeCard} glow>
            <View style={styles.nudgeRow}>
              <View style={styles.nudgeIcon}>
                <Ionicons name="person" size={18} color={Colors.brand} />
              </View>
              <View style={styles.nudgeCopy}>
                <Text style={styles.nudgeTitle}>Complete your profile</Text>
                <Text style={styles.nudgeSub}>Add photo, preferences & emergency contact</Text>
              </View>
              <View style={styles.nudgeBtns}>
                <TouchableOpacity style={styles.nudgeLater}>
                  <Text style={styles.nudgeLaterText}>Later</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.nudgeSetup}
                  onPress={() => router.push('/rider/profile')}
                >
                  <Text style={styles.nudgeSetupText}>Set Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </WemCard>
        )}

        {/* ── Safety Hub card ── */}
        <TouchableOpacity
          style={styles.safetyCard}
          onPress={() => router.push('/rider/safety')}
          activeOpacity={0.88}
        >
          <View style={styles.safetyLeft}>
            <View style={styles.safetyIconWrap}>
              <Ionicons name="shield-checkmark" size={26} color="#00E5FF" />
            </View>
            <View style={styles.safetyCopy}>
              <View style={styles.safetyTitleRow}>
                <Text style={styles.safetyTitle}>Safety Hub</Text>
                <View style={styles.safetyActiveBadge}>
                  <View style={styles.safetyActiveDot} />
                  <Text style={styles.safetyActiveText}>8 ACTIVE</Text>
                </View>
              </View>
              <Text style={styles.safetySub}>Dash cam · AI monitoring · SOS · Guest link</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#00E5FF" />
        </TouchableOpacity>

        {/* ── Where to — booking entry ── */}
        <WemCard style={styles.bookCard}>
          {/* Classic search — pulsing glow */}
          <Animated.View style={[
            styles.searchGlow,
            { opacity: glowOpacity, transform: [{ scale: glowScale }] }
          ]} />
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => router.push('/rider/classic')}
            activeOpacity={0.85}
          >
            <Ionicons name="search" size={16} color={Colors.brand} />
            <Text style={styles.searchPlaceholder}>Enter destination · or book with Claude ↓</Text>
            <Animated.View style={[styles.searchBarGlowBorder, { opacity: glowOpacity }]} />
          </TouchableOpacity>

          {/* Pickup row */}
          <TouchableOpacity
            style={styles.pickupRow}
            onPress={() => router.push('/rider/classic')}
            activeOpacity={0.8}
          >
            <View style={styles.pickupDotWrap}>
              <View style={styles.pickupDot} />
            </View>
            <View style={styles.pickupCopy}>
              <Text style={styles.pickupLabel}>PICKUP</Text>
              <Text style={styles.pickupAddr}>Current location</Text>
            </View>
            <Text style={styles.pickupChange}>Change · add stop(s)</Text>
          </TouchableOpacity>
        </WemCard>

        {/* ── Wem Go section ── */}
        <View style={styles.wemGoSection}>
          {/* Header row */}
          <View style={styles.wemGoHeader}>
            <View style={styles.wemGoTitleRow}>
              <Ionicons name="flash" size={16} color="#00AAFF" />
              <Text style={styles.wemGoSectionTitle}>Wem Go</Text>
            </View>
            <Text style={styles.wemGoSectionSub}>Tap to book instantly</Text>
          </View>

          {/* Scrollable tiles */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.wemGoScroll}
          >
            {wemGoPlaces.map((place, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.wemGoTile,
                  place.empty && styles.wemGoTileEmpty,
                ]}
                onPress={() => place.empty
                  ? router.push('/rider/profile')
                  : router.push(('/rider/classic?dest=' + place.id) as any)
                }
                activeOpacity={0.82}
              >
                <View style={[
                  styles.wemGoTileIcon,
                  place.empty && styles.wemGoTileIconEmpty,
                ]}>
                  <Ionicons
                    name={place.icon as any}
                    size={22}
                    color={place.empty ? '#00AAFF66' : '#00AAFF'}
                  />
                </View>
                <Text style={[
                  styles.wemGoTileLabel,
                  place.empty && styles.wemGoTileLabelEmpty,
                ]}>
                  {place.label}
                </Text>
                {place.sub ? (
                  <Text style={styles.wemGoTileSub} numberOfLines={1}>
                    {place.sub}
                  </Text>
                ) : (
                  <Text style={styles.wemGoTileAdd}>+ Add</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Wem Pass card ── */}
        {rider.hasPass ? (
          <WemCard style={styles.passCard} glow>
            <View style={styles.passRow}>
              <PassBadge />
              <Text style={styles.passActive}>Active</Text>
            </View>
            <Text style={styles.passDesc}>
              Surge waived (1.5x cap removed) · Gas adj. waived · Pickup fees waived · Enhanced Claude AI
            </Text>
          </WemCard>
        ) : (
          <WemCard style={styles.passPromoCard}>
            <View style={styles.passPromoRow}>
              <View>
                <Text style={styles.passPromoTitle}>Try Wem Pass</Text>
                <Text style={styles.passPromoCopy}>No surge, no gas fees, no pickup fees · $14.99/mo</Text>
              </View>
              <TouchableOpacity style={styles.passPromoBtn}>
                <Text style={styles.passPromoBtnText}>Get Pass</Text>
              </TouchableOpacity>
            </View>
          </WemCard>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── Bottom nav ── */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/rider/home')}>
          <Ionicons name="home" size={22} color={Colors.brand} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/rider/trips')}>
          <Ionicons name="time" size={22} color={theme.muted} />
          <Text style={styles.navLabel}>Trips</Text>
        </TouchableOpacity>

        {/* Claude center button — elevated with rotating liquid rim */}
        <TouchableOpacity
          style={styles.navClaudeBtn}
          onPress={() => router.push('/rider/claude')}
          activeOpacity={0.85}
        >
          <View style={styles.navClaudeOuter}>
            {/* Rotating conic glow ring */}
            <Animated.View style={[
              styles.navClaudeRing,
              { transform: [{ rotate: rotateDeg }] }
            ]}>
              <View style={styles.navClaudeArc1} />
              <View style={styles.navClaudeArc2} />
            </Animated.View>
            <View style={styles.navClaudeInner}>
              <Text style={styles.navClaudeIcon}>✦</Text>
            </View>
          </View>
          <Text style={styles.navClaudeLabel}>Claude</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/rider/profile')}>
          <Ionicons name="person" size={22} color={theme.muted} />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/rider/settings')}>
          <Ionicons name="settings" size={22} color={theme.muted} />
          <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
    </Animated.View>
  );
}

