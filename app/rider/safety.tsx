/**
 * Rider Safety Hub
 * Wem's most important differentiator — shown prominently in demo
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
    desc:  'Every ride is recorded from the moment your driver accepts. Footage is securely stored for 30 days and accessible if anything goes wrong.',
    badge: 'ACTIVE',
    badgeColor: Colors.green,
  },
  {
    icon:  'navigate',
    color: Colors.green,
    title: 'Live Route Monitoring',
    desc:  'Our AI watches your route in real time. If your driver deviates from the expected path, you get an immediate alert.',
    badge: 'ACTIVE',
    badgeColor: Colors.green,
  },
  {
    icon:  'alert-circle',
    color: Colors.red,
    title: 'One-Tap SOS',
    desc:  'Press and hold for 3 seconds. Silently alerts Wem\'s safety team, shares your GPS location, and contacts your emergency contact.',
    badge: 'READY',
    badgeColor: Colors.amber,
  },
  {
    icon:  'chatbubbles',
    color: '#A78BFA',
    title: 'Claude AI Check-Ins',
    desc:  'Wem\'s AI checks in with you during every ride. If you don\'t respond, we follow up. If something seems wrong, we act.',
    badge: 'ACTIVE',
    badgeColor: Colors.green,
  },
  {
    icon:  'people',
    color: Colors.brand,
    title: 'Trusted Contacts',
    desc:  'Share your live ride with up to 5 people. They see your driver\'s info, car details, and your exact location in real time.',
    badge: 'SET UP',
    badgeColor: Colors.brand,
  },
  {
    icon:  'car',
    color: Colors.amber,
    title: 'Car Verification',
    desc:  'Before you get in, verify the plate, color, make, and driver photo match exactly. Never get in the wrong car.',
    badge: 'REQUIRED',
    badgeColor: Colors.amber,
  },
  {
    icon:  'phone-portrait',
    color: '#00E5FF',
    title: 'Guest Safety Link',
    desc:  'Booking for someone else? They get a secure link — no app needed — with live tracking, SOS, and Claude check-ins. Expires when the ride ends.',
    badge: 'UNIQUE TO WEM',
    badgeColor: '#00E5FF',
  },
  {
    icon:  'female',
    color: '#FF6B9D',
    title: 'Female Driver Option',
    desc:  'Female riders can request a female driver. All participating drivers complete additional background checks and safety training.',
    badge: 'OPTIONAL',
    badgeColor: '#FF6B9D',
  },
];

export default function RiderSafetyScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [sosActive, setSos] = useState(false);
  const [routeMonitor, setRoute] = useState(true);
  const [checkIns, setCheckIns] = useState(true);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.08, duration: 800, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1.0,  duration: 800, useNativeDriver: true }),
    ])).start();
  }, []);

  const s = StyleSheet.create({
    safe:         { flex: 1, backgroundColor: theme.bg },
    header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: theme.card, borderBottomWidth: 1, borderBottomColor: theme.border },
    back:         { padding: 4 },
    headerTitle:  { fontSize: Typography.md, fontWeight: '900', color: theme.text },

    content:      { padding: 14, gap: 14, paddingBottom: 40 },

    // Hero banner
    heroBanner:   { borderRadius: Radius.xl, overflow: 'hidden', padding: 20, gap: 6,
                    backgroundColor: '#07122B', borderWidth: 1, borderColor: '#00E5FF22' },
    heroTop:      { flexDirection: 'row', alignItems: 'center', gap: 10 },
    heroIconWrap: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(0,229,255,0.15)', alignItems: 'center', justifyContent: 'center' },
    heroTitle:    { flex: 1, fontSize: Typography.lg, fontWeight: '900', color: Colors.white },
    heroSub:      { fontSize: Typography.sm, color: 'rgba(255,255,255,0.55)', lineHeight: 20 },
    heroDots:     { flexDirection: 'row', gap: 6, marginTop: 8 },
    heroDot:      { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.green },

    // Quick toggles
    toggleCard:   { backgroundColor: theme.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: theme.border, padding: 16, gap: 0 },
    toggleLabel:  { fontSize: 11, fontWeight: '700', color: theme.muted, letterSpacing: 0.8, marginBottom: 12 },
    toggleRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.border },
    toggleRowLast:{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
    toggleIcon:   { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    toggleCopy:   { flex: 1 },
    toggleTitle:  { fontSize: Typography.base, fontWeight: '700', color: theme.text },
    toggleSub:    { fontSize: Typography.xs, color: theme.subtext, marginTop: 2 },

    // Feature cards
    sectionLabel: { fontSize: 11, fontWeight: '700', color: theme.muted, letterSpacing: 0.8 },
    featureCard:  { backgroundColor: theme.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: theme.border, padding: 16, gap: 10 },
    featureTop:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
    featureIcon:  { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    featureTitle: { flex: 1, fontSize: Typography.base, fontWeight: '800', color: theme.text },
    featureBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
    featureBadgeTxt: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
    featureDesc:  { fontSize: Typography.sm, color: theme.subtext, lineHeight: 20 },

    // SOS button
    sosBtn:       { borderRadius: Radius.xl, overflow: 'hidden', alignItems: 'center', padding: 20, gap: 6, backgroundColor: Colors.red, shadowColor: '#0077CC', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 8 },
    sosBtnTitle:  { fontSize: Typography.xl, fontWeight: '900', color: Colors.white },
    sosBtnSub:    { fontSize: Typography.sm, color: 'rgba(255,255,255,0.8)' },
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
              <Ionicons name="shield-checkmark" size={26} color="#00E5FF" />
            </View>
            <Text style={s.heroTitle}>Your safety is our{'\n'}top priority</Text>
          </View>
          <Text style={s.heroSub}>
            Wem was built from the ground up with safety at its core — not added as an afterthought.
            Every ride includes 8 active layers of protection.
          </Text>
          <View style={s.heroDots}>
            {[0,1,2,3,4,5,6,7].map(i => (
              <View key={i} style={[s.heroDot, { backgroundColor: i < 3 ? '#00E5FF' : Colors.green, opacity: i < 3 ? 1 : 0.5 }]} />
            ))}
          </View>
        </View>

        {/* Quick toggles */}
        <View style={s.toggleCard}>
          <Text style={s.toggleLabel}>ACTIVE PROTECTIONS</Text>
          {[
            { icon: 'videocam', color: '#0A84FF', title: 'Dash Cam', sub: 'Recording this ride', value: true, onChange: () => {} },
            { icon: 'navigate', color: Colors.green, title: 'Route Monitor', sub: 'AI watching your path', value: routeMonitor, onChange: setRoute },
            { icon: 'chatbubbles', color: '#A78BFA', title: 'Claude Check-Ins', sub: 'AI will check in mid-ride', value: checkIns, onChange: setCheckIns },
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

        {/* SOS */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity style={s.sosBtn} activeOpacity={0.9}>
            <Ionicons name="alert-circle" size={32} color={Colors.white} />
            <Text style={s.sosBtnTitle}>Emergency SOS</Text>
            <Text style={s.sosBtnSub}>Hold for 3 seconds · Silent · GPS shared instantly</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* All 8 features */}
        <Text style={s.sectionLabel}>ALL 8 SAFETY LAYERS</Text>
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
