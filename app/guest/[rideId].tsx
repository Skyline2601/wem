/**
 * Guest Safety Link Page
 * Accessible via: wem-puce.vercel.app/guest/[rideId]
 *
 * - No account or app required
 * - Shows live driver info, car verification, SOS, Claude check-ins
 * - Survives browser back/close — link stays live until ride ends
 * - Expires automatically when ride completes
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Radius, Shadow, DEMO_DRIVER } from '../../constants';

// Demo ride data — in production fetched from Supabase by rideId
const DEMO_RIDE = {
  id:         'ride-a1b2c3',
  status:     'active', // active | completed | cancelled
  guestName:  'Sarah',
  bookedBy:   'Jessica T.',
  driver:     DEMO_DRIVER,
  pickup:     '2847 Maple Ave, Dallas',
  dropoff:    'Baylor Medical Center, Dallas',
  etaMins:    4,
  progress:   0.35, // 0–1
};

export default function GuestRidePage() {
  const { rideId } = useLocalSearchParams();
  const [ride]           = useState(DEMO_RIDE);
  const [sosPressed, setSos]   = useState(false);
  const [sosCancelled, setSosCancelled] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [checkIn, setCheckIn]  = useState(0); // 0=waiting, 1=confirmed, 2=done
  const [verified, setVerified] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse the SOS button
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 900, useNativeDriver: false }),
        Animated.timing(pulseAnim, { toValue: 1.0,  duration: 900, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  // SOS countdown
  useEffect(() => {
    if (!sosPressed || sosCancelled) return;
    if (sosCountdown <= 0) return; // dispatched
    const t = setInterval(() => setSosCountdown(n => n - 1), 1000);
    return () => clearInterval(t);
  }, [sosPressed, sosCancelled, sosCountdown]);

  const rideEnded = ride.status === 'completed' || ride.status === 'cancelled';

  // ── Ride ended ──────────────────────────────────────────────────────────────
  if (rideEnded) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: Colors.riderBg }]}>
        <View style={s.endedWrap}>
          <Ionicons name="checkmark-circle" size={64} color={Colors.green} />
          <Text style={s.endedTitle}>Ride complete</Text>
          <Text style={s.endedSub}>
            This safety link has expired. {ride.guestName} arrived safely.
          </Text>
          <Text style={s.endedNote}>
            Booked by {ride.bookedBy} via Wem
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: Colors.riderBg }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header — guest context */}
      <View style={s.header}>
        <View style={s.wemBadge}>
          <Text style={s.wemBadgeText}>W</Text>
        </View>
        <View style={s.headerCopy}>
          <Text style={s.headerTitle}>Wem Safety Link</Text>
          <Text style={s.headerSub}>
            Booked by {ride.bookedBy} · Ride #{rideId?.toString().slice(-6) || 'a1b2c3'}
          </Text>
        </View>
        <View style={[s.liveBadge]}>
          <View style={s.liveDot} />
          <Text style={s.liveText}>LIVE</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Session persistence note */}
        <View style={s.persistNote}>
          <Ionicons name="refresh-circle" size={14} color={Colors.brand} />
          <Text style={s.persistNoteText}>
            Closed this page? No problem — this link stays active until your ride ends.
            Just open it again.
          </Text>
        </View>

        {/* Car verification — top priority */}
        <View style={[s.verifyCard, verified && s.verifyCardDone]}>
          <Text style={s.verifyTitle}>
            {verified ? '✓ You confirmed your car' : '⚠ Verify your car before getting in'}
          </Text>
          <View style={s.verifyGrid}>
            {[
              { label: 'PLATE',  value: ride.driver.plate,  highlight: true },
              { label: 'COLOR',  value: ride.driver.color,  highlight: false },
              { label: 'DRIVER', value: ride.driver.name,   highlight: false },
              { label: 'CAR',    value: ride.driver.vehicle, highlight: false },
            ].map(item => (
              <View key={item.label} style={s.verifyItem}>
                <Text style={s.verifyLabel}>{item.label}</Text>
                <Text style={[s.verifyValue, item.highlight && { color: Colors.brand }]}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
          {!verified ? (
            <TouchableOpacity style={s.verifyBtn} onPress={() => setVerified(true)} activeOpacity={0.85}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
              <Text style={s.verifyBtnText}>Yes — I'm in the right car</Text>
            </TouchableOpacity>
          ) : (
            <View style={s.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.green} />
              <Text style={s.verifiedText}>Car verified — have a safe ride!</Text>
            </View>
          )}
        </View>

        {/* Ride status */}
        <View style={s.statusCard}>
          <View style={s.statusRow}>
            <View style={s.routeDotFrom} />
            <View style={s.routeLine} />
            <View style={s.routeDotTo} />
            <View style={s.statusLabels}>
              <Text style={s.statusFrom}>{ride.pickup}</Text>
              <Text style={s.statusTo}>{ride.dropoff}</Text>
            </View>
          </View>
          <View style={s.statusEta}>
            <Ionicons name="time" size={16} color={Colors.brand} />
            <Text style={s.statusEtaText}>~{ride.etaMins} min remaining</Text>
          </View>
          {/* Progress bar */}
          <View style={s.progressBg}>
            <View style={[s.progressFill, { width: `${ride.progress * 100}%` as any }]} />
          </View>
        </View>

        {/* Claude check-in */}
        <View style={s.checkinCard}>
          <View style={s.checkinHeader}>
            <View style={s.claudeIcon}>
              <Text style={s.claudeIconText}>✦</Text>
            </View>
            <View>
              <Text style={s.checkinTitle}>Claude check-in</Text>
              <Text style={s.checkinSub}>Wem AI · Powered by Anthropic</Text>
            </View>
          </View>

          {checkIn === 0 && (
            <>
              <Text style={s.checkinMsg}>
                Hi {ride.guestName}! Just checking in — are you safely in the car and on your way?
              </Text>
              <View style={s.checkinBtns}>
                <TouchableOpacity style={s.checkinYes} onPress={() => setCheckIn(1)} activeOpacity={0.85}>
                  <Text style={s.checkinYesText}>✓ Yes, I'm good</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.checkinNo} onPress={() => setSos(true)} activeOpacity={0.85}>
                  <Text style={s.checkinNoText}>I need help</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {checkIn === 1 && (
            <>
              <Text style={s.checkinMsg}>
                Great! I'll check back in when you're almost there. Enjoy the ride.
              </Text>
              <TouchableOpacity style={s.checkinYes} onPress={() => setCheckIn(2)} activeOpacity={0.85}>
                <Text style={s.checkinYesText}>Thanks ✓</Text>
              </TouchableOpacity>
            </>
          )}

          {checkIn === 2 && (
            <Text style={[s.checkinMsg, { color: Colors.green, fontWeight: '700' }]}>
              You're almost there! Make sure you have all your belongings.
            </Text>
          )}
        </View>

        {/* SOS */}
        {!sosPressed ? (
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={s.sosBtn}
              onPress={() => { setSos(true); setSosCountdown(5); }}
              activeOpacity={0.9}>
              <Ionicons name="alert-circle" size={26} color={Colors.white} />
              <View>
                <Text style={s.sosBtnTitle}>SOS — I need help now</Text>
                <Text style={s.sosBtnSub}>5-second countdown · Silent · No app needed</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ) : sosCancelled ? (
          <View style={[s.sosBtn, { backgroundColor: Colors.green }]}>
            <Ionicons name="checkmark-circle" size={26} color={Colors.white} />
            <Text style={s.sosBtnTitle}>SOS cancelled — stay safe</Text>
          </View>
        ) : sosCountdown > 0 ? (
          <View style={[s.sosBtn, { backgroundColor: Colors.amber }]}>
            <Text style={s.sosCountdown}>{sosCountdown}</Text>
            <View>
              <Text style={s.sosBtnTitle}>Sending SOS in {sosCountdown}s...</Text>
              <TouchableOpacity onPress={() => { setSosCancelled(true); setSos(false); setSosCountdown(5); }}>
                <Text style={[s.sosBtnSub, { textDecorationLine: 'underline', fontWeight: '700' }]}>
                  TAP TO CANCEL
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={[s.sosBtn, { backgroundColor: Colors.red }]}>
            <Ionicons name="alert-circle" size={26} color={Colors.white} />
            <View>
              <Text style={s.sosBtnTitle}>🔴 SOS sent — help is coming</Text>
              <Text style={s.sosBtnSub}>Wem monitoring center alerted · GPS shared</Text>
            </View>
          </View>
        )}

        {/* Footer note */}
        <Text style={s.footerNote}>
          This is a temporary Wem safety link. It's active for this ride only and expires when the ride ends.
          All safety features are covered by {ride.bookedBy}'s Wem account.
        </Text>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: Colors.riderBg },
  header:       { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: Colors.riderCard, borderBottomWidth: 1, borderBottomColor: Colors.riderBorder },
  wemBadge:     { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center' },
  wemBadgeText: { fontSize: 18, fontWeight: '900', color: Colors.white },
  headerCopy:   { flex: 1 },
  headerTitle:  { fontSize: Typography.base, fontWeight: '800', color: Colors.riderText },
  headerSub:    { fontSize: Typography.xs, color: Colors.riderSubtext, marginTop: 1 },
  liveBadge:    { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.green + '18', borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: Colors.green + '44' },
  liveDot:      { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.green },
  liveText:     { fontSize: 10, fontWeight: '800', color: Colors.green, letterSpacing: 0.8 },

  persistNote:  { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.brandGlow, borderRadius: Radius.md, padding: 12, borderWidth: 1, borderColor: Colors.brand + '22' },
  persistNoteText: { flex: 1, fontSize: Typography.xs, color: Colors.brand, lineHeight: 17 },

  content:      { padding: 14, gap: 12 },

  // Car verify
  verifyCard:   { backgroundColor: Colors.riderCard, borderRadius: Radius.xl, borderWidth: 1.5, borderColor: Colors.amber + '66', padding: 18, gap: 14 },
  verifyCardDone:{ borderColor: Colors.green + '66' },
  verifyTitle:  { fontSize: Typography.base, fontWeight: '900', color: Colors.riderText, textAlign: 'center' },
  verifyGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  verifyItem:   { width: '47%', backgroundColor: Colors.riderBg, borderRadius: Radius.md, padding: 12, borderWidth: 1, borderColor: Colors.riderBorder },
  verifyLabel:  { fontSize: 10, fontWeight: '800', color: Colors.riderMuted, letterSpacing: 0.8 },
  verifyValue:  { fontSize: Typography.md, fontWeight: '800', color: Colors.riderText, marginTop: 4 },
  verifyBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.green, borderRadius: Radius.lg, paddingVertical: 15 },
  verifyBtnText:{ fontSize: Typography.base, fontWeight: '800', color: Colors.white },
  verifiedBadge:{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.green + '18', borderRadius: Radius.md, padding: 10 },
  verifiedText: { fontSize: Typography.sm, fontWeight: '700', color: Colors.green },

  // Status
  statusCard:   { backgroundColor: Colors.riderCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.riderBorder, padding: 16, gap: 12 },
  statusRow:    { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  routeDotFrom: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.brand, marginTop: 4, flexShrink: 0 },
  routeLine:    { display: 'none' },
  routeDotTo:   { display: 'none' },
  statusLabels: { flex: 1, gap: 8 },
  statusFrom:   { fontSize: Typography.base, fontWeight: '700', color: Colors.riderText },
  statusTo:     { fontSize: Typography.base, fontWeight: '700', color: Colors.riderText },
  statusEta:    { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusEtaText:{ fontSize: Typography.sm, fontWeight: '700', color: Colors.brand },
  progressBg:   { height: 6, backgroundColor: Colors.riderBorder, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: Colors.brand, borderRadius: 3 },

  // Check-in
  checkinCard:  { backgroundColor: Colors.riderCard, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.riderBorder, padding: 16, gap: 12 },
  checkinHeader:{ flexDirection: 'row', alignItems: 'center', gap: 10 },
  claudeIcon:   { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center' },
  claudeIconText:{ color: Colors.white, fontSize: 16, fontWeight: '900' },
  checkinTitle: { fontSize: Typography.base, fontWeight: '800', color: Colors.riderText },
  checkinSub:   { fontSize: Typography.xs, color: Colors.riderSubtext },
  checkinMsg:   { fontSize: Typography.base, color: Colors.riderSubtext, lineHeight: 22 },
  checkinBtns:  { flexDirection: 'row', gap: 10 },
  checkinYes:   { flex: 1, backgroundColor: Colors.green, borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center' },
  checkinYesText:{ fontSize: Typography.base, fontWeight: '800', color: Colors.white },
  checkinNo:    { paddingHorizontal: 20, paddingVertical: 14, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.riderBorder, alignItems: 'center' },
  checkinNoText:{ fontSize: Typography.base, fontWeight: '600', color: Colors.red },

  // SOS
  sosBtn:       { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: Colors.red, borderRadius: Radius.xl, padding: 20 },
  sosBtnTitle:  { fontSize: Typography.lg, fontWeight: '900', color: Colors.white },
  sosBtnSub:    { fontSize: Typography.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  sosCountdown: { fontSize: 32, fontWeight: '900', color: Colors.white, width: 44, textAlign: 'center' },

  // End state
  endedWrap:    { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },
  endedTitle:   { fontSize: Typography.xl, fontWeight: '900', color: Colors.riderText },
  endedSub:     { fontSize: Typography.base, color: Colors.riderSubtext, textAlign: 'center', lineHeight: 22 },
  endedNote:    { fontSize: Typography.sm, color: Colors.riderMuted, textAlign: 'center' },

  footerNote:   { fontSize: Typography.xs, color: Colors.riderMuted, textAlign: 'center', lineHeight: 17, paddingHorizontal: 8 },
});
