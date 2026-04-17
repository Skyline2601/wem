/**
 * Driver Safety Hub
 * Driver-specific safety features — dash cam, route monitoring, SOS, incident reporting
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Animated, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { Colors, Typography, Radius, Shadow } from '../../constants';

const FEATURES = [
  {
    icon:  'videocam',
    color: '#0A84FF',
    title: 'Dash Cam Recording',
    desc:  'Every ride is recorded automatically when you accept. Footage is encrypted and stored for 30 days. Available to you and Wem safety team if needed.',
    badge: 'ACTIVE',
    badgeColor: Colors.green,
  },
  {
    icon:  'navigate',
    color: Colors.green,
    title: 'Route Monitoring',
    desc:  "Wem monitors both your route and the rider's route in real time. Any significant deviation triggers an alert to both parties.",
    badge: 'ACTIVE',
    badgeColor: Colors.green,
  },
  {
    icon:  'alert-circle',
    color: Colors.red,
    title: 'Driver SOS',
    desc:  'Hold for 3 seconds if you feel unsafe. Silently alerts Wem safety team with your GPS location. Use if a rider is behaving dangerously.',
    badge: 'READY',
    badgeColor: Colors.amber,
  },
  {
    icon:  'chatbubbles',
    color: '#A78BFA',
    title: 'Claude AI Support',
    desc:  "Claude monitors ride communications and can flag concerns. You can also message Claude directly during a ride if you need guidance.",
    badge: 'ACTIVE',
    badgeColor: Colors.green,
  },
  {
    icon:  'document-text',
    color: Colors.amber,
    title: 'Incident Reporting',
    desc:  'Report any incident directly from the app after a ride. Wem\'s team reviews every report within 24 hours and follows up.',
    badge: 'AVAILABLE',
    badgeColor: Colors.amber,
  },
  {
    icon:  'shield-checkmark',
    color: Colors.brand,
    title: 'Background Check Status',
    desc:  'Your background check is renewed automatically every 12 months. You\'ll be notified 30 days before renewal is needed.',
    badge: 'VERIFIED',
    badgeColor: Colors.green,
  },
  {
    icon:  'people',
    color: '#FF6B9D',
    title: 'Female Driver Option',
    desc:  'Female Driver Option drivers complete additional vetting and background screening. Enables you to accept rides from female riders who request this.',
    badge: 'OPTIONAL',
    badgeColor: '#FF6B9D',
  },
  {
    icon:  'phone-portrait',
    color: '#00E5FF',
    title: 'Rider Safety Link',
    desc:  'When a rider books for someone else, that person receives a secure Wem safety link. It shows them your verified info — plate, color, photo — before they get in.',
    badge: 'AUTO',
    badgeColor: '#00E5FF',
  },
];

export default function DriverSafetyScreen() {
  const router  = useRouter();
  const { theme } = useTheme();
  const [dashCam,    setDashCam]    = useState(true);
  const [routeMon,   setRouteMon]   = useState(true);
  const [sosActive,  setSosActive]  = useState(false);
  const [sosCount,   setSosCount]   = useState(3);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.06, duration: 900, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1.0,  duration: 900, useNativeDriver: true }),
    ])).start();
  }, []);

  useEffect(() => {
    if (!sosActive) return;
    if (sosCount <= 0) return;
    const t = setInterval(() => setSosCount(n => n - 1), 1000);
    return () => clearInterval(t);
  }, [sosActive, sosCount]);

  const s = StyleSheet.create({
    safe:         { flex: 1, backgroundColor: theme.bg },
    header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: theme.card, borderBottomWidth: 1, borderBottomColor: theme.border },
    back:         { padding: 4 },
    headerTitle:  { fontSize: Typography.md, fontWeight: '900', color: theme.text },
    content:      { padding: 14, gap: 14, paddingBottom: 40 },

    heroBanner:   { borderRadius: Radius.xl, padding: 20, gap: 8, backgroundColor: '#07122B', borderWidth: 1, borderColor: '#00E5FF22' },
    heroTop:      { flexDirection: 'row', alignItems: 'center', gap: 12 },
    heroIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,229,255,0.15)', alignItems: 'center', justifyContent: 'center' },
    heroTitle:    { flex: 1, fontSize: Typography.lg, fontWeight: '900', color: Colors.white },
    heroSub:      { fontSize: Typography.sm, color: 'rgba(255,255,255,0.55)', lineHeight: 20 },
    heroDots:     { flexDirection: 'row', gap: 6, marginTop: 6 },
    heroDot:      { width: 8, height: 8, borderRadius: 4 },

    toggleCard:   { backgroundColor: theme.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: theme.border, padding: 16 },
    toggleLabel:  { fontSize: 11, fontWeight: '700', color: theme.muted, letterSpacing: 0.8, marginBottom: 12 },
    toggleRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.border },
    toggleRowLast:{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
    toggleIcon:   { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    toggleCopy:   { flex: 1 },
    toggleTitle:  { fontSize: Typography.base, fontWeight: '700', color: theme.text },
    toggleSub:    { fontSize: Typography.xs, color: theme.subtext, marginTop: 2 },

    sectionLabel: { fontSize: 11, fontWeight: '700', color: theme.muted, letterSpacing: 0.8 },
    featureCard:  { backgroundColor: theme.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: theme.border, padding: 16, gap: 10 },
    featureTop:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
    featureIcon:  { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    featureTitle: { flex: 1, fontSize: Typography.base, fontWeight: '800', color: theme.text },
    featureBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
    featureBadgeTxt:{ fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
    featureDesc:  { fontSize: Typography.sm, color: theme.subtext, lineHeight: 20 },

    sosBtn:       { borderRadius: Radius.xl, alignItems: 'center', padding: 20, gap: 6, backgroundColor: Colors.red },
    sosBtnTitle:  { fontSize: Typography.xl, fontWeight: '900', color: Colors.white },
    sosBtnSub:    { fontSize: Typography.sm, color: 'rgba(255,255,255,0.8)' },
    sosCountdown: { fontSize: 36, fontWeight: '900', color: Colors.white },

    reportBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: theme.card, borderRadius: Radius.xl, padding: 18, borderWidth: 1, borderColor: theme.border },
    reportBtnText:{ fontSize: Typography.base, fontWeight: '700', color: theme.text },
  });

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.back}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Safety Hub</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={s.heroBanner}>
          <View style={s.heroTop}>
            <View style={s.heroIconWrap}>
              <Ionicons name="shield-checkmark" size={24} color="#00E5FF" />
            </View>
            <Text style={s.heroTitle}>Your protection{'\n'}on every ride</Text>
          </View>
          <Text style={s.heroSub}>
            Wem protects you as much as your riders. Every ride includes dash cam recording, route monitoring, driver SOS, and incident reporting.
          </Text>
          <View style={s.heroDots}>
            {[Colors.driverCyan, Colors.green, Colors.amber, Colors.brand, '#A78BFA', Colors.driverCyan, Colors.green, Colors.amber].map((color, i) => (
              <View key={i} style={[s.heroDot, { backgroundColor: color, opacity: i < 4 ? 1 : 0.4 }]} />
            ))}
          </View>
        </View>

        {/* Active toggles */}
        <View style={s.toggleCard}>
          <Text style={s.toggleLabel}>ACTIVE PROTECTIONS</Text>
          {[
            { icon: 'videocam',  color: '#0A84FF', title: 'Dash Cam',       sub: 'Recording every ride',    value: dashCam,  onChange: setDashCam },
            { icon: 'navigate',  color: Colors.green, title: 'Route Monitor', sub: 'AI watching your route', value: routeMon, onChange: setRouteMon },
          ].map((item, i, arr) => (
            <View key={item.title} style={i < arr.length - 1 ? s.toggleRow : s.toggleRowLast}>
              <View style={[s.toggleIcon, { backgroundColor: item.color + '18' }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <View style={s.toggleCopy}>
                <Text style={s.toggleTitle}>{item.title}</Text>
                <Text style={s.toggleSub}>{item.sub}</Text>
              </View>
              <Switch
                value={item.value}
                onValueChange={item.onChange}
                trackColor={{ false: theme.border, true: item.color + '66' }}
                thumbColor={item.value ? item.color : theme.muted}
              />
            </View>
          ))}
        </View>

        {/* Driver SOS */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          {!sosActive ? (
            <TouchableOpacity style={s.sosBtn} onPress={() => { setSosActive(true); setSosCount(3); }} activeOpacity={0.9}>
              <Ionicons name="alert-circle" size={32} color={Colors.white} />
              <Text style={s.sosBtnTitle}>Driver SOS</Text>
              <Text style={s.sosBtnSub}>Hold 3 seconds · Silent · GPS shared instantly</Text>
            </TouchableOpacity>
          ) : sosCount > 0 ? (
            <TouchableOpacity style={[s.sosBtn, { backgroundColor: Colors.amber }]} onPress={() => { setSosActive(false); setSosCount(3); }} activeOpacity={0.9}>
              <Text style={s.sosCountdown}>{sosCount}</Text>
              <Text style={s.sosBtnTitle}>Sending SOS in {sosCount}s...</Text>
              <Text style={[s.sosBtnSub, { textDecorationLine: 'underline', fontWeight: '800' }]}>TAP TO CANCEL</Text>
            </TouchableOpacity>
          ) : (
            <View style={[s.sosBtn, { backgroundColor: '#CC0000' }]}>
              <Ionicons name="alert-circle" size={32} color={Colors.white} />
              <Text style={s.sosBtnTitle}>SOS sent — help is coming</Text>
              <Text style={s.sosBtnSub}>Wem safety team alerted · GPS location shared</Text>
            </View>
          )}
        </Animated.View>

        {/* Report incident */}
        <TouchableOpacity style={s.reportBtn} activeOpacity={0.85}>
          <Ionicons name="document-text" size={20} color={Colors.amber} />
          <Text style={s.reportBtnText}>Report an incident from this ride</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.muted} />
        </TouchableOpacity>

        {/* All 8 features */}
        <Text style={s.sectionLabel}>ALL SAFETY FEATURES</Text>
        {FEATURES.map(f => (
          <View key={f.title} style={s.featureCard}>
            <View style={s.featureTop}>
              <View style={[s.featureIcon, { backgroundColor: f.color + '18' }]}>
                <Ionicons name={f.icon as any} size={22} color={f.color} />
              </View>
              <Text style={s.featureTitle}>{f.title}</Text>
              <View style={[s.featureBadge, { backgroundColor: f.badgeColor + '22' }]}>
                <Text style={[s.featureBadgeTxt, { color: f.badgeColor }]}>{f.badge}</Text>
              </View>
            </View>
            <Text style={s.featureDesc}>{f.desc}</Text>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}
