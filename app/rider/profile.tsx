import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { Colors, Typography, Radius } from '../../constants';

const PREFERENCES = [
  { icon: 'people',       label: 'Driver gender',       value: 'Female Driver Option' },
  { icon: 'musical-notes', label: 'Music',              value: 'No preference'   },
  { icon: 'thermometer',  label: 'Temperature',         value: 'Cool'            },
  { icon: 'chatbubble',   label: 'Conversation',        value: 'Quiet ride'      },
];

const SAVED_PLACES = [
  { icon: 'home',      label: 'Home',   address: '2847 Maple Ave, Dallas' },
  { icon: 'briefcase', label: 'Work',   address: '350 N St Paul St, Dallas' },
  { icon: 'star',      label: "Jessica's", address: '811 Ross Ave, Dallas' },
];

export default function RiderProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: theme.bg },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: theme.card, borderBottomWidth: 1, borderBottomColor: theme.border },
  headerTitle:    { fontSize: Typography.md, fontWeight: '800', color: theme.text },
  content:        { padding: 14, gap: 12 },
  sectionLabel:   { fontSize: 11, fontWeight: '700', color: theme.muted, letterSpacing: 0.8, marginTop: 4 },
  sectionNote:    { fontSize: Typography.xs, color: theme.subtext, marginTop: -8 },

  heroCard:       { backgroundColor: theme.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: theme.border, padding: 20, alignItems: 'center', gap: 8 },
  avatarWrap:     { position: 'relative' },
  avatar:         { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.brandGlow, borderWidth: 2, borderColor: Colors.brand + '33', alignItems: 'center', justifyContent: 'center' },
  avatarText:     { fontSize: 26, fontWeight: '900', color: Colors.brand },
  avatarEdit:     { position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.brand, alignItems: 'center', justifyContent: 'center' },
  name:           { fontSize: Typography.xl, fontWeight: '900', color: theme.text },
  memberSince:    { fontSize: Typography.xs, color: theme.subtext },

  passBanner:     { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.brandGlow, borderRadius: Radius.lg, paddingHorizontal: 14, paddingVertical: 10, width: '100%' },
  passBannerText: { flex: 1, fontSize: Typography.sm, fontWeight: '700', color: Colors.brand },
  passManage:     { fontSize: Typography.sm, fontWeight: '700', color: Colors.brand, textDecorationLine: 'underline' },

  statsRow:       { flexDirection: 'row', width: '100%' },
  statItem:       { flex: 1, alignItems: 'center' },
  statVal:        { fontSize: Typography.lg, fontWeight: '900', color: theme.text },
  statLabel:      { fontSize: Typography.xs, color: theme.subtext, marginTop: 2 },
  statDiv:        { width: 1, backgroundColor: theme.border },

  prefsCard:      { backgroundColor: theme.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' },
  prefRow:        { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  prefRowBorder:  { borderBottomWidth: 1, borderBottomColor: theme.border },
  prefIcon:       { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.brandGlow, alignItems: 'center', justifyContent: 'center' },
  prefLabel:      { flex: 1, fontSize: Typography.base, color: theme.text, fontWeight: '600' },
  prefValue:      { fontSize: Typography.sm, color: theme.subtext, marginRight: 4 },

  placesCard:     { backgroundColor: theme.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' },
  placeRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  placeRowBorder: { borderBottomWidth: 1, borderBottomColor: theme.border },
  placeIcon:      { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.brandGlow, alignItems: 'center', justifyContent: 'center' },
  placeCopy:      { flex: 1 },
  placeLabel:     { fontSize: Typography.base, fontWeight: '700', color: theme.text },
  placeAddr:      { fontSize: Typography.xs, color: theme.subtext, marginTop: 1 },
  addPlaceBtn:    { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderTopWidth: 1, borderTopColor: theme.border },
  addPlaceText:   { fontSize: Typography.base, fontWeight: '700', color: Colors.brand },

  emergencyCard:  { backgroundColor: theme.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' },
  emergencyRow:   { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  emergencyIcon:  { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.brandGlow, alignItems: 'center', justifyContent: 'center' },
  emergencyCopy:  { flex: 1 },
  emergencyName:  { fontSize: Typography.base, fontWeight: '700', color: theme.text },
  emergencyPhone: { fontSize: Typography.xs, color: theme.subtext, marginTop: 1 },
  emergencyEdit:  { fontSize: Typography.sm, fontWeight: '700', color: Colors.brand },
  emergencyNote:  { flexDirection: 'row', alignItems: 'flex-start', gap: 6, padding: 12, backgroundColor: theme.bg, borderTopWidth: 1, borderTopColor: theme.border },
  emergencyNoteText: { flex: 1, fontSize: Typography.xs, color: theme.muted, lineHeight: 16 },

  payCard:        { backgroundColor: theme.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: theme.border, padding: 14 },
  payRow:         { flexDirection: 'row', alignItems: 'center', gap: 12 },
  payLabel:       { flex: 1, fontSize: Typography.base, fontWeight: '600', color: theme.text },
  defaultBadge:   { backgroundColor: Colors.brandGlow, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  defaultText:    { fontSize: 10, fontWeight: '700', color: Colors.brand },

  privacyCard:    { backgroundColor: theme.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: theme.border, padding: 14 },
  privacyRow:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
  privacyCopy:    { flex: 1 },
  privacyLabel:   { fontSize: Typography.base, fontWeight: '700', color: theme.text },
  privacySub:     { fontSize: Typography.xs, color: theme.subtext, marginTop: 2 },
})
  const [passActive] = useState(true);
  const [shareAnalytics, setShareAnalytics] = useState(true);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Profile</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <View style={s.heroCard}>
          <View style={s.avatarWrap}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>JT</Text>
            </View>
            <View style={s.avatarEdit}>
              <Ionicons name="camera" size={14} color={Colors.white} />
            </View>
          </View>
          <Text style={s.name}>Jessica T.</Text>
          <Text style={s.memberSince}>Wem member since March 2026</Text>

          {/* Pass badge */}
          {passActive && (
            <View style={s.passBanner}>
              <Ionicons name="star" size={16} color={Colors.brand} />
              <Text style={s.passBannerText}>Wem Pass Active · $14.99/mo</Text>
              <TouchableOpacity>
                <Text style={s.passManage}>Manage</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Quick stats */}
          <View style={s.statsRow}>
            <View style={s.statItem}>
              <Text style={s.statVal}>24</Text>
              <Text style={s.statLabel}>Trips</Text>
            </View>
            <View style={s.statDiv} />
            <View style={s.statItem}>
              <Text style={s.statVal}>4.92</Text>
              <Text style={s.statLabel}>Rating</Text>
            </View>
            <View style={s.statDiv} />
            <View style={s.statItem}>
              <Text style={s.statVal}>$18.40</Text>
              <Text style={s.statLabel}>Saved w/ Pass</Text>
            </View>
          </View>
        </View>

        {/* Ride preferences */}
        <Text style={s.sectionLabel}>RIDE PREFERENCES</Text>
        <Text style={s.sectionNote}>Claude remembers these for every booking</Text>
        <View style={s.prefsCard}>
          {PREFERENCES.map((pref, i) => (
            <TouchableOpacity
              key={pref.label}
              style={[s.prefRow, i < PREFERENCES.length - 1 && s.prefRowBorder]}
              activeOpacity={0.7}>
              <View style={s.prefIcon}>
                <Ionicons name={pref.icon as any} size={18} color={Colors.brand} />
              </View>
              <Text style={s.prefLabel}>{pref.label}</Text>
              <Text style={s.prefValue}>{pref.value}</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.muted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Saved places */}
        <Text style={s.sectionLabel}>SAVED PLACES</Text>
        <View style={s.placesCard}>
          {SAVED_PLACES.map((place, i) => (
            <TouchableOpacity
              key={place.label}
              style={[s.placeRow, i < SAVED_PLACES.length - 1 && s.placeRowBorder]}
              activeOpacity={0.7}>
              <View style={s.placeIcon}>
                <Ionicons name={place.icon as any} size={18} color={Colors.brand} />
              </View>
              <View style={s.placeCopy}>
                <Text style={s.placeLabel}>{place.label}</Text>
                <Text style={s.placeAddr}>{place.address}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.muted} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={s.addPlaceBtn} activeOpacity={0.7}>
            <Ionicons name="add-circle" size={18} color={Colors.brand} />
            <Text style={s.addPlaceText}>Add a place</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency contact */}
        <Text style={s.sectionLabel}>EMERGENCY CONTACT</Text>
        <View style={s.emergencyCard}>
          <View style={s.emergencyRow}>
            <View style={s.emergencyIcon}>
              <Ionicons name="people" size={18} color={Colors.brand} />
            </View>
            <View style={s.emergencyCopy}>
              <Text style={s.emergencyName}>Sarah T.</Text>
              <Text style={s.emergencyPhone}>(214) 555-0192 · Sister</Text>
            </View>
            <TouchableOpacity>
              <Text style={s.emergencyEdit}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={s.emergencyNote}>
            <Ionicons name="information-circle" size={13} color={theme.muted} />
            <Text style={s.emergencyNoteText}>
              Notified automatically when Wem Go is active or SOS is triggered
            </Text>
          </View>
        </View>

        {/* Payment */}
        <Text style={s.sectionLabel}>PAYMENT</Text>
        <View style={s.payCard}>
          <View style={s.payRow}>
            <Ionicons name="card" size={18} color={Colors.brand} />
            <Text style={s.payLabel}>Visa ending in 4821</Text>
            <View style={s.defaultBadge}><Text style={s.defaultText}>Default</Text></View>
          </View>
        </View>

        {/* Privacy */}
        <Text style={s.sectionLabel}>PRIVACY</Text>
        <View style={s.privacyCard}>
          <View style={s.privacyRow}>
            <View style={s.privacyCopy}>
              <Text style={s.privacyLabel}>Share ride analytics</Text>
              <Text style={s.privacySub}>Help improve safety features — no personal data shared</Text>
            </View>
            <Switch
              value={shareAnalytics}
              onValueChange={setShareAnalytics}
              trackColor={{ false: theme.border, true: Colors.brand }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

