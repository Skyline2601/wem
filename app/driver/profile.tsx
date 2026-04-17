import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CarIllustration from '../../components/shared/CarIllustration';
import { useTheme } from '../../context/ThemeContext';
import { Colors, Typography, Radius, DEMO_DRIVER } from '../../constants';

export default function DriverProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: theme.bg },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  headerTitle:    { fontSize: Typography.md, fontWeight: '800', color: theme.text },
  content:        { padding: 14, gap: 12 },
  sectionLabel:   { fontSize: 11, fontWeight: '700', color: theme.muted, letterSpacing: 0.8, marginTop: 4 },

  profileHero:    { alignItems: 'center', gap: 8, paddingVertical: 16 },
  avatarLg:       { width: 84, height: 84, borderRadius: 42, backgroundColor: Colors.driverCyan + '22', borderWidth: 2, borderColor: Colors.driverCyan + '44', alignItems: 'center', justifyContent: 'center' },
  avatarText:     { fontSize: 28, fontWeight: '900', color: Colors.driverCyan },
  driverName:     { fontSize: Typography.xl, fontWeight: '900', color: theme.text },
  driverSub:      { fontSize: Typography.sm, color: theme.subtext },
  ratingRow:      { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingVal:      { fontSize: Typography.base, fontWeight: '700', color: Colors.amber, marginLeft: 4 },

  statsGrid:      { flexDirection: 'row', gap: 8 },
  statItem:       { flex: 1, backgroundColor: theme.card, borderRadius: Radius.lg, borderWidth: 1, borderColor: theme.border, padding: 14, alignItems: 'center' },
  statVal:        { fontSize: Typography.lg, fontWeight: '900', color: theme.text },
  statLabel:      { fontSize: 10, color: theme.subtext, marginTop: 2, textAlign: 'center' },

  carPhotoWrap:   { alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)', marginBottom: 8 },
  vehicleCard:    { backgroundColor: theme.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: theme.border, padding: 16, gap: 12 },
  vehicleRow:     { flexDirection: 'row', alignItems: 'center', gap: 10 },
  colorDot:       { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: theme.border },
  vehicleVal:     { flex: 1, fontSize: Typography.base, color: theme.text, fontWeight: '600' },
  verifiedBadge:  { backgroundColor: Colors.green + '22', borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  verifiedText:   { fontSize: 10, fontWeight: '700', color: Colors.green },

  certRow:        { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: theme.card, borderRadius: Radius.lg, borderWidth: 1, borderColor: theme.border, padding: 14 },
  certRowDim:     { opacity: 0.5 },
  certIcon:       { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  certLabel:      { flex: 1, fontSize: Typography.base, fontWeight: '700', color: theme.text },
  certUnearned:   { fontSize: Typography.xs, color: theme.muted, fontWeight: '600' },

  noirCard:       { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#A78BFA' + '12', borderRadius: Radius.xl, borderWidth: 1, borderColor: '#A78BFA' + '33', padding: 16 },
  noirCopy:       { flex: 1 },
  noirTitle:      { fontSize: Typography.base, fontWeight: '800', color: theme.text },
  noirSub:        { fontSize: Typography.xs, color: theme.subtext, marginTop: 2, lineHeight: 16 },

  safetyCard:     { backgroundColor: theme.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' },
  safetyRow:      { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: theme.border },
  safetyCopy:     { flex: 1 },
  safetyLabel:    { fontSize: Typography.xs, color: theme.muted, fontWeight: '600' },
  safetyVal:      { fontSize: Typography.base, color: theme.text, fontWeight: '600', marginTop: 2 },
  safetyEdit:     { fontSize: Typography.sm, fontWeight: '700', color: Colors.driverCyan },
})
  const driver = DEMO_DRIVER;
  const [noirCertified] = useState(false);

  const stats = [
    { label: 'Total trips',  value: driver.trips.toLocaleString() },
    { label: 'Rating',       value: `${driver.rating} ★` },
    { label: 'Acceptance',   value: '94%' },
    { label: 'Completion',   value: '98%' },
  ];

  const certs = [
    { icon: 'shield-checkmark', label: 'Standard Certified',    color: Colors.green,    earned: true  },
    { icon: 'people',           label: 'Female Driver Option',        color: Colors.driverCyan, earned: true  },
    { icon: 'car',              label: 'XL Certified',           color: Colors.amber,    earned: true  },
    { icon: 'diamond',          label: 'Noir Certified',         color: '#A78BFA',       earned: noirCertified },
  ];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Driver Profile</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Avatar + name */}
        <View style={s.profileHero}>
          <View style={s.avatarLg}>
            <Text style={s.avatarText}>MS</Text>
          </View>
          <Text style={s.driverName}>{driver.name.replace('.', '')}</Text>
          <Text style={s.driverSub}>Wem Driver · Dallas, TX</Text>
          <View style={s.ratingRow}>
            {[1,2,3,4,5].map(n => (
              <Ionicons key={n} name="star" size={16} color={n <= Math.round(driver.rating) ? Colors.amber : theme.border} />
            ))}
            <Text style={s.ratingVal}>{driver.rating}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={s.statsGrid}>
          {stats.map(stat => (
            <View key={stat.label} style={s.statItem}>
              <Text style={s.statVal}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Vehicle */}
        <Text style={s.sectionLabel}>VEHICLE</Text>
        <View style={s.vehicleCard}>
          {/* Car photo from CarsXE */}
          <View style={s.carPhotoWrap}>
            <CarIllustration
              make={driver.make || 'toyota'}
              model={driver.model || 'camry'}
              year={driver.vehicleYear || '2022'}
              color={driver.colorName || 'white'}
              colorHex={driver.colorHex || '#F2F2F0'}
              type={driver.carType || 'sedan'}
              width={340}
              height={160}
            />
          </View>
          <View style={s.vehicleRow}>
            <Ionicons name="car" size={18} color={Colors.driverCyan} />
            <Text style={s.vehicleVal}>{driver.vehicle}</Text>
          </View>
          <View style={s.vehicleRow}>
            <View style={[s.colorDot, { backgroundColor: driver.colorHex || '#F2F2F0' }]} />
            <Text style={s.vehicleVal}>{driver.color}</Text>
          </View>
          <View style={s.vehicleRow}>
            <Ionicons name="card" size={18} color={Colors.driverCyan} />
            <Text style={[s.vehicleVal, { fontWeight: '900', color: Colors.driverCyan, letterSpacing: 1 }]}>{driver.plate}</Text>
          </View>
          <View style={s.vehicleRow}>
            <Ionicons name="camera" size={18} color={Colors.green} />
            <Text style={s.vehicleVal}>Nexar dash cam installed</Text>
            <View style={s.verifiedBadge}>
              <Text style={s.verifiedText}>Verified</Text>
            </View>
          </View>
        </View>

        {/* Certifications */}
        <Text style={s.sectionLabel}>CERTIFICATIONS</Text>
        {certs.map(cert => (
          <View key={cert.label} style={[s.certRow, !cert.earned && s.certRowDim]}>
            <View style={[s.certIcon, { backgroundColor: cert.earned ? cert.color + '18' : theme.border }]}>
              <Ionicons name={cert.icon as any} size={20} color={cert.earned ? cert.color : theme.muted} />
            </View>
            <Text style={[s.certLabel, !cert.earned && { color: theme.muted }]}>{cert.label}</Text>
            {cert.earned
              ? <Ionicons name="checkmark-circle" size={20} color={cert.color} />
              : <Text style={s.certUnearned}>Not yet</Text>
            }
          </View>
        ))}

        {/* Noir upsell */}
        {!noirCertified && (
          <View style={s.noirCard}>
            <Ionicons name="diamond" size={22} color="#A78BFA" />
            <View style={s.noirCopy}>
              <Text style={s.noirTitle}>Get Noir Certified</Text>
              <Text style={s.noirSub}>Earn 2.2× per ride. Requires 2019+ vehicle, dark exterior, and premium interior inspection.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#A78BFA" />
          </View>
        )}

        {/* SOS phrase */}
        <Text style={s.sectionLabel}>SAFETY</Text>
        <View style={s.safetyCard}>
          <View style={s.safetyRow}>
            <Ionicons name="alert-circle" size={18} color={Colors.red} />
            <View style={s.safetyCopy}>
              <Text style={s.safetyLabel}>SOS phrase</Text>
              <Text style={s.safetyVal}>"Is the weather nice today?"</Text>
            </View>
            <TouchableOpacity>
              <Text style={s.safetyEdit}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={s.safetyRow}>
            <Ionicons name="shield-checkmark" size={18} color={Colors.green} />
            <View style={s.safetyCopy}>
              <Text style={s.safetyLabel}>Emergency contact</Text>
              <Text style={s.safetyVal}>James E. · (214) 555-0199</Text>
            </View>
            <TouchableOpacity>
              <Text style={s.safetyEdit}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

