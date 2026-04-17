import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  StatusBar, ScrollView, Alert, Animated, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import {
  Colors, Typography, Spacing, Radius,
  DEMO_RIDER, DEMO_DRIVER, DEMO_ROUTE, DEMO_DROPOFF,
  calculateFare,
} from '../../constants';
import { WemMap, Marker, Polyline } from '../../components/shared/WemMap';
import CarIllustration from '../../components/shared/CarIllustration';
import { claudeMidRide as midRide } from '../../hooks/useClaudeService';
import * as Haptics from 'expo-haptics';

const RIDE_DURATION = 60;
import Svg, { Polygon } from 'react-native-svg';

// SVG triangle arrow — points in direction of travel
function CarArrow({ heading = 0 }: { heading?: number }) {
  return (
    <View style={{
      width: 36, height: 36, alignItems: 'center', justifyContent: 'center',
      transform: [{ rotate: heading + 'deg' }],
    }}>
      <Svg width={36} height={36} viewBox="0 0 36 36">
        {/* Outer glow circle */}
        <Polygon
          points="18,4 30,30 18,24 6,30"
          fill="#0A84FF"
          opacity={0.25}
          scale="1.3"
          origin="18,18"
        />
        {/* Arrow body */}
        <Polygon
          points="18,4 30,30 18,24 6,30"
          fill="#0A84FF"
          stroke="white"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}



const FARE = {
  base: 18.66, gas: 1.08, pickup: 0.00,
  totalNonPass: 19.74, totalPass: 18.66,
  driverBase: 14.00, driverGas: 1.08, driverTotal: 15.08,
};

// ── Sub-screens ───────────────────────────────────────────────────────────────
type Screen = 'ride' | 'rating';

export default function ActiveRideScreen() {
  const router = useRouter();
  const { theme } = useTheme();
const s = useMemo(() => StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.bg },

  // Status bar
  statusBar:      { backgroundColor: Colors.brand, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12 },
  statusRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  statusMain:     { fontSize: Typography.md, fontWeight: '800', color: Colors.white },
  statusSub:      { fontSize: Typography.xs, color: 'rgba(255,255,255,0.8)', marginTop: 3 },
  recordingBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(229,57,53,0.2)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(229,57,53,0.4)' },
  recordingDot:   { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.red },
  recordingText:  { fontSize: 10, fontWeight: '700', color: Colors.red },
  progressTrack:  { height: 4, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 2, overflow: 'hidden' },
  progressFill:   { height: 4, backgroundColor: Colors.white, borderRadius: 2 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  progressLabel:  { fontSize: 10, color: 'rgba(255,255,255,0.6)' },
  progressEta:    { fontSize: 10, fontWeight: '700', color: Colors.white },

  // Map
  mapContainer:   { flex: 1, position: 'relative' },
  map:            { flex: 1 },
  carMarker:      { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center' },
  dropMarker:     { alignItems: 'center' },

  // SOS
  sosBtn:         { position: 'absolute', top: 12, right: 12, width: 54, height: 54, borderRadius: 27, backgroundColor: Colors.red, alignItems: 'center', justifyContent: 'center' },
  sosBtnText:     { color: Colors.white, fontWeight: '900', fontSize: 11, marginTop: 2 },
  sosCancel:      { position: 'absolute', top: 12, right: 12, backgroundColor: Colors.red, borderRadius: Radius.lg, padding: 12, alignItems: 'center' },
  sosCancelTitle: { color: Colors.white, fontWeight: '900', fontSize: Typography.base },
  sosCancelSub:   { color: 'rgba(255,255,255,0.75)', fontSize: Typography.xs, marginTop: 4 },
  claudeBtn:      { position: 'absolute', top: 12, left: 12, width: 46, height: 46, borderRadius: 23, backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center' },
  claudeBtnText:  { color: Colors.white, fontSize: 17, fontWeight: '900' },

  // Almost there banner
  almostThere:      { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(245,158,11,0.97)', paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  almostThereLeft:  { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  almostThereCopy:  { flex: 1 },
  almostThereTitle: { fontSize: Typography.sm, fontWeight: '800', color: '#1A0A00' },
  almostThereSub:   { fontSize: Typography.xs, color: 'rgba(26,10,0,0.8)', marginTop: 1 },

  // Driver arriving card
  driverArrivingCard:   {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: theme.card,
    borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    borderTopWidth: 2, borderTopColor: Colors.brand,
  },
  driverArrivingHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  driverArrivingPulse:  { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.green },
  driverArrivingTitle:  { fontSize: Typography.base, fontWeight: '800', color: theme.text, flex: 1 },
  driverArrivingRow:    { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },


  arrivingDriverInfo:   { alignItems: 'center', gap: 4 },
  arrivingAvatar:       { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center' },
  arrivingAvatarText:   { color: Colors.white, fontWeight: '800', fontSize: Typography.sm },
  arrivingName:         { fontSize: Typography.xs, fontWeight: '700', color: theme.text },
  arrivingRating:       { fontSize: Typography.xs, color: theme.subtext },

  beReadyText:          { fontSize: Typography.sm, fontWeight: '700', color: theme.text, textAlign: 'center' },
  carDetailsRow:        { flexDirection: 'row', gap: 8, marginBottom: 12 },
  carDetailItem:        { flex: 1, backgroundColor: theme.bg, borderRadius: Radius.sm, padding: 8, borderWidth: 1, borderColor: theme.border },
  carDetailLabel:       { fontSize: 9, fontWeight: '800', color: theme.muted, letterSpacing: 0.8, marginBottom: 2 },
  carDetailValue:       { fontSize: Typography.sm, fontWeight: '700', color: theme.text, marginTop: 2 },
  colorSwatch:          { width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: theme.border },
  featuresBox:          { backgroundColor: Colors.brandGlow, borderRadius: Radius.md, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: Colors.brand + '33' },
  featuresHeading:      { fontSize: 11, fontWeight: '800', color: Colors.brand, letterSpacing: 0.8 },
  featuresText:         { fontSize: Typography.base, color: Colors.brand, lineHeight: 22, fontWeight: '500' },

  // Bottom panels
  bottomPanel:    { backgroundColor: theme.card, borderTopWidth: 1, borderTopColor: theme.border, maxHeight: 320 },
  enRoutePanel:   { padding: Spacing.md },
  driverRow:      { flexDirection: 'row', alignItems: 'center', gap: 12, padding: Spacing.md },
  driverAvatar:   { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center' },
  driverAvatarText: { color: Colors.white, fontWeight: '800', fontSize: Typography.base },
  driverInfo:     { flex: 1 },
  driverLabel:    { fontSize: 10, fontWeight: '700', color: theme.muted, letterSpacing: 0.8, marginBottom: 2 },
  driverName:     { fontSize: Typography.md, fontWeight: '800', color: theme.text },
  bgCheckBadge:   { flexDirection: 'row', alignItems: 'center', marginTop: 3, backgroundColor: 'rgba(48,209,88,0.1)', borderRadius: 20, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: 'rgba(48,209,88,0.3)', alignSelf: 'flex-start' },
  bgCheckText:    { fontSize: 10, fontWeight: '700', color: Colors.green },
  certBadge:      { flexDirection: 'row', alignItems: 'center', marginTop: 4, backgroundColor: Colors.certBg, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: Colors.certText, alignSelf: 'flex-start' },
  certBadgeText:  { fontSize: 11, fontWeight: '700', color: Colors.certText },
  driverRight:    { alignItems: 'flex-end', gap: 4 },
  driverRating:   { fontSize: Typography.sm, fontWeight: '700', color: theme.text },
  etaLarge:       { fontSize: Typography.xxl, fontWeight: '900', color: Colors.brand },
  etaLabel:       { fontSize: Typography.xs, color: theme.subtext },

  // Driver profile
  driverProfile:  { marginHorizontal: Spacing.md, marginBottom: Spacing.sm, backgroundColor: theme.bg, borderRadius: Radius.md, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' },
  profileRow:     { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: theme.border },
  profileLabel:   { fontSize: Typography.xs, color: theme.subtext },
  profileValue:   { fontSize: Typography.xs, fontWeight: '600', color: theme.text },

  // Fare
  fareCard:       { margin: Spacing.md, marginTop: 0, backgroundColor: theme.bg, borderRadius: Radius.md, borderWidth: 1, borderColor: theme.border, padding: 12 },
  fareHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  fareTitle:      { fontSize: Typography.base, fontWeight: '800', color: theme.text },
  passBadge:      { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.accentGlow, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: theme.border },
  passBadgeText:  { fontSize: 11, fontWeight: '700', color: Colors.passText },
  fareRow:        { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: theme.border },
  fareLabel:      { fontSize: Typography.xs, color: theme.subtext },
  fareValue:      { fontSize: Typography.sm, fontWeight: '700', color: theme.text },
  fareGreen:      { color: Colors.green },
  fareTotalRow:   { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8 },
  fareTotalLabel: { fontSize: Typography.base, fontWeight: '800', color: theme.text },
  fareTotalValue: { fontSize: Typography.lg, fontWeight: '900', color: Colors.brand },
  fareSavings:    { fontSize: Typography.xs, color: Colors.green, textAlign: 'right', marginTop: 4 },

  // Chat
  chatSheet:      { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: theme.card, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, maxHeight: '60%' },
  chatHeader:     { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderBottomWidth: 1, borderBottomColor: theme.border },
  chatIcon:       { width: 32, height: 32, borderRadius: 9, backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center' },
  chatIconText:   { color: Colors.white, fontSize: 14, fontWeight: '900' },
  chatTitle:      { flex: 1, fontSize: Typography.base, fontWeight: '800', color: theme.text },
  chatBubble:     { maxWidth: '80%', alignSelf: 'flex-start', backgroundColor: theme.bg, borderRadius: Radius.md, padding: 10, borderWidth: 1, borderColor: theme.border },
  chatBubbleUser: { alignSelf: 'flex-end', backgroundColor: Colors.brand, borderColor: 'transparent' },
  chatText:       { fontSize: Typography.sm, color: theme.text, lineHeight: 18 },
  chatTextUser:   { color: Colors.white },
  chatSuggs:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 12 },
  chatSugg:       { paddingHorizontal: 12, paddingVertical: 7, borderRadius: Radius.full, borderWidth: 1.5, borderColor: theme.border, backgroundColor: theme.card },
  chatSuggText:   { fontSize: Typography.xs, fontWeight: '600', color: Colors.brand },

  // Rating screen
  ratingContent:      { padding: Spacing.lg, gap: Spacing.md },
  ratingHeader:       { alignItems: 'center', gap: 10, paddingVertical: Spacing.lg },
  ratingCheck:        { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.green, alignItems: 'center', justifyContent: 'center' },
  ratingTitle:        { fontSize: Typography.xxl, fontWeight: '900', color: theme.text },
  ratingSub:          { fontSize: Typography.base, color: theme.subtext },
  ratingSummary:      { backgroundColor: theme.card, borderRadius: Radius.lg, borderWidth: 1, borderColor: theme.border, padding: Spacing.md },
  ratingSummaryRow:   { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.border },
  ratingSummaryLabel: { fontSize: Typography.base, color: theme.subtext },
  ratingSummaryValue: { fontSize: Typography.base, fontWeight: '800', color: theme.text },
  ratingSavings:      { fontSize: Typography.xs, color: Colors.green, textAlign: 'right', marginTop: 6 },
  ratingDriverCard:   { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: theme.card, borderRadius: Radius.lg, borderWidth: 1, borderColor: theme.border, padding: Spacing.md },
  ratingAvatar:       { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center' },
  ratingAvatarText:   { color: Colors.white, fontWeight: '800', fontSize: Typography.base },
  ratingDriverInfo:   { flex: 1 },
  ratingDriverName:   { fontSize: Typography.md, fontWeight: '800', color: theme.text },
  ratingDriverSub:    { fontSize: Typography.xs, color: theme.subtext, marginTop: 3 },
  ratingPrompt:       { fontSize: Typography.lg, fontWeight: '800', color: theme.text, textAlign: 'center', marginTop: Spacing.sm },
  starsRow:           { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  ratingFeedback:     { fontSize: Typography.base, color: Colors.brand, textAlign: 'center', fontWeight: '700' },
  tipPrompt:          { fontSize: Typography.md, fontWeight: '800', color: theme.text, marginTop: Spacing.sm },
  tipNote:            { fontSize: Typography.xs, color: Colors.green, marginBottom: Spacing.sm },
  tipOptions:         { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  tipBtn:             { flex: 1, minWidth: 60, paddingVertical: 12, borderRadius: Radius.md, borderWidth: 1.5, borderColor: theme.border, alignItems: 'center' },
  tipBtnActive:       { borderColor: Colors.brand, backgroundColor: theme.accentGlow },
  tipBtnText:         { fontSize: Typography.sm, fontWeight: '700', color: theme.subtext },
  tipBtnTextActive:   { color: Colors.brand },
  submitBtn:          { backgroundColor: Colors.brand, borderRadius: Radius.lg, paddingVertical: 18, alignItems: 'center', marginTop: Spacing.sm },
  submitBtnDisabled:  { backgroundColor: theme.border },
  submitBtnText:      { fontSize: Typography.md, fontWeight: '800', color: Colors.white },
  skipBtn:            { alignItems: 'center', paddingVertical: 12 },
  skipBtnText:        { fontSize: Typography.sm, color: theme.muted },
}), [theme]);
  const rider = DEMO_RIDER;
  const driver = DEMO_DRIVER;

  const [screen, setScreen]           = useState<Screen>('ride');
  const [elapsed, setElapsed]         = useState(0);
  const [carPos, setCarPos]           = useState(DEMO_ROUTE[0]);
  const [showChat, setShowChat]       = useState(false);
  const [showDriverProfile, setShowDriverProfile] = useState(false);
  const [sosActive, setSosActive]     = useState(false);
  const [sosCount, setSosCount]       = useState(5);
  const [messages, setMessages]       = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [bannerVisible, setBannerVisible]         = useState(false);
  const [driverCardVisible, setDriverCardVisible] = useState(false);
  const [rating, setRating]           = useState(0);
  const [tip, setTip]                 = useState(0);
  const [tipCustom, setTipCustom]     = useState('');

  const bannerAnim      = useRef(new Animated.Value(80)).current;
  const driverCardAnim  = useRef(new Animated.Value(320)).current;
  const sosRef          = useRef(null);

  const progress   = Math.min(elapsed / RIDE_DURATION, 1);
  // Heading for SVG arrow — angle of travel along route
  const carHeading = (() => {
    const max = DEMO_ROUTE.length - 1;
    const fi  = Math.min(progress * max, max - 0.001);
    const i   = Math.floor(fi);
    const a   = DEMO_ROUTE[i], b = DEMO_ROUTE[Math.min(i + 1, max)];
    return Math.atan2(b.longitude - a.longitude, b.latitude - a.latitude) * (180 / Math.PI);
  })();
  const isPickedUp = progress >= 0.60;
  const nearEnd    = progress > 0.75;
  const driverClose = progress >= 0.35 && !isPickedUp;

  const etaMins      = Math.max(1, Math.round((1 - progress) * 14));
  const pickupMins   = Math.max(0, Math.round((0.60 - progress) / 0.60 * 4));
  const phaseLabel   = !isPickedUp ? 'Your driver is on the way' : nearEnd ? 'Almost at your destination' : 'Ride in progress';
  const phaseSubLabel = !isPickedUp
    ? pickupMins <= 1 ? 'Arriving now — be ready!' : `Arriving in ${pickupMins} min`
    : `${etaMins} min to ${DEMO_DROPOFF.name}`;

  const totalFare = rider.hasPass ? FARE.totalPass : FARE.totalNonPass;

  // ── Ride simulation ───────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(prev => {
        if (prev >= RIDE_DURATION) {
          clearInterval(timer);
          // Ride ended — show rating screen
          setTimeout(() => setScreen('rating'), 800);
          return prev;
        }
        return prev + 1;
      });
      setCarPos(prev => {
        const idx = DEMO_ROUTE.findIndex(p =>
          Math.abs(p.latitude - prev.latitude) < 0.0001 &&
          Math.abs(p.longitude - prev.longitude) < 0.0001
        );
        const next = Math.min((idx >= 0 ? idx : 0) + 1, DEMO_ROUTE.length - 1);
        return DEMO_ROUTE[next];
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ── Driver close card ─────────────────────────────────────────────────────
  useEffect(() => {
    if (driverClose && !driverCardVisible && !isPickedUp) {
      setDriverCardVisible(true);
      Animated.spring(driverCardAnim, {
        toValue: 0, useNativeDriver: false, tension: 60, friction: 11,
      }).start();
    }
    // Dismiss when picked up
    if (isPickedUp && driverCardVisible) {
      Animated.timing(driverCardAnim, {
        toValue: 320, duration: 300, useNativeDriver: false,
      }).start(() => setDriverCardVisible(false));
    }
  }, [driverClose, isPickedUp]);

  // ── Belongings banner ──────────────────────────────────────────────────────
  useEffect(() => {
    if (nearEnd && isPickedUp && !bannerVisible) {
      setBannerVisible(true);
      // Haptic feedback — vibrates phone even when locked
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      // Second pulse after 600ms for emphasis
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, 600);
      Animated.spring(bannerAnim, {
        toValue: 0, useNativeDriver: false, tension: 65, friction: 10,
      }).start();
    }
  }, [nearEnd, isPickedUp]);

  function dismissBanner() {
    Animated.timing(bannerAnim, { toValue: 80, duration: 250, useNativeDriver: false })
      .start(() => setBannerVisible(false));
  }

  // ── SOS ───────────────────────────────────────────────────────────────────
  function handleSOS() {
    setSosActive(true); setSosCount(5);
    sosRef.current = setInterval(() => {
      setSosCount(prev => {
        if (prev <= 1) {
          clearInterval(sosRef.current);
          Alert.alert('SOS Activated', 'Monitoring center alerted.',
            [{ text: "I'm safe — Cancel", onPress: cancelSOS }]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }
  function cancelSOS() {
    if (sosRef.current) clearInterval(sosRef.current);
    setSosActive(false); setSosCount(5);
  }

  // ── Chat ──────────────────────────────────────────────────────────────────
  async function sendChat(text) {
    if (!text || chatLoading) return;
    const updated = [...messages, { role: 'user', content: text }];
    setMessages(updated);
    setChatLoading(true);
    try {
      const reply = await midRide(updated, { destination: DEMO_DROPOFF.name, etaMinutes: etaMins, progress });
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm here. What do you need?" }]);
    } finally { setChatLoading(false); }
  }

  // ── RATING SCREEN ─────────────────────────────────────────────────────────
  if (screen === 'rating') {
    const finalTotal = totalFare + tip;
    return (
      <SafeAreaView style={s.safe}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={s.ratingContent} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={s.ratingHeader}>
            <View style={s.ratingCheck}>
              <Ionicons name="checkmark" size={32} color={Colors.white} />
            </View>
            <Text style={s.ratingTitle}>Ride Complete</Text>
            <Text style={s.ratingSub}>You've arrived at {DEMO_DROPOFF.name}</Text>
          </View>

          {/* Fare summary */}
          <View style={s.ratingSummary}>
            <View style={s.ratingSummaryRow}>
              <Text style={s.ratingSummaryLabel}>Ride fare</Text>
              <Text style={s.ratingSummaryValue}>${totalFare.toFixed(2)}</Text>
            </View>
            {tip > 0 && (
              <View style={s.ratingSummaryRow}>
                <Text style={s.ratingSummaryLabel}>Tip for {driver.name}</Text>
                <Text style={[s.ratingSummaryValue, { color: Colors.green }]}>+${tip.toFixed(2)}</Text>
              </View>
            )}
            <View style={[s.ratingSummaryRow, { borderBottomWidth: 0, paddingTop: 8 }]}>
              <Text style={[s.ratingSummaryLabel, { fontWeight: '800', color: theme.text }]}>Total charged</Text>
              <Text style={[s.ratingSummaryValue, { fontSize: Typography.xl, color: Colors.brand }]}>${finalTotal.toFixed(2)}</Text>
            </View>
            {rider.hasPass && (
              <Text style={s.ratingSavings}>
                Saved ${(FARE.totalNonPass - FARE.totalPass + FARE.gas).toFixed(2)} with Wem Pass
              </Text>
            )}
          </View>

          {/* Driver card */}
          <View style={s.ratingDriverCard}>
            <View style={s.ratingAvatar}>
              <Text style={s.ratingAvatarText}>MS</Text>
            </View>
            <View style={s.ratingDriverInfo}>
              <Text style={s.ratingDriverName}>{driver.name}</Text>
              <Text style={s.ratingDriverSub}>{driver.vehicle} · {driver.plate}</Text>
            </View>
          </View>

          {/* Star rating */}
          <Text style={s.ratingPrompt}>How was your ride?</Text>
          <View style={s.starsRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={42}
                  color={star <= rating ? Colors.amber : theme.border}
                />
              </TouchableOpacity>
            ))}
          </View>
          {rating > 0 && (
            <Text style={s.ratingFeedback}>
              {rating === 5 ? 'Amazing ride!' : rating === 4 ? 'Great ride!' : rating === 3 ? 'It was okay' : rating === 2 ? 'Could have been better' : 'Sorry to hear that'}
            </Text>
          )}

          {/* Tip */}
          <Text style={s.tipPrompt}>Add a tip for {driver.name.split(' ')[0]}?</Text>
          <Text style={s.tipNote}>100% goes to your driver — Wem takes nothing from tips.</Text>
          <View style={s.tipOptions}>
            {[0, 1, 2, 3, 5].map(amount => (
              <TouchableOpacity
                key={amount}
                style={[s.tipBtn, tip === amount && s.tipBtnActive]}
                onPress={() => setTip(amount)}
                activeOpacity={0.82}
              >
                <Text style={[s.tipBtnText, tip === amount && s.tipBtnTextActive]}>
                  {amount === 0 ? 'No tip' : `$${amount}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[s.submitBtn, rating === 0 && s.submitBtnDisabled]}
            onPress={() => {
              if (rating === 0) return;
              router.replace('/rider/home');
            }}
            activeOpacity={0.85}
          >
            <Text style={s.submitBtnText}>
              {rating === 0 ? 'Select a rating to continue' : `Submit${tip > 0 ? ` & Tip $${tip}` : ''}`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.skipBtn} onPress={() => router.replace('/rider/home')}>
            <Text style={s.skipBtnText}>Skip for now</Text>
          </TouchableOpacity>

          <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── ACTIVE RIDE SCREEN ────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" />

      {/* Status bar */}
      <View style={s.statusBar}>
        <View style={s.statusRow}>
          <View>
            <Text style={s.statusMain}>{phaseLabel}</Text>
            <Text style={s.statusSub}>{phaseSubLabel}</Text>
          </View>
          <View style={s.recordingBadge}>
            <View style={s.recordingDot} />
            <Text style={s.recordingText}>Recording</Text>
          </View>
        </View>
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>
        <View style={s.progressLabels}>
          <Text style={s.progressLabel}>{isPickedUp ? 'Picked up' : 'Pickup'}</Text>
          <Text style={s.progressEta}>{isPickedUp ? `${etaMins} min` : pickupMins <= 1 ? 'Now!' : `${pickupMins} min`}</Text>
          <Text style={s.progressLabel}>{DEMO_DROPOFF.name}</Text>
        </View>
      </View>

      {/* Map — Apple Maps with SVG car arrow */}
      <View style={s.mapContainer}>
        <WemMap
          style={s.map}
          initialRegion={{
            latitude: DEMO_ROUTE[0].latitude,
            longitude: DEMO_ROUTE[0].longitude,
            latitudeDelta: 0.04, longitudeDelta: 0.04,
          }}
        >
          <Polyline coordinates={DEMO_ROUTE} strokeColor={Colors.brand} strokeWidth={4} />
          <Marker coordinate={carPos} anchor={{ x: 0.5, y: 0.5 }}>
            <CarArrow heading={carHeading} />
          </Marker>
          <Marker coordinate={DEMO_DROPOFF}>
            <View style={s.dropMarker}>
              <Ionicons name="location" size={22} color={Colors.brand} />
            </View>
          </Marker>
        </WemMap>

        {/* SOS */}
        {sosActive ? (
          <TouchableOpacity style={s.sosCancel} onPress={cancelSOS}>
            <Text style={s.sosCancelTitle}>SOS in {sosCount}s</Text>
            <Text style={s.sosCancelSub}>Tap to cancel</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={s.sosBtn} onPress={handleSOS} activeOpacity={0.85}>
            <Ionicons name="alert-circle" size={20} color={Colors.white} />
            <Text style={s.sosBtnText}>SOS</Text>
          </TouchableOpacity>
        )}

        {/* Claude button */}
        <TouchableOpacity style={s.claudeBtn} onPress={() => setShowChat(!showChat)}>
          <Text style={s.claudeBtnText}>✦</Text>
        </TouchableOpacity>

        {/* "Almost there" banner */}
        {bannerVisible && (
          <Animated.View style={[s.almostThere, { transform: [{ translateY: bannerAnim }] }]}>
            <View style={s.almostThereLeft}>
              <Ionicons name="bag" size={18} color={Colors.amber} />
              <View style={s.almostThereCopy}>
                <Text style={s.almostThereTitle}>Almost there!</Text>
                <Text style={s.almostThereSub}>Don't forget your phone, bag, or anything you set down.</Text>
              </View>
            </View>
            <TouchableOpacity onPress={dismissBanner} style={{ padding: 4 }}>
              <Ionicons name="close" size={16} color={Colors.amber} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Driver arriving card — slides up from bottom of map */}
        {driverCardVisible && (
          <Animated.View style={[s.driverArrivingCard, { transform: [{ translateY: driverCardAnim }] }]}>
            <View style={s.driverArrivingHeader}>
              <View style={s.driverArrivingPulse} />
              <Text style={s.driverArrivingTitle}>
                {pickupMins <= 1 ? 'Your driver is arriving now!' : `Your driver arrives in ${pickupMins} min`}
              </Text>
            </View>

            <View style={s.driverArrivingRow}>
              {/* Car photo — full width */}
              <CarIllustration
                make={driver.make || 'toyota'}
                model={driver.model || 'camry'}
                year={driver.vehicleYear || '2022'}
                color={driver.colorName || 'white'}
                colorHex={driver.colorHex || '#F2F2F0'}
                type={driver.carType || 'sedan'}
                width={400}
                height={280}
              />
            </View>

            {/* Driver info row — below car image */}
            <View style={s.arrivingDriverRow}>
              <View style={s.arrivingAvatar}>
                <Text style={s.arrivingAvatarText}>MS</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.arrivingName}>{driver.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Ionicons name="star" size={11} color={Colors.amber} />
                  <Text style={s.arrivingRating}>{driver.rating}</Text>
                </View>
              </View>
              <View style={s.certBadge}>
                <Ionicons name="shield-checkmark" size={11} color={Colors.certText} />
                <Text style={s.certBadgeText}> Female Driver Option</Text>
              </View>
              <View style={s.bgCheckBadge}>
                <Ionicons name="checkmark-circle" size={11} color={Colors.green} />
                <Text style={s.bgCheckText}> Background Checked</Text>
              </View>
            </View>

            {/* Distinctive features */}
            {/* Car details row */}
            <View style={s.carDetailsRow}>
              <View style={s.carDetailItem}>
                <Text style={s.carDetailLabel}>VEHICLE</Text>
                <Text style={s.carDetailValue}>{driver.vehicle}</Text>
              </View>
              <View style={s.carDetailItem}>
                <Text style={s.carDetailLabel}>COLOR</Text>
                <View style={{ flexDirection:'row', alignItems:'center', gap:6, marginTop:4 }}>
                  <View style={[s.colorSwatch, { backgroundColor: driver.colorHex || '#F2F2F0' }]} />
                  <Text style={s.carDetailValue}>{driver.color}</Text>
                </View>
              </View>
              <View style={s.carDetailItem}>
                <Text style={s.carDetailLabel}>PLATE</Text>
                <Text style={[s.carDetailValue, { color: Colors.brand, fontWeight:'900' }]}>{driver.plate}</Text>
              </View>
            </View>

            <View style={s.featuresBox}>
              <View style={{ flexDirection:'row', alignItems:'center', gap:6, marginBottom:6 }}>
                <Ionicons name="eye" size={16} color={Colors.brand} />
                <Text style={s.featuresHeading}>WHAT TO LOOK FOR</Text>
              </View>
              <Text style={s.featuresText}>{driver.features || 'Nexar dash cam on windshield · Wem sticker rear window'}</Text>
            </View>

            <Text style={s.beReadyText}>Make your way outside and be ready to go!</Text>
          </Animated.View>
        )}
      </View>

      {/* Bottom panel */}
      <View style={s.bottomPanel}>
        {isPickedUp ? (
          /* ── Ride in progress panel ── */
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 280 }}>
            {/* Driver row with profile toggle */}
            <TouchableOpacity style={s.driverRow} onPress={() => setShowDriverProfile(!showDriverProfile)} activeOpacity={0.85}>
              <View style={s.driverAvatar}>
                <Text style={s.driverAvatarText}>MS</Text>
              </View>
              <View style={s.driverInfo}>
                <Text style={s.driverLabel}>YOUR DRIVER</Text>
                <Text style={s.driverName}>{driver.name}</Text>
                <View style={s.certBadge}>
                  <Ionicons name="shield-checkmark" size={11} color={Colors.certText} />
                  <Text style={s.certBadgeText}> Female Driver Option</Text>
                </View>
                <View style={s.bgCheckBadge}>
                  <Ionicons name="checkmark-circle" size={11} color={Colors.green} />
                  <Text style={s.bgCheckText}> Background Checked</Text>
                </View>
              </View>
              <View style={s.driverRight}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Ionicons name="star" size={12} color={Colors.amber} />
                  <Text style={s.driverRating}>{driver.rating}</Text>
                </View>
                <Ionicons
                  name={showDriverProfile ? 'chevron-down' : 'chevron-up'}
                  size={16} color={theme.muted}
                />
              </View>
            </TouchableOpacity>

            {/* Expandable driver profile */}
            {showDriverProfile && (
              <View style={s.driverProfile}>
                {[
                  ['Vehicle', `${driver.vehicle} · ${driver.color}`],
                  ['Plate', driver.plate],
                  ['Rating', `${driver.rating} ⭐ · ${driver.trips.toLocaleString()} trips`],
                  ['Dash cam', 'Nexar One · Recording active'],
                ].map(([label, value]) => (
                  <View key={label} style={s.profileRow}>
                    <Text style={s.profileLabel}>{label}</Text>
                    <Text style={s.profileValue}>{value}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Fare card */}
            <View style={s.fareCard}>
              <View style={s.fareHeader}>
                <Text style={s.fareTitle}>Your Fare</Text>
                {rider.hasPass && (
                  <View style={s.passBadge}>
                    <Ionicons name="star" size={11} color={Colors.passText} />
                    <Text style={s.passBadgeText}> Wem Pass</Text>
                  </View>
                )}
              </View>
              {[
                ['Base fare', `$${FARE.base.toFixed(2)}`, false],
                ['Gas adjustment', rider.hasPass ? 'Waived ✦' : `+$${FARE.gas.toFixed(2)}`, rider.hasPass],
                ['Pickup fee', 'None (within 1 mi)', true],
                ['Peak demand', rider.hasPass ? 'Waived ✦' : '1.5x cap', rider.hasPass],
              ].map(([label, value, green]) => (
                <View key={label} style={s.fareRow}>
                  <Text style={s.fareLabel}>{label}</Text>
                  <Text style={[s.fareValue, green && s.fareGreen]}>{value}</Text>
                </View>
              ))}
              <View style={s.fareTotalRow}>
                <Text style={s.fareTotalLabel}>{rider.hasPass ? 'Your total (Pass rate)' : 'Your total'}</Text>
                <Text style={s.fareTotalValue}>${totalFare.toFixed(2)}</Text>
              </View>
              {rider.hasPass && (
                <Text style={s.fareSavings}>
                  Saving ${(FARE.totalNonPass - FARE.totalPass + FARE.gas).toFixed(2)} with Wem Pass
                </Text>
              )}
            </View>
          </ScrollView>
        ) : (
          /* ── Driver en route panel ── */
          <View style={s.enRoutePanel}>
            <View style={s.driverRow}>
              <View style={s.driverAvatar}>
                <Text style={s.driverAvatarText}>MS</Text>
              </View>
              <View style={s.driverInfo}>
                <Text style={s.driverLabel}>YOUR DRIVER</Text>
                <Text style={s.driverName}>{driver.name}</Text>
              </View>
              <View style={s.driverRight}>
                <Text style={s.etaLarge}>{pickupMins <= 1 ? '1' : pickupMins}</Text>
                <Text style={s.etaLabel}>min away</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Claude chat */}
      {showChat && (
        <View style={s.chatSheet}>
          <View style={s.chatHeader}>
            <View style={s.chatIcon}><Text style={s.chatIconText}>✦</Text></View>
            <Text style={s.chatTitle}>Claude · Wem AI</Text>
            <TouchableOpacity onPress={() => setShowChat(false)}>
              <Ionicons name="chevron-down" size={22} color={theme.muted} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ maxHeight: 180 }} contentContainerStyle={{ padding: 12, gap: 8 }}>
            {messages.length === 0 && (
              <Text style={{ fontSize: Typography.sm, color: theme.subtext, lineHeight: 20 }}>
                I'm here during your ride. Ask me anything.
              </Text>
            )}
            {messages.map((m, i) => (
              <View key={i} style={[s.chatBubble, m.role === 'user' && s.chatBubbleUser]}>
                <Text style={[s.chatText, m.role === 'user' && s.chatTextUser]}>{m.content}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={s.chatSuggs}>
            {["What's good nearby?", "How does SOS work?", "My driver seems off"].map(q => (
              <TouchableOpacity key={q} style={s.chatSugg} onPress={() => sendChat(q)}>
                <Text style={s.chatSuggText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

