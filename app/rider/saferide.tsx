/**
 * Wem Go Screen
 *
 * Wem's proactive safety feature for impaired riders.
 * Three states:
 *   'preview'   — rider is sober, setting up pre-planned ride home
 *   'impaired'  — rider is at a venue, needs simplified big-button UI
 *   'active'    — ride is booked, Claude doing check-ins
 */
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { Colors, Typography, Spacing, Radius, DEMO_DRIVER } from '../../constants';

// Demo data — in production this comes from GPS + Google Places
const DEMO_VENUE    = 'The Rustic — 3656 Howell St, Dallas';
const DEMO_HOME     = '2847 Maple Ave, Dallas';
const DEMO_ETAs     = ['3 min', '5 min', '8 min'];
const DEMO_SAFE_SPOTS = [
  { icon: 'home',      label: 'Home',          sub: '2847 Maple Ave' },
  { icon: 'briefcase', label: 'Work',           sub: '350 N St Paul St' },
  { icon: 'star',      label: 'Jessica\'s',     sub: '811 Ross Ave, Dallas' },
];

// Demo mode toggle — in production 'impaired' mode activates automatically
// when GPS shows rider has been at an alcohol-serving venue for 1+ hours
type Mode = 'preview' | 'impaired' | 'booked';

export default function SafeRideScreen() {
  const router = useRouter();
  const { theme } = useTheme();
const s = useMemo(() => StyleSheet.create({
  safe:         { flex: 1, backgroundColor: theme.bg },

  // Header
  header:       { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: theme.card, borderBottomWidth: 1, borderBottomColor: theme.border, gap: 10 },
  backBtn:      { padding: 4 },
  headerTitle:  { flex: 1, fontSize: Typography.md, fontWeight: '800', color: theme.text },
  demoImpaired: { backgroundColor: Colors.brandGlow, borderRadius: Radius.sm, paddingHorizontal: 10, paddingVertical: 5 },
  demoImpairedText: { fontSize: 11, fontWeight: '700', color: Colors.brand },

  content:      { padding: 14, gap: 14 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: theme.muted, letterSpacing: 0.8, marginTop: 4 },

  // Hero
  hero:         { backgroundColor: Colors.brand, borderRadius: Radius.xl, padding: 18, gap: 12 },
  heroTopRow:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroIcon:     { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  heroCopy:     { flex: 1 },
  heroTitle:    { fontSize: Typography.xl, fontWeight: '900', color: Colors.white },
  heroSub:      { fontSize: Typography.sm, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  heroBody:     { fontSize: Typography.sm, color: 'rgba(255,255,255,0.88)', lineHeight: 21 },

  // Claude proactive card
  claudeCard:   { backgroundColor: theme.card, borderRadius: Radius.xl, borderWidth: 1.5, borderColor: Colors.brand + '40', padding: 16, gap: 12 },
  claudeHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  claudeIcon:   { width: 34, height: 34, borderRadius: 10, backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center' },
  claudeIconText: { color: Colors.white, fontSize: 16, fontWeight: '900' },
  claudeTitle:  { fontSize: Typography.base, fontWeight: '800', color: theme.text },
  claudeMsg:    { fontSize: Typography.base, color: theme.subtext, lineHeight: 22 },
  claudeActions:{ flexDirection: 'row', gap: 10 },
  claudeYes:    { flex: 1, backgroundColor: Colors.brand, borderRadius: Radius.md, paddingVertical: 13, alignItems: 'center' },
  claudeYesText:{ fontSize: Typography.base, fontWeight: '800', color: Colors.white },
  claudeNo:     { paddingHorizontal: 20, paddingVertical: 13, borderRadius: Radius.md, borderWidth: 1, borderColor: theme.border, alignItems: 'center' },
  claudeNoText: { fontSize: Typography.base, fontWeight: '600', color: theme.muted },

  // How it works
  howRow:       { flexDirection: 'row', gap: 14, backgroundColor: theme.card, borderRadius: Radius.lg, borderWidth: 1, borderColor: theme.border, padding: 14, alignItems: 'flex-start' },
  howIcon:      { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  howCopy:      { flex: 1 },
  howTitle:     { fontSize: Typography.base, fontWeight: '800', color: theme.text },
  howBody:      { fontSize: Typography.sm, color: theme.subtext, marginTop: 4, lineHeight: 19 },

  tryBtn:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.brand, borderRadius: Radius.lg, paddingVertical: 18 },
  tryBtnText:   { fontSize: Typography.md, fontWeight: '800', color: Colors.white },
  autoNote:     { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: theme.card, borderRadius: Radius.md, padding: 12, borderWidth: 1, borderColor: theme.border },
  autoNoteText: { flex: 1, fontSize: Typography.sm, color: theme.subtext, lineHeight: 19 },

  // ── IMPAIRED MODE ──────────────────────────────────────────────────────────
  impairedContent: { padding: 20, gap: 16, paddingTop: 32 },
  impairedBrand:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  impairedBrandIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.brandGlow, alignItems: 'center', justifyContent: 'center' },
  impairedBrandText: { fontSize: Typography.base, fontWeight: '800', color: Colors.brand },
  impairedTitle:   { fontSize: 38, fontWeight: '900', color: Colors.white, lineHeight: 44 },
  impairedSub:     { fontSize: Typography.md, color: 'rgba(255,255,255,0.7)', lineHeight: 24, marginBottom: 8 },

  // Big destination buttons
  bigDestBtn:      { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: Radius.xl, padding: 20, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)' },
  bigDestBtnActive:{ backgroundColor: Colors.brand, borderColor: Colors.brand },
  bigDestIcon:     { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(0,119,204,0.2)', alignItems: 'center', justifyContent: 'center' },
  bigDestLabel:    { fontSize: Typography.xl, fontWeight: '900', color: Colors.white },
  bigDestLabelActive: { color: Colors.white },
  bigDestSub:      { fontSize: Typography.sm, color: 'rgba(255,255,255,0.55)', marginTop: 2 },
  bigDestSubActive:{ color: 'rgba(255,255,255,0.8)' },

  // BOOK NOW button
  bookNowBtn:      { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: Colors.green, borderRadius: Radius.xl, padding: 22, marginTop: 8 },
  bookNowTitle:    { fontSize: Typography.xl, fontWeight: '900', color: Colors.white },
  bookNowSub:      { fontSize: Typography.sm, color: 'rgba(255,255,255,0.85)', marginTop: 2 },

  impairedNote:    { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,119,204,0.12)', borderRadius: Radius.md, padding: 12 },
  impairedNoteText:{ flex: 1, fontSize: Typography.sm, color: 'rgba(255,255,255,0.7)', lineHeight: 18 },

  switchModeBtn:   { alignItems: 'center', padding: 12 },
  impairedPickup:        { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: Radius.lg, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  impairedPickupDot:     { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.green, flexShrink: 0 },
  impairedPickupLabel:   { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.45)', letterSpacing: 0.8 },
  impairedPickupAddr:    { fontSize: Typography.md, fontWeight: '700', color: Colors.white, marginTop: 2 },
  impairedPickupChange:  { fontSize: Typography.sm, fontWeight: '700', color: Colors.brand },
  impairedPickupOptions: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: Radius.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  impairedPickupOpt:     { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  impairedPickupOptText: { flex: 1, fontSize: Typography.md, fontWeight: '700', color: Colors.white },
  switchModeBtnText: { fontSize: Typography.sm, color: 'rgba(255,255,255,0.4)', textDecorationLine: 'underline' },

  // ── BOOKED MODE ────────────────────────────────────────────────────────────
  bookedContent: { padding: 20, gap: 16, paddingTop: 32 },
  bookedHeader:  { alignItems: 'center', gap: 10, paddingBottom: 8 },
  bookedIcon:    { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' },
  bookedTitle:   { fontSize: Typography.xxl, fontWeight: '900', color: Colors.white, textAlign: 'center' },
  bookedSub:     { fontSize: Typography.base, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },

  // Car verification
  verifyCard:    { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: 20, gap: 16 },
  verifyHeading: { fontSize: Typography.md, fontWeight: '900', color: theme.text, textAlign: 'center' },
  verifyGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  verifyItem:    { width: '47%', backgroundColor: theme.bg, borderRadius: Radius.md, padding: 12, borderWidth: 1, borderColor: theme.border },
  verifyLabel:   { fontSize: 10, fontWeight: '800', color: theme.muted, letterSpacing: 0.8 },
  verifyValue:   { fontSize: Typography.md, fontWeight: '800', color: theme.text, marginTop: 4 },
  colorDot:      { width: 16, height: 16, borderRadius: 8 },
  verifyBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.green, borderRadius: Radius.lg, paddingVertical: 16 },
  verifyBtnText: { fontSize: Typography.md, fontWeight: '800', color: Colors.white },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(0,168,118,0.1)', borderRadius: Radius.md, padding: 12 },
  verifiedText:  { fontSize: Typography.base, fontWeight: '700', color: Colors.green },

  // Check-in card
  checkinCard:   { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: 18, gap: 12 },
  checkinHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  claudeIconSm:  { width: 32, height: 32, borderRadius: 9, backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center' },
  claudeIconSmText: { color: Colors.white, fontSize: 14, fontWeight: '900' },
  checkinTitle:  { flex: 1, fontSize: Typography.base, fontWeight: '800', color: theme.text },
  checkinSub:    { fontSize: Typography.xs, color: theme.muted },
  checkinMsg:    { fontSize: Typography.base, color: theme.subtext, lineHeight: 22 },
  checkinBtns:   { flexDirection: 'row', gap: 10 },
  checkinYes:    { flex: 1, backgroundColor: Colors.green, borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center' },
  checkinYesText:{ fontSize: Typography.base, fontWeight: '800', color: Colors.white },
  checkinNo:     { paddingHorizontal: 20, paddingVertical: 14, backgroundColor: theme.bg, borderRadius: Radius.md, borderWidth: 1, borderColor: theme.border, alignItems: 'center' },
  checkinNoText: { fontSize: Typography.base, fontWeight: '600', color: Colors.red },

  // SOS large
  sosBtnLarge:   { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.red, borderRadius: Radius.xl, padding: 20 },
  sosBtnTitle:   { fontSize: Typography.lg, fontWeight: '900', color: Colors.white },
  sosBtnSub:     { fontSize: Typography.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
}), [theme]);
  const driver = DEMO_DRIVER;

  const [mode, setMode]             = useState<Mode>('preview');
  const [checkInCount, setCheckIn]  = useState(0);
  const [verifiedCar, setVerified]  = useState(false);
  const [selectedDest, setDest]     = useState(DEMO_HOME);
  const [pickup, setPickup]           = useState('Current location');
  const [editPickup, setEditPickup]   = useState(false);

  // ── BOOKED — Claude check-in screen ──────────────────────────────────────
  if (mode === 'booked') {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: Colors.brand }]}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={s.bookedContent}>

          {/* Header */}
          <View style={s.bookedHeader}>
            <View style={s.bookedIcon}>
              <Ionicons name="flash" size={36} color={Colors.brand} />
            </View>
            <Text style={s.bookedTitle}>You're on your way!</Text>
            <Text style={s.bookedSub}>Wem Go is active. We've got you.</Text>
          </View>

          {/* CAR VERIFICATION — biggest priority */}
          <View style={s.verifyCard}>
            <Text style={s.verifyHeading}>
              {verifiedCar ? '✓ You confirmed your car' : '⚠ Make sure you\'re in the right car'}
            </Text>

            <View style={s.verifyGrid}>
              <View style={s.verifyItem}>
                <Text style={s.verifyLabel}>PLATE</Text>
                <Text style={s.verifyValue}>{driver.plate}</Text>
              </View>
              <View style={s.verifyItem}>
                <Text style={s.verifyLabel}>COLOR</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <View style={[s.colorDot, { backgroundColor: driver.colorHex || '#F2F2F0', borderWidth: 1, borderColor: '#DDD' }]} />
                  <Text style={s.verifyValue}>{driver.color}</Text>
                </View>
              </View>
              <View style={s.verifyItem}>
                <Text style={s.verifyLabel}>DRIVER</Text>
                <Text style={s.verifyValue}>{driver.name}</Text>
              </View>
              <View style={s.verifyItem}>
                <Text style={s.verifyLabel}>CAR</Text>
                <Text style={s.verifyValue}>{driver.vehicle}</Text>
              </View>
            </View>

            {!verifiedCar ? (
              <TouchableOpacity
                style={s.verifyBtn}
                onPress={() => setVerified(true)}
                activeOpacity={0.85}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
                <Text style={s.verifyBtnText}>Yes, I'm in the right car</Text>
              </TouchableOpacity>
            ) : (
              <View style={s.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.green} />
                <Text style={s.verifiedText}>Car verified — have a Wem Go home!</Text>
              </View>
            )}
          </View>

          {/* Claude check-ins */}
          <View style={s.checkinCard}>
            <View style={s.checkinHeader}>
              <View style={s.claudeIconSm}>
                <Text style={s.claudeIconSmText}>✦</Text>
              </View>
              <Text style={s.checkinTitle}>Claude is with you</Text>
              <Text style={s.checkinSub}>Check-in {checkInCount + 1} of 3</Text>
            </View>

            {checkInCount === 0 && (
              <View>
                <Text style={s.checkinMsg}>
                  Hey! Just checking in — are you safely in your ride? Tap to confirm.
                </Text>
                <View style={s.checkinBtns}>
                  <TouchableOpacity
                    style={s.checkinYes}
                    onPress={() => setCheckIn(1)}
                    activeOpacity={0.85}>
                    <Text style={s.checkinYesText}>✓ Yes, I'm good</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={s.checkinNo}
                    onPress={() => router.push('/rider/active')}
                    activeOpacity={0.85}>
                    <Text style={s.checkinNoText}>I need help</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {checkInCount === 1 && (
              <View>
                <Text style={s.checkinMsg}>
                  Halfway there! Everything still good? Reply and I'll check back in when you're close.
                </Text>
                <TouchableOpacity
                  style={s.checkinYes}
                  onPress={() => setCheckIn(2)}
                  activeOpacity={0.85}>
                  <Text style={s.checkinYesText}>✓ All good</Text>
                </TouchableOpacity>
              </View>
            )}

            {checkInCount === 2 && (
              <View>
                <Text style={s.checkinMsg}>
                  Almost home! Make sure you have your phone and belongings. You did great tonight.
                </Text>
                <TouchableOpacity
                  style={s.checkinYes}
                  onPress={() => router.replace('/rider/home')}
                  activeOpacity={0.85}>
                  <Text style={s.checkinYesText}>I'm home safe ✓</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* SOS — always visible */}
          <TouchableOpacity style={s.sosBtnLarge} activeOpacity={0.9}>
            <Ionicons name="alert-circle" size={24} color={Colors.white} />
            <View>
              <Text style={s.sosBtnTitle}>SOS — I need help now</Text>
              <Text style={s.sosBtnSub}>Hold 1 second · Silent dispatch</Text>
            </View>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── IMPAIRED MODE — simplified big buttons ────────────────────────────────
  if (mode === 'impaired') {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: '#0A1628' }]}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={s.impairedContent}>

          {/* Wem badge */}
          <View style={s.impairedBrand}>
            <View style={s.impairedBrandIcon}>
              <Ionicons name="flash" size={22} color={Colors.brand} />
            </View>
            <Text style={s.impairedBrandText}>Wem Wem Go</Text>
          </View>

          {/* Big reassuring message */}
          <Text style={s.impairedTitle}>Let's get you{'\n'}home safe.</Text>
          <Text style={s.impairedSub}>
            Looks like you're at {DEMO_VENUE.split('—')[0].trim()}.{'\n'}
            We've got you. Just pick where to go.
          </Text>

          {/* Pickup location */}
          <TouchableOpacity
            style={s.impairedPickup}
            onPress={() => setEditPickup(!editPickup)}
            activeOpacity={0.8}>
            <View style={s.impairedPickupDot} />
            <View style={{ flex: 1 }}>
              <Text style={s.impairedPickupLabel}>PICKING YOU UP FROM</Text>
              <Text style={s.impairedPickupAddr}>{pickup}</Text>
            </View>
            <Text style={s.impairedPickupChange}>Change</Text>
          </TouchableOpacity>

          {editPickup && (
            <View style={s.impairedPickupOptions}>
              {['Current location', '2847 Maple Ave (Home)', '350 N St Paul St (Work)'].map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={s.impairedPickupOpt}
                  onPress={() => { setPickup(opt); setEditPickup(false); }}
                  activeOpacity={0.8}>
                  <Ionicons name={opt === 'Current location' ? 'location' : 'navigate'} size={18} color={Colors.brand} />
                  <Text style={s.impairedPickupOptText}>{opt}</Text>
                  {pickup === opt && <Ionicons name="checkmark-circle" size={18} color={Colors.brand} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* BIG destination buttons */}
          {DEMO_SAFE_SPOTS.map(spot => (
            <TouchableOpacity
              key={spot.label}
              style={[
                s.bigDestBtn,
                selectedDest === spot.sub && s.bigDestBtnActive,
              ]}
              onPress={() => setDest(spot.sub)}
              activeOpacity={0.85}>
              <View style={s.bigDestIcon}>
                <Ionicons
                  name={spot.icon}
                  size={26}
                  color={selectedDest === spot.sub ? Colors.white : Colors.brand}
                />
              </View>
              <View>
                <Text style={[s.bigDestLabel, selectedDest === spot.sub && s.bigDestLabelActive]}>
                  {spot.label}
                </Text>
                <Text style={[s.bigDestSub, selectedDest === spot.sub && s.bigDestSubActive]}>
                  {spot.sub}
                </Text>
              </View>
              {selectedDest === spot.sub && (
                <Ionicons name="checkmark-circle" size={22} color={Colors.white} style={{ marginLeft: 'auto' }} />
              )}
            </TouchableOpacity>
          ))}

          {/* Book NOW — giant button */}
          <TouchableOpacity
            style={s.bookNowBtn}
            onPress={() => setMode('booked')}
            activeOpacity={0.85}>
            <Ionicons name="car" size={26} color={Colors.white} />
            <View>
              <Text style={s.bookNowTitle}>Book My Wem Go</Text>
              <Text style={s.bookNowSub}>
                Driver in {DEMO_ETAs[0]} · Female Driver Option
              </Text>
            </View>
          </TouchableOpacity>

          {/* Reassurance */}
          <View style={s.impairedNote}>
            <Ionicons name="flash" size={14} color={Colors.brand} />
            <Text style={s.impairedNoteText}>
              Claude will check in during your ride and make sure you get in the right car.
            </Text>
          </View>

          {/* Preview mode link */}
          <TouchableOpacity
            style={s.switchModeBtn}
            onPress={() => setMode('preview')}>
            <Text style={s.switchModeBtnText}>Switch to standard booking</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── PREVIEW MODE — sober, planning ahead ─────────────────────────────────
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />

      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Wem Go</Text>
        <TouchableOpacity
          style={s.demoImpaired}
          onPress={() => setMode('impaired')}>
          <Text style={s.demoImpairedText}>Preview Wem Go</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={s.hero}>
          <View style={s.heroTopRow}>
            <View style={s.heroIcon}>
              <Ionicons name="flash" size={28} color={Colors.white} />
            </View>
            <View style={s.heroCopy}>
              <Text style={s.heroTitle}>Wem Go</Text>
              <Text style={s.heroSub}>Quick · Simple · Built for everyone</Text>
            </View>
          </View>
          <Text style={s.heroBody}>
            Whether you're heading out for the night, want a simpler
            booking experience, or just prefer bigger text and fewer steps
            — Wem Go is built for you.
          </Text>
        </View>

        {/* Claude proactive prompt — simulates what Claude would say */}
        <View style={s.claudeCard}>
          <View style={s.claudeHeader}>
            <View style={s.claudeIcon}>
              <Text style={s.claudeIconText}>✦</Text>
            </View>
            <Text style={s.claudeTitle}>Claude noticed something</Text>
          </View>
          <Text style={s.claudeMsg}>
            You're heading to <Text style={{ fontWeight: '700' }}>The Rustic</Text> tonight.
            Want me to pre-book your ride home? I'll have it ready whenever you need it —
            no fumbling with the app later.
          </Text>
          <View style={s.claudeActions}>
            <TouchableOpacity
              style={s.claudeYes}
              onPress={() => setMode('impaired')}
              activeOpacity={0.85}>
              <Text style={s.claudeYesText}>Yes, set it up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.claudeNo} activeOpacity={0.85}>
              <Text style={s.claudeNoText}>Not yet</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* How it works */}
        <Text style={s.sectionLabel}>HOW IT WORKS</Text>

        {[
          {
            icon: 'navigate',
            color: Colors.brand,
            title: 'We spot where you\'re going',
            body: 'When your destination is somewhere that serves drinks, Claude proactively offers to pre-book your return trip while you\'re still sober.',
          },
          {
            icon: 'phone-portrait',
            color: '#7C3AED',
            title: 'Simplified mode when you\'re out',
            body: 'If you open Wem later from that same venue, the app shifts into Wem Go mode — bigger buttons, fewer steps, easier to book.',
          },
          {
            icon: 'car',
            color: Colors.green,
            title: 'Car verification built in',
            body: 'Before you get in, we show you the plate, color, and driver name in large text. Claude reminds you to confirm it\'s the right car.',
          },
          {
            icon: 'chatbubble',
            color: Colors.amber,
            title: 'Claude checks in during your ride',
            body: 'Routine check-ins on the way home. One tap to confirm you\'re okay. If you don\'t respond, Wem escalates.',
          },
        ].map(item => (
          <View key={item.title} style={s.howRow}>
            <View style={[s.howIcon, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon} size={22} color={item.color} />
            </View>
            <View style={s.howCopy}>
              <Text style={s.howTitle}>{item.title}</Text>
              <Text style={s.howBody}>{item.body}</Text>
            </View>
          </View>
        ))}

        {/* Try it */}
        {/* Auto Wem Go setting note */}
        <View style={s.autoNote}>
          <Ionicons name="moon" size={14} color={Colors.brand} />
          <Text style={s.autoNoteText}>
            <Text style={{ fontWeight: '700', color: theme.text }}>Auto Wem Go is on. </Text>
            When you're at a bar or restaurant after 9pm, Wem will open this screen automatically.
            You can turn this off in Settings.
          </Text>
        </View>

        <TouchableOpacity
          style={s.tryBtn}
          onPress={() => setMode('impaired')}
          activeOpacity={0.85}>
          <Ionicons name="flash" size={20} color={Colors.white} />
          <Text style={s.tryBtnText}>Try Wem Go mode</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

