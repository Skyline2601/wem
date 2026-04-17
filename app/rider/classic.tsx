import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, SafeAreaView, StatusBar, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import {
  Colors, Typography, Spacing, Radius,
  DEMO_RIDER, DEMO_DRIVER, calculateFare,
} from '../../constants';

const DESTINATIONS = [
  { id: 'lovefield',  icon: 'airplane',          label: 'Love Field Airport',       sub: '7.2 mi · ~14 min', miles: 7.2,  mins: 14 },
  { id: 'baylor',     icon: 'medical',            label: 'Baylor University Medical', sub: '3.1 mi · ~8 min',  miles: 3.1,  mins: 8  },
  { id: 'deepellum',  icon: 'musical-notes',      label: 'Deep Ellum',               sub: '2.8 mi · ~7 min',  miles: 2.8,  mins: 7  },
  { id: 'attstadium', icon: 'american-football',  label: "AT&T Stadium",             sub: '18.4 mi · ~25 min',miles: 18.4, mins: 25 },
  { id: 'dfwairport', icon: 'airplane',           label: 'DFW International Airport', sub: '22.1 mi · ~31 min',miles: 22.1, mins: 31 },
  { id: 'uptown',     icon: 'wine',               label: 'Uptown Dallas',            sub: '1.2 mi · ~4 min',  miles: 1.2,  mins: 4  },
];

const SAVED = [
  { id: 'home',   icon: 'home',      label: 'Home',   sub: '2847 Maple Ave, Dallas',   miles: 5.1, mins: 12 },
  { id: 'office', icon: 'briefcase', label: 'Office', sub: '350 N St Paul St, Dallas', miles: 3.8, mins: 10 },
];

const TIERS = [
  { id: 'standard', icon: 'navigate',  name: 'Wem',      cap: '1–3', eta: '3 min', isNoir: false },
  { id: 'xl',       icon: 'car-sport', name: 'Wem XL',   cap: '1–6', eta: '5 min', isNoir: false },
  { id: 'noir',     icon: 'moon',      name: 'Wem Noir', cap: '1–4', eta: '8 min', isNoir: true  },
];

// Simulated nearby drivers for gender preference
const NEARBY_DRIVERS = {
  female: { count: 3, nearest: '4 min away', status: 'Available', direction: 'heading toward you' },
  male:   { count: 5, nearest: '2 min away', status: 'Available', direction: 'heading toward you' },
  nonbinary: { count: 1, nearest: '9 min away', status: 'On a ride', direction: 'driving away' },
};

const MUSIC_OPTIONS = ['No preference', 'Hip hop', 'R&B', 'Pop', 'Country', 'Rock', 'Latin', 'No music'];
const TEMP_OPTIONS  = ['No preference', 'AC on', 'Heat on', 'No AC/heat'];

export default function ClassicBookingScreen() {
  const router = useRouter();
  const { theme } = useTheme();
const s = useMemo(() => StyleSheet.create({
  safe:           { flex: 1, backgroundColor: theme.bg },
  header:         { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: theme.card, borderBottomWidth: 1, borderBottomColor: theme.border, gap: 10 },
  backBtn:        { padding: 4 },
  headerTitle:    { fontSize: Typography.md, fontWeight: '800', color: theme.text },
  headerSub:      { fontSize: Typography.xs, color: theme.subtext, marginTop: 2 },
  searchWrap:     { flexDirection: 'row', alignItems: 'center', gap: 10, margin: 12, backgroundColor: theme.card, borderRadius: Radius.lg, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1.5, borderColor: theme.border },
  searchInput:    { flex: 1, fontSize: Typography.base, color: theme.text },
  listContent:    { paddingHorizontal: 14, paddingBottom: 24 },
  sectionLabel:   { fontSize: 11, fontWeight: '700', color: theme.muted, letterSpacing: 0.8, marginTop: 16, marginBottom: 8 },
  destRow:        { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border },
  destIcon:       { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  destCopy:       { flex: 1 },
  destLabel:      { fontSize: Typography.base, fontWeight: '700', color: theme.text },
  destSub:        { fontSize: Typography.xs, color: theme.subtext, marginTop: 2 },
  destFare:       { fontSize: Typography.sm, fontWeight: '700', color: Colors.brand },

  // Modal / distance warning styles
  modalWrap:        { flex: 1, justifyContent: 'center', padding: 20 },
  modalCard:        { borderRadius: Radius.xl, borderWidth: 1, padding: 24, gap: 16 },
  modalIcon:        { alignItems: 'center', paddingVertical: 8 },
  modalTitle:       { fontSize: Typography.lg, fontWeight: '900', textAlign: 'center' },
  modalSub:         { fontSize: Typography.sm, textAlign: 'center', lineHeight: 20 },
  modalOptCard:     { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: Colors.brandGlow, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.brand + '22' },
  modalOptCopy:     { flex: 1 },
  modalOptTitle:    { fontSize: Typography.base, fontWeight: '800' },
  modalOptSub:      { fontSize: Typography.xs, marginTop: 2, lineHeight: 16 },
  modalCancel:      { alignItems: 'center', padding: 12 },
  modalCancelText:  { fontSize: Typography.sm, fontWeight: '600' },

  // Guest rider flow styles
  guestNotice:      { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderRadius: Radius.lg, padding: 14, borderWidth: 1 },
  guestNoticeText:  { flex: 1, fontSize: Typography.sm, color: Colors.brand, lineHeight: 20 },
  guestCard:        { borderRadius: Radius.xl, borderWidth: 1, padding: 18, gap: 14 },
  guestCardTitle:   { fontSize: Typography.md, fontWeight: '800' },
  guestInputWrap:   { gap: 6 },
  guestInputLabel:  { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  guestInput:       { borderWidth: 1, borderRadius: Radius.md, padding: 12, fontSize: Typography.base, fontWeight: '600' },
  guestFeatureRow:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  guestFeatureIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  guestFeatureText: { flex: 1, fontSize: Typography.sm, lineHeight: 18 },
  guestBookBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.brand, borderRadius: Radius.lg, paddingVertical: 18 },
  guestBookBtnText: { fontSize: Typography.md, fontWeight: '900', color: Colors.white },

  // Guest link confirmation
  guestLinkIcon:    { width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.green + '18', alignItems: 'center', justifyContent: 'center' },
  guestLinkTitle:   { fontSize: Typography.xl, fontWeight: '900', textAlign: 'center' },
  guestLinkSub:     { fontSize: Typography.sm, lineHeight: 20 },
  guestLinkBox:     { width: '100%', borderRadius: Radius.xl, borderWidth: 1, padding: 18, gap: 8 },
  guestLinkLabel:   { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
  guestLinkUrl:     { fontSize: Typography.base, fontWeight: '800' },
  guestLinkNote:    { fontSize: Typography.xs, lineHeight: 17 },
  guestStatusRow:   { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: Radius.lg, borderWidth: 1, padding: 14 },
  guestStatusText:  { flex: 1, fontSize: Typography.base, fontWeight: '600' },
  guestDoneBtn:     { width: '100%', backgroundColor: Colors.brand, borderRadius: Radius.lg, paddingVertical: 18, alignItems: 'center' },
  guestDoneBtnText: { fontSize: Typography.md, fontWeight: '900', color: Colors.white },

  // Pickup address styles
  pickupRow:      { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: theme.card, borderRadius: Radius.lg, padding: 14, borderWidth: 1, borderColor: theme.border, marginBottom: 4 },
  pickupDot:      { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.brand, flexShrink: 0 },
  pickupCopy:     { flex: 1 },
  pickupLabel:    { fontSize: 10, fontWeight: '700', color: theme.muted, letterSpacing: 0.6 },
  pickupAddr:     { fontSize: Typography.base, fontWeight: '700', color: theme.text, marginTop: 2 },
  pickupPicker:   { backgroundColor: theme.card, borderRadius: Radius.lg, borderWidth: 1, borderColor: theme.border, overflow: 'hidden', marginBottom: 4 },
  pickupOption:   { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderBottomWidth: 1, borderBottomColor: theme.border },
  pickupOptIcon:  { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.brandGlow, alignItems: 'center', justifyContent: 'center' },
  pickupOptLabel: { fontSize: Typography.base, fontWeight: '700', color: theme.text },
  pickupOptSub:   { fontSize: Typography.xs, color: theme.subtext, marginTop: 1 },

  // Stop styles
  stopRow:        { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: theme.card, borderRadius: Radius.lg, padding: 14, borderWidth: 1, borderColor: Colors.amber + '44', marginBottom: 4 },
  stopDot:        { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.amber, flexShrink: 0 },
  stopCopy:       { flex: 1 },
  stopLabel:      { fontSize: 10, fontWeight: '700', color: Colors.amber, letterSpacing: 0.6 },
  stopAddr:       { fontSize: Typography.base, fontWeight: '700', color: theme.text, marginTop: 2 },
  stopRemove:     { padding: 4 },
  addStopBtn:     { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 4 },
  addStopText:    { fontSize: Typography.sm, fontWeight: '700', color: Colors.brand },
  stopSearchWrap: { backgroundColor: theme.card, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.brand + '44', overflow: 'hidden', marginBottom: 4 },
  stopSearchRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderBottomWidth: 1, borderBottomColor: theme.border },
  stopSearchInput:{ flex: 1, fontSize: Typography.base, color: theme.text },
  stopOption:     { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderBottomWidth: 1, borderBottomColor: theme.border },
  stopOptCopy:    { flex: 1 },
  stopOptLabel:   { fontSize: Typography.base, fontWeight: '700', color: theme.text },
  stopOptSub:     { fontSize: Typography.xs, color: theme.subtext, marginTop: 1 },

  // Route divider
  routeDivider:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4 },
  routeLine:      { flex: 1, height: 1, backgroundColor: theme.border },
  routeDividerText: { fontSize: 11, fontWeight: '700', color: theme.muted, letterSpacing: 0.8 },

  // Route summary card (confirm screen)
  routeSummary:       { backgroundColor: theme.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: theme.border, padding: 14, gap: 0 },
  routeSummaryRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  routeSummaryLine:   { width: 1.5, height: 16, backgroundColor: theme.border, marginLeft: 5 },
  routeSummaryDotFrom:{ width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.brand, flexShrink: 0 },
  routeSummaryDotStop:{ width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.amber, flexShrink: 0 },
  routeSummaryDotTo:  { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.green, flexShrink: 0 },
  routeSummaryCopy:   { flex: 1 },
  routeSummaryLabel:  { fontSize: 10, fontWeight: '700', color: theme.muted, letterSpacing: 0.6 },
  routeSummaryAddr:   { fontSize: Typography.base, fontWeight: '700', color: theme.text, marginTop: 2 },
  routeSummaryEdit:   { padding: 4 },
  routeSummaryEditText: { fontSize: Typography.sm, fontWeight: '700', color: Colors.brand },
  addStopInline:      { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 8, paddingLeft: 20 },
  addStopInlineText:  { fontSize: Typography.sm, fontWeight: '700', color: Colors.brand },

  confirmContent: { padding: 14, gap: 12 },
  tiersRow:       { gap: 10, paddingBottom: 4 },
  tierCard:       { width: 110, padding: 12, backgroundColor: theme.card, borderRadius: Radius.lg, borderWidth: 1.5, borderColor: theme.border, alignItems: 'center', gap: 4 },
  tierActive:     { borderColor: Colors.brand, backgroundColor: theme.accentGlow },
  tierNoir:       { backgroundColor: '#07122B', borderColor: '#0F2A45' },
  tierNoirActive: { borderColor: Colors.driverCyan, backgroundColor: '#0F1E35' },
  tierName:       { fontSize: 13, fontWeight: '800', color: theme.text, marginTop: 4 },
  tierNameDark:   { color: Colors.white },
  tierDetail:     { fontSize: 10, color: theme.muted, textAlign: 'center' },
  tierDetailDark: { color: 'rgba(255,255,255,0.4)' },
  tierRate:       { fontSize: 12, fontWeight: '700', color: Colors.brand, marginTop: 4 },
  tierRateDark:   { color: Colors.driverCyan },

  // Gender preference
  genderCard:     { backgroundColor: theme.card, borderRadius: Radius.lg, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' },
  genderNote:     { flexDirection: 'row', alignItems: 'flex-start', gap: 6, padding: 10, backgroundColor: 'rgba(107,136,168,0.08)', borderBottomWidth: 1, borderBottomColor: theme.border },
  genderNoteText: { flex: 1, fontSize: Typography.xs, color: theme.muted, lineHeight: 16 },
  genderOption:   { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: theme.border },
  genderOptionActive: { backgroundColor: theme.accentGlow },
  genderIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' },
  genderIconActive: { backgroundColor: Colors.brand },
  genderCopy:     { flex: 1 },
  genderLabel:    { fontSize: Typography.base, fontWeight: '700', color: theme.text },
  genderLabelActive: { color: Colors.brand },
  genderSub:      { fontSize: Typography.xs, color: theme.muted, marginTop: 2 },
  nearbyRow:      { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  nearbyDot:      { width: 7, height: 7, borderRadius: 4 },
  nearbyText:     { fontSize: Typography.xs, color: theme.subtext },
  nbOption:       { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, backgroundColor: 'rgba(107,136,168,0.05)' },
  nbLabel:        { fontSize: Typography.sm, color: theme.subtext, fontWeight: '600' },

  // Ride preferences
  prefNote:       { flexDirection: 'row', alignItems: 'flex-start', gap: 6, backgroundColor: 'rgba(107,136,168,0.08)', borderRadius: Radius.md, padding: 10, borderWidth: 1, borderColor: theme.border },
  prefNoteText:   { flex: 1, fontSize: Typography.xs, color: theme.muted, lineHeight: 16 },
  prefsCard:      { backgroundColor: theme.card, borderRadius: Radius.lg, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' },
  prefRow:        { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border, flexWrap: 'wrap' },
  prefLeft:       { flexDirection: 'row', alignItems: 'center', gap: 10, minWidth: 120 },
  prefLabel:      { fontSize: Typography.sm, fontWeight: '700', color: theme.text },
  prefSub:        { fontSize: Typography.xs, color: theme.subtext, marginTop: 1 },
  chipScroll:     { flex: 1 },
  chipRow:        { gap: 6, paddingVertical: 4 },
  chip:           { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full, borderWidth: 1.5, borderColor: theme.border, backgroundColor: theme.bg },
  chipActive:     { borderColor: Colors.brand, backgroundColor: theme.accentGlow },
  chipText:       { fontSize: 12, fontWeight: '600', color: theme.subtext },
  chipTextActive: { color: Colors.brand },
  segmentRow:     { flexDirection: 'row', backgroundColor: theme.bg, borderRadius: Radius.md, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' },
  segment:        { paddingHorizontal: 14, paddingVertical: 6 },
  segmentActive:  { backgroundColor: Colors.brand },
  segmentText:    { fontSize: Typography.xs, fontWeight: '700', color: theme.subtext },
  segmentTextActive: { color: Colors.white },

  // Fare
  fareCard:       { backgroundColor: theme.card, borderRadius: Radius.lg, borderWidth: 1, borderColor: theme.border, padding: 14 },
  fareTitle:      { fontSize: Typography.base, fontWeight: '800', color: theme.text, marginBottom: 10 },
  fareRow:        { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: theme.border },
  fareLabel:      { fontSize: Typography.sm, color: theme.subtext },
  fareValue:      { fontSize: Typography.sm, fontWeight: '700', color: theme.text },
  fareGreen:      { color: Colors.green },
  fareTotalRow:   { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 },
  fareTotalLabel: { fontSize: Typography.base, fontWeight: '800', color: theme.text },
  fareTotalValue: { fontSize: Typography.lg, fontWeight: '900', color: Colors.brand },

  bookBtn:        { backgroundColor: Colors.brand, borderRadius: Radius.lg, paddingVertical: 18, alignItems: 'center', marginTop: 4 },
  bookBtnText:    { fontSize: Typography.md, fontWeight: '800', color: Colors.white },
}), [theme]);
  const params = useLocalSearchParams();
  const rider = DEMO_RIDER;
  const driver = DEMO_DRIVER;

  const [screen, setScreen] = useState('dest');
  // "For someone else" flow
  const [rideFor, setRideFor]           = useState<'me' | 'someone'>('me');
  const [guestName, setGuestName]       = useState('');
  const [guestPhone, setGuestPhone]     = useState('');
  const [showGuestFlow, setShowGuestFlow] = useState(false);
  const [showDistanceWarning, setShowDistanceWarning] = useState(false);
  const [showGuestLink, setShowGuestLink] = useState(false);

  // Simulated distance check — in production uses GPS vs pickup coords
  // 0.3 miles = ~500m threshold
  const PICKUP_DISTANCE_THRESHOLD = 0.3;
  const [destination, setDestination] = useState(null);
  const [selectedTier, setSelectedTier] = useState('standard');
  const [query, setQuery] = useState('');

  // Pickup + multi-stop state
  const [pickupAddress, setPickupAddress]       = useState('Current location');
  const simulatedPickupDistance = pickupAddress === 'Current location' ? 0.0 : 0.8;
  const [editingPickup, setEditingPickup]       = useState(false);
  const [pickupQuery, setPickupQuery]           = useState('');
  const [stops, setStops]                       = useState<Array<{id: string; label: string; sub: string; miles: number; mins: number}>>([]);
  const [addingStop, setAddingStop]             = useState(false);
  const [stopQuery, setStopQuery]               = useState('');

  // Driver preference state
  const [driverGender, setDriverGender] = useState('no_preference');

  // Ride comfort preferences
  const [talkingPref, setTalkingPref] = useState(true);    // true = open to talking
  const [musicPref, setMusicPref]     = useState('No preference');
  const [windowPref, setWindowPref]   = useState('no_preference'); // 'down' | 'up' | 'no_preference'
  const [tempPref, setTempPref]       = useState('No preference');

  useEffect(() => {
    const dest = params.dest;
    if (dest) {
      const saved = SAVED.find(s => s.id === dest);
      if (saved) {
        // Check pickup distance before proceeding
        if (simulatedPickupDistance > PICKUP_DISTANCE_THRESHOLD) {
          setShowDistanceWarning(true);
          return;
        }
        setDestination(saved); setScreen('confirm'); return;
      }
      const found = DESTINATIONS.find(d => d.id === dest);
      if (found) {
        if (simulatedPickupDistance > PICKUP_DISTANCE_THRESHOLD) {
          setDestination(found);
          setShowDistanceWarning(true);
          return;
        }
        setDestination(found); setScreen('confirm');
      }
    }
  }, []);

  const filtered = query
    ? DESTINATIONS.filter(d => d.label.toLowerCase().includes(query.toLowerCase()))
    : DESTINATIONS;

  const filteredStops = stopQuery
    ? DESTINATIONS.filter(d => d.label.toLowerCase().includes(stopQuery.toLowerCase()))
    : DESTINATIONS;

  const PICKUP_OPTIONS = [
    { label: 'Current location', sub: 'Using GPS', icon: 'locate' },
    { label: '2847 Maple Ave',   sub: 'Home',      icon: 'home'   },
    { label: '350 N St Paul St', sub: 'Work',      icon: 'briefcase' },
  ];

  const addStop = (dest: any) => {
    setStops(prev => [...prev, dest]);
    setAddingStop(false);
    setStopQuery('');
  };

  const removeStop = (idx: number) => {
    setStops(prev => prev.filter((_, i) => i !== idx));
  };

  // Calculate total fare including all stops
  const totalMiles = destination
    ? destination.miles + stops.reduce((a, s) => a + s.miles, 0)
    : 0;
  const totalMins = destination
    ? destination.mins + stops.reduce((a, s) => a + s.mins, 0)
    : 0;

  const fare = destination
    ? calculateFare(destination?.miles ?? 0, destination?.mins ?? 0, selectedTier, rider.hasPass)
    : null;

  // ── Distance warning modal ────────────────────────────────────────────────
  if (showDistanceWarning) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle="dark-content" />
        <View style={s.modalWrap}>
          <View style={[s.modalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={s.modalIcon}>
              <Ionicons name="location" size={32} color={Colors.amber} />
            </View>
            <Text style={[s.modalTitle, { color: theme.text }]}>You're {simulatedPickupDistance} miles from the pickup spot</Text>
            <Text style={[s.modalSub, { color: theme.subtext }]}>
              That's a longer walk than usual. What would you like to do?
            </Text>

            <TouchableOpacity
              style={s.modalOptCard}
              onPress={() => { setShowDistanceWarning(false); setScreen('confirm'); }}
              activeOpacity={0.85}>
              <Ionicons name="time" size={22} color={Colors.brand} />
              <View style={s.modalOptCopy}>
                <Text style={[s.modalOptTitle, { color: theme.text }]}>Schedule a ride</Text>
                <Text style={[s.modalOptSub, { color: theme.subtext }]}>Pick a time — we'll send the driver when you're ready</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.muted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={s.modalOptCard}
              onPress={() => { setShowDistanceWarning(false); setShowGuestFlow(true); }}
              activeOpacity={0.85}>
              <Ionicons name="people" size={22} color={Colors.brand} />
              <View style={s.modalOptCopy}>
                <Text style={[s.modalOptTitle, { color: theme.text }]}>This ride is for someone else</Text>
                <Text style={[s.modalOptSub, { color: theme.subtext }]}>Book for a friend, family member, or anyone who needs a ride</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.muted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.modalOptCard, { borderColor: theme.border }]}
              onPress={() => { setShowDistanceWarning(false); setScreen('confirm'); }}
              activeOpacity={0.85}>
              <Ionicons name="walk" size={22} color={theme.muted} />
              <View style={s.modalOptCopy}>
                <Text style={[s.modalOptTitle, { color: theme.subtext }]}>I'll walk there — book anyway</Text>
                <Text style={[s.modalOptSub, { color: theme.muted }]}>Driver will wait at the pickup spot</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowDistanceWarning(false)} style={s.modalCancel}>
              <Text style={[s.modalCancelText, { color: theme.muted }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── Guest rider flow ───────────────────────────────────────────────────────
  if (showGuestFlow) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle="dark-content" />
        <View style={[s.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={() => setShowGuestFlow(false)} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={theme.text} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: theme.text }]}>Ride for someone else</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={[s.content, { gap: 14 }]}>
          {/* Safety notice */}
          <View style={[s.guestNotice, { backgroundColor: Colors.brandGlow, borderColor: Colors.brand + '33' }]}>
            <Ionicons name="information-circle" size={20} color={Colors.brand} />
            <Text style={s.guestNoticeText}>
              The rider you book for will receive a{' '}
              <Text style={{ fontWeight: '800' }}>secure Wem safety link</Text> via SMS.
              They get full safety features — live tracking, SOS, Claude check-ins — without needing the app.
              The link expires automatically when the ride ends.
            </Text>
          </View>

          {/* Guest details */}
          <View style={[s.guestCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[s.guestCardTitle, { color: theme.text }]}>Who is this ride for?</Text>

            <View style={s.guestInputWrap}>
              <Text style={[s.guestInputLabel, { color: theme.muted }]}>NAME</Text>
              <TextInput
                style={[s.guestInput, { backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }]}
                placeholder="Their name"
                placeholderTextColor={theme.muted}
                value={guestName}
                onChangeText={setGuestName}
              />
            </View>

            <View style={s.guestInputWrap}>
              <Text style={[s.guestInputLabel, { color: theme.muted }]}>PHONE NUMBER</Text>
              <TextInput
                style={[s.guestInput, { backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }]}
                placeholder="(214) 555-0000"
                placeholderTextColor={theme.muted}
                value={guestPhone}
                onChangeText={setGuestPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* What they get */}
          <View style={[s.guestCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[s.guestCardTitle, { color: theme.text }]}>What {guestName || 'they'} get via the safety link</Text>
            {[
              { icon: 'car',            color: Colors.brand,  text: 'Live driver tracking — plate, color, photo, ETA' },
              { icon: 'alert-circle',   color: Colors.red,    text: 'One-tap SOS — routed through your Wem account' },
              { icon: 'chatbubble',     color: Colors.brand,  text: 'Claude check-ins during the ride' },
              { icon: 'shield-checkmark', color: Colors.green, text: 'Car verification grid before they get in' },
              { icon: 'refresh-circle', color: Colors.amber,  text: 'Link re-opens to the same screen if closed — stays live until ride ends' },
            ].map(item => (
              <View key={item.text} style={s.guestFeatureRow}>
                <View style={[s.guestFeatureIcon, { backgroundColor: item.color + '18' }]}>
                  <Ionicons name={item.icon as any} size={16} color={item.color} />
                </View>
                <Text style={[s.guestFeatureText, { color: theme.subtext }]}>{item.text}</Text>
              </View>
            ))}
          </View>

          {/* Book button */}
          <TouchableOpacity
            style={[s.guestBookBtn, { opacity: guestName && guestPhone.length >= 10 ? 1 : 0.5 }]}
            onPress={() => { setShowGuestFlow(false); setShowGuestLink(true); }}
            disabled={!guestName || guestPhone.length < 10}
            activeOpacity={0.85}>
            <Ionicons name="send" size={20} color={Colors.white} />
            <Text style={s.guestBookBtnText}>Send safety link & book ride</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Guest link sent confirmation ───────────────────────────────────────────
  if (showGuestLink) {
    const demoLink = 'wem-puce.vercel.app/guest/ride-a1b2c3';
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={[s.content, { paddingTop: 40, alignItems: 'center', gap: 16 }]}>
          <View style={s.guestLinkIcon}>
            <Ionicons name="checkmark-circle" size={52} color={Colors.green} />
          </View>
          <Text style={[s.guestLinkTitle, { color: theme.text }]}>
            Safety link sent to {guestName}!
          </Text>
          <Text style={[s.guestLinkSub, { color: theme.subtext, textAlign: 'center' }]}>
            A text message was sent to {guestPhone} with their secure Wem safety link. The driver is on the way.
          </Text>

          <View style={[s.guestLinkBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[s.guestLinkLabel, { color: theme.muted }]}>THEIR SAFETY LINK</Text>
            <Text style={[s.guestLinkUrl, { color: Colors.brand }]}>{demoLink}</Text>
            <Text style={[s.guestLinkNote, { color: theme.subtext }]}>
              This link stays active for the full duration of the ride. If {guestName} closes the browser or hits back, opening the link again brings them right back to the same screen.
            </Text>
          </View>

          {[
            { icon: 'car',          color: Colors.brand, text: 'Driver en route — Maria S., 4.98★' },
            { icon: 'location',     color: Colors.green, text: `Pickup: ${pickupAddress}` },
            { icon: 'navigate',     color: Colors.brand, text: `Drop-off: ${destination?.label || 'Destination'}` },
            { icon: 'time',         color: Colors.amber, text: 'ETA: ~3 min' },
          ].map(item => (
            <View key={item.text} style={[s.guestStatusRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Ionicons name={item.icon as any} size={18} color={item.color} />
              <Text style={[s.guestStatusText, { color: theme.text }]}>{item.text}</Text>
            </View>
          ))}

          <TouchableOpacity
            style={s.guestDoneBtn}
            onPress={() => { setShowGuestLink(false); setScreen('dest'); }}
            activeOpacity={0.85}>
            <Text style={s.guestDoneBtnText}>Done — track in app</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Screen A: Destination picker ──────────────────────────────────────────
  if (screen === 'dest') {
    return (
      <SafeAreaView style={s.safe}>
        <StatusBar barStyle="dark-content" />
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={theme.text} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Where to?</Text>
          <View style={{ width: 30 }} />
        </View>
        {/* Pickup address */}
        <TouchableOpacity
          style={s.pickupRow}
          onPress={() => setEditingPickup(!editingPickup)}
          activeOpacity={0.8}>
          <View style={s.pickupDot} />
          <View style={s.pickupCopy}>
            <Text style={s.pickupLabel}>FROM</Text>
            <Text style={s.pickupAddr}>{pickupAddress}</Text>
          </View>
          <Ionicons name="pencil" size={14} color={theme.muted} />
        </TouchableOpacity>

        {/* Pickup address picker */}
        {editingPickup && (
          <View style={s.pickupPicker}>
            {PICKUP_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.label}
                style={s.pickupOption}
                onPress={() => { setPickupAddress(opt.label); setEditingPickup(false); }}
                activeOpacity={0.8}>
                <View style={s.pickupOptIcon}>
                  <Ionicons name={opt.icon as any} size={16} color={Colors.brand} />
                </View>
                <View>
                  <Text style={s.pickupOptLabel}>{opt.label}</Text>
                  <Text style={s.pickupOptSub}>{opt.sub}</Text>
                </View>
                {pickupAddress === opt.label && (
                  <Ionicons name="checkmark-circle" size={18} color={Colors.brand} style={{ marginLeft: 'auto' }} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Stops */}
        {stops.map((stop, idx) => (
          <View key={idx} style={s.stopRow}>
            <View style={s.stopDot} />
            <View style={s.stopCopy}>
              <Text style={s.stopLabel}>STOP {idx + 1}</Text>
              <Text style={s.stopAddr}>{stop.label}</Text>
            </View>
            <TouchableOpacity onPress={() => removeStop(idx)} style={s.stopRemove}>
              <Ionicons name="close-circle" size={18} color={theme.muted} />
            </TouchableOpacity>
          </View>
        ))}

        {/* Add stop button */}
        {!addingStop && (
          <TouchableOpacity style={s.addStopBtn} onPress={() => setAddingStop(true)} activeOpacity={0.8}>
            <Ionicons name="add-circle-outline" size={18} color={Colors.brand} />
            <Text style={s.addStopText}>Add a stop</Text>
          </TouchableOpacity>
        )}

        {/* Stop search */}
        {addingStop && (
          <View style={s.stopSearchWrap}>
            <View style={s.stopSearchRow}>
              <Ionicons name="search" size={15} color={theme.muted} />
              <TextInput
                style={s.stopSearchInput}
                placeholder="Search stops..."
                placeholderTextColor={theme.muted}
                value={stopQuery}
                onChangeText={setStopQuery}
                autoFocus
              />
              <TouchableOpacity onPress={() => { setAddingStop(false); setStopQuery(''); }}>
                <Ionicons name="close" size={18} color={theme.muted} />
              </TouchableOpacity>
            </View>
            {filteredStops.slice(0, 4).map(dest => (
              <TouchableOpacity
                key={dest.id}
                style={s.stopOption}
                onPress={() => addStop(dest)}
                activeOpacity={0.8}>
                <Ionicons name={dest.icon as any} size={16} color={theme.subtext} />
                <View style={s.stopOptCopy}>
                  <Text style={s.stopOptLabel}>{dest.label}</Text>
                  <Text style={s.stopOptSub}>{dest.sub}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Divider */}
        <View style={s.routeDivider}>
          <View style={s.routeLine} />
          <Text style={s.routeDividerText}>TO</Text>
          <View style={s.routeLine} />
        </View>

        {/* Destination search */}
        <View style={s.searchWrap}>
          <Ionicons name="search" size={16} color={theme.muted} />
          <TextInput
            style={s.searchInput}
            placeholder="Search destinations..."
            placeholderTextColor={theme.muted}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.muted} />
            </TouchableOpacity>
          )}
        </View>
        <ScrollView contentContainerStyle={s.listContent} showsVerticalScrollIndicator={false}>
          {!query && (
            <>
              <Text style={s.sectionLabel}>SAVED PLACES</Text>
              {SAVED.map(place => (
                <TouchableOpacity key={place.id} style={s.destRow}
                  onPress={() => { setDestination(place); setScreen('confirm'); }} activeOpacity={0.82}>
                  <View style={[s.destIcon, { backgroundColor: Colors.brandGlow }]}>
                    <Ionicons name={place.icon} size={18} color={Colors.brand} />
                  </View>
                  <View style={s.destCopy}>
                    <Text style={s.destLabel}>{place.label}</Text>
                    <Text style={s.destSub}>{place.sub}</Text>
                  </View>
                  <Text style={s.destFare}>
                    {rider.hasPass ? `$${calculateFare(place.miles, place.mins).passRate}` : `$${calculateFare(place.miles, place.mins).total}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}
          <Text style={s.sectionLabel}>{query ? 'RESULTS' : 'POPULAR IN DFW'}</Text>
          {filtered.map(dest => (
            <TouchableOpacity key={dest.id} style={s.destRow}
              onPress={() => { setDestination(dest); setScreen('confirm'); }} activeOpacity={0.82}>
              <View style={[s.destIcon, { backgroundColor: 'rgba(107,136,168,0.1)' }]}>
                <Ionicons name={dest.icon} size={18} color={theme.subtext} />
              </View>
              <View style={s.destCopy}>
                <Text style={s.destLabel}>{dest.label}</Text>
                <Text style={s.destSub}>{dest.sub}</Text>
              </View>
              <Text style={s.destFare}>
                {rider.hasPass ? `$${calculateFare(dest.miles, dest.mins).passRate}` : `$${calculateFare(dest.miles, dest.mins).total}`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Screen B: Tier + Driver + Preferences + Confirm ───────────────────────
  // Guard: if no destination selected yet, go back to dest screen
  if (!destination) {
    setScreen('dest');
    return null;
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => setScreen('dest')} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>Confirm Ride</Text>
          {destination && <Text style={s.headerSub} numberOfLines={1}>{stops.length > 0 ? `${stops.length + 1} stops · ` : ''}to {destination.label}</Text>}
        </View>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={s.confirmContent} showsVerticalScrollIndicator={false}>

        {/* ── Route summary ── */}
        <View style={s.routeSummary}>
          {/* Pickup */}
          <View style={s.routeSummaryRow}>
            <View style={s.routeSummaryDotFrom} />
            <View style={s.routeSummaryCopy}>
              <Text style={s.routeSummaryLabel}>PICKUP</Text>
              <Text style={s.routeSummaryAddr}>{pickupAddress}</Text>
            </View>
            <TouchableOpacity onPress={() => setScreen('dest')} style={s.routeSummaryEdit}>
              <Text style={s.routeSummaryEditText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Stops */}
          {stops.map((stop, idx) => (
            <View key={idx}>
              <View style={s.routeSummaryLine} />
              <View style={s.routeSummaryRow}>
                <View style={s.routeSummaryDotStop} />
                <View style={s.routeSummaryCopy}>
                  <Text style={s.routeSummaryLabel}>STOP {idx + 1}</Text>
                  <Text style={s.routeSummaryAddr}>{stop.label}</Text>
                </View>
                <TouchableOpacity onPress={() => removeStop(idx)} style={s.routeSummaryEdit}>
                  <Ionicons name="close-circle-outline" size={16} color={theme.muted} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Destination */}
          <View style={s.routeSummaryLine} />
          <View style={s.routeSummaryRow}>
            <View style={s.routeSummaryDotTo} />
            <View style={s.routeSummaryCopy}>
              <Text style={s.routeSummaryLabel}>DESTINATION</Text>
              <Text style={s.routeSummaryAddr}>{destination?.label}</Text>
            </View>
            <TouchableOpacity onPress={() => setScreen('dest')} style={s.routeSummaryEdit}>
              <Text style={s.routeSummaryEditText}>Change</Text>
            </TouchableOpacity>
          </View>

          {stops.length === 0 && (
            <TouchableOpacity style={s.addStopInline} onPress={() => setScreen('dest')} activeOpacity={0.8}>
              <Ionicons name="add-circle-outline" size={16} color={Colors.brand} />
              <Text style={s.addStopInlineText}>Add a stop</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Tier selector ── */}
        <Text style={s.sectionLabel}>CHOOSE YOUR RIDE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tiersRow}>
          {TIERS.map(tier => {
            const active = selectedTier === tier.id;
            const f = destination ? calculateFare(destination.miles, destination.mins, tier.id, rider.hasPass) : null;
            return (
              <TouchableOpacity key={tier.id} activeOpacity={0.85}
                style={[s.tierCard, tier.isNoir && s.tierNoir, active && !tier.isNoir && s.tierActive, active && tier.isNoir && s.tierNoirActive]}
                onPress={() => setSelectedTier(tier.id)}>
                <Ionicons name={tier.icon} size={26} color={tier.isNoir ? Colors.driverCyan : active ? Colors.brand : theme.muted} />
                <Text style={[s.tierName, tier.isNoir && s.tierNameDark]}>{tier.name}</Text>
                <Text style={[s.tierDetail, tier.isNoir && s.tierDetailDark]}>{tier.cap} · {tier.eta}</Text>
                {f && <Text style={[s.tierRate, tier.isNoir && s.tierRateDark]}>{rider.hasPass ? `$${f.passRate}` : `$${f.total}`}</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Driver gender preference ── */}
        <Text style={s.sectionLabel}>CHOOSE YOUR DRIVER</Text>
        <View style={s.genderCard}>
          <View style={s.genderNote}>
            <Ionicons name="information-circle" size={14} color={theme.muted} />
            <Text style={s.genderNoteText}>
              Selecting a specific driver may increase your wait time. We match based on availability.
            </Text>
          </View>

          {[
            { id: 'no_preference', label: 'No preference', icon: 'people',  sub: 'Fastest available driver' },
            { id: 'female',        label: 'Female driver', icon: 'person',  sub: null },
            { id: 'male',          label: 'Male driver',   icon: 'person',  sub: null },
          ].map(opt => {
            const nearby = opt.id !== 'no_preference' ? NEARBY_DRIVERS[opt.id] : null;
            const active = driverGender === opt.id;
            return (
              <TouchableOpacity key={opt.id} style={[s.genderOption, active && s.genderOptionActive]}
                onPress={() => setDriverGender(opt.id)} activeOpacity={0.82}>
                <View style={[s.genderIconWrap, active && s.genderIconActive]}>
                  <Ionicons name={opt.icon} size={18} color={active ? Colors.white : theme.subtext} />
                </View>
                <View style={s.genderCopy}>
                  <Text style={[s.genderLabel, active && s.genderLabelActive]}>{opt.label}</Text>
                  {opt.sub && <Text style={s.genderSub}>{opt.sub}</Text>}
                  {nearby && (
                    <View style={s.nearbyRow}>
                      <View style={[s.nearbyDot, { backgroundColor: nearby.status === 'Available' ? Colors.green : Colors.amber }]} />
                      <Text style={s.nearbyText}>
                        {nearby.count} nearby · {nearby.nearest} · {nearby.status === 'Available' ? nearby.direction : nearby.status + ', ' + nearby.direction}
                      </Text>
                    </View>
                  )}
                </View>
                {active && <Ionicons name="checkmark-circle" size={20} color={Colors.brand} />}
              </TouchableOpacity>
            );
          })}

          {/* Transgender/non-binary note */}
          <TouchableOpacity style={s.nbOption}
            onPress={() => setDriverGender(driverGender === 'nonbinary' ? 'no_preference' : 'nonbinary')}
            activeOpacity={0.82}>
            <Ionicons
              name={driverGender === 'nonbinary' ? 'checkmark-circle' : 'ellipse-outline'}
              size={18}
              color={driverGender === 'nonbinary' ? Colors.brand : theme.muted}
            />
            <View style={{ flex: 1 }}>
              <Text style={s.nbLabel}>Non-binary / any gender identity</Text>
              {driverGender === 'nonbinary' && NEARBY_DRIVERS.nonbinary && (
                <View style={s.nearbyRow}>
                  <View style={[s.nearbyDot, { backgroundColor: Colors.amber }]} />
                  <Text style={s.nearbyText}>
                    {NEARBY_DRIVERS.nonbinary.count} nearby · {NEARBY_DRIVERS.nonbinary.nearest} · {NEARBY_DRIVERS.nonbinary.status}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Ride preferences ── */}
        <Text style={s.sectionLabel}>RIDE PREFERENCES</Text>
        <View style={s.prefNote}>
          <Ionicons name="information-circle" size={14} color={theme.muted} />
          <Text style={s.prefNoteText}>
            These preferences are shared with your driver as a courtesy. They are not guaranteed.
          </Text>
        </View>

        <View style={s.prefsCard}>

          {/* Talking */}
          <View style={s.prefRow}>
            <View style={s.prefLeft}>
              <Ionicons name="chatbubble" size={18} color={Colors.brand} />
              <View>
                <Text style={s.prefLabel}>Conversation</Text>
                <Text style={s.prefSub}>{talkingPref ? 'Open to chatting' : 'Quiet ride please'}</Text>
              </View>
            </View>
            <Switch
              value={talkingPref}
              onValueChange={setTalkingPref}
              trackColor={{ false: theme.border, true: Colors.brand }}
              thumbColor={Colors.white}
            />
          </View>

          {/* Music */}
          <View style={s.prefRow}>
            <View style={s.prefLeft}>
              <Ionicons name="musical-notes" size={18} color={Colors.brand} />
              <Text style={s.prefLabel}>Music</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipScroll}
              contentContainerStyle={s.chipRow}>
              {MUSIC_OPTIONS.map(opt => (
                <TouchableOpacity key={opt}
                  style={[s.chip, musicPref === opt && s.chipActive]}
                  onPress={() => setMusicPref(opt)}>
                  <Text style={[s.chipText, musicPref === opt && s.chipTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Windows */}
          <View style={s.prefRow}>
            <View style={s.prefLeft}>
              <Ionicons name="car" size={18} color={Colors.brand} />
              <Text style={s.prefLabel}>Windows</Text>
            </View>
            <View style={s.segmentRow}>
              {[
                { id: 'no_preference', label: 'Either' },
                { id: 'down', label: 'Down' },
                { id: 'up', label: 'Up' },
              ].map(opt => (
                <TouchableOpacity key={opt.id}
                  style={[s.segment, windowPref === opt.id && s.segmentActive]}
                  onPress={() => setWindowPref(opt.id)}>
                  <Text style={[s.segmentText, windowPref === opt.id && s.segmentTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Temperature */}
          <View style={[s.prefRow, { borderBottomWidth: 0 }]}>
            <View style={s.prefLeft}>
              <Ionicons name="thermometer" size={18} color={Colors.brand} />
              <Text style={s.prefLabel}>Temperature</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipScroll}
              contentContainerStyle={s.chipRow}>
              {TEMP_OPTIONS.map(opt => (
                <TouchableOpacity key={opt}
                  style={[s.chip, tempPref === opt && s.chipActive]}
                  onPress={() => setTempPref(opt)}>
                  <Text style={[s.chipText, tempPref === opt && s.chipTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* ── Fare breakdown ── */}
        {fare && (
          <View style={s.fareCard}>
            <Text style={s.fareTitle}>Fare Breakdown</Text>
            {[
              ['Base fare', `$${fare.base}`],
              ['Gas adjustment', rider.hasPass ? 'Waived ✦' : `+$${fare.gas}`],
              ['Pickup fee', fare.pickup > 0 ? (rider.hasPass ? 'Waived ✦' : `+$${fare.pickup}`) : 'None (within 1 mi)'],
              ['Peak demand', rider.hasPass ? 'Waived ✦' : '1.5x cap'],
            ].map(([label, value]) => (
              <View key={label} style={s.fareRow}>
                <Text style={s.fareLabel}>{label}</Text>
                <Text style={[s.fareValue, (String(value).includes('Waived') || value === 'None (within 1 mi)') && s.fareGreen]}>
                  {value}
                </Text>
              </View>
            ))}
            <View style={s.fareTotalRow}>
              <Text style={s.fareTotalLabel}>{rider.hasPass ? 'Your total (Pass rate)' : 'Your total'}</Text>
              <Text style={s.fareTotalValue}>${rider.hasPass ? fare.passRate : fare.total}</Text>
            </View>
          </View>
        )}

        {/* ── Book button ── */}
        <TouchableOpacity style={s.bookBtn}
          onPress={() => router.replace('/rider/active')} activeOpacity={0.85}>
          <Text style={s.bookBtnText}>
            Book {TIERS.find(t => t.id === selectedTier)?.name} · ${fare ? (rider.hasPass ? fare.passRate : fare.total) : '--'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

