import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../constants';

export default function Index() {
  const router = useRouter();
  const [selected, setSelected] = useState<'rider' | 'driver' | null>(null);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.driverBg} />
      <View style={s.container}>

        {/* Logo */}
        <View style={s.logoArea}>
          <Image
            source={require('../assets/logo-dark.png')}
            style={s.logo}
            resizeMode="contain"
          />
          <Text style={s.tagline}>Safety-first rideshare for DFW</Text>
        </View>

        {/* Role selector */}
        <View style={s.roleArea}>
          <Text style={s.rolePrompt}>I am a...</Text>

          <TouchableOpacity
            style={[s.roleCard, selected === 'rider' && s.roleCardActive]}
            onPress={() => setSelected('rider')}
            activeOpacity={0.85}
          >
            <View style={[s.roleIcon, selected === 'rider' && s.roleIconActive]}>
              <Ionicons name="person" size={28} color={selected === 'rider' ? Colors.brand : Colors.riderSubtext} />
            </View>
            <View style={s.roleCopy}>
              <Text style={[s.roleTitle, selected === 'rider' && s.roleTitleActive]}>Rider</Text>
              <Text style={s.roleSub}>Book Wem Gos across DFW</Text>
            </View>
            {selected === 'rider' && <Ionicons name="checkmark-circle" size={22} color={Colors.brand} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.roleCard, s.roleCardDark, selected === 'driver' && s.roleCardDarkActive]}
            onPress={() => setSelected('driver')}
            activeOpacity={0.85}
          >
            <View style={[s.roleIcon, s.roleIconDark, selected === 'driver' && s.roleIconDarkActive]}>
              <Ionicons name="navigate" size={28} color={selected === 'driver' ? Colors.driverCyan : Colors.driverSubtext} />
            </View>
            <View style={s.roleCopy}>
              <Text style={[s.roleTitle, s.roleTitleDark, selected === 'driver' && s.roleTitleDarkActive]}>Driver</Text>
              <Text style={[s.roleSub, s.roleSubDark]}>Earn more with fair pay</Text>
            </View>
            {selected === 'driver' && <Ionicons name="checkmark-circle" size={22} color={Colors.driverCyan} />}
          </TouchableOpacity>
        </View>

        {/* Continue */}
        <TouchableOpacity
          style={[s.continueBtn, !selected && s.continueBtnDisabled]}
          onPress={() => {
            if (selected === 'rider') router.push('/rider/home');
            else if (selected === 'driver') router.push('/driver/home');
          }}
          disabled={!selected}
          activeOpacity={0.85}
        >
          <Text style={s.continueBtnText}>
            {selected ? `Continue as ${selected === 'rider' ? 'Rider' : 'Driver'}` : 'Select your role'}
          </Text>
          {selected && <Ionicons name="arrow-forward" size={18} color={Colors.white} />}
        </TouchableOpacity>

        <Text style={s.footer}>WEM Concept & Design LLC  ·  Dallas/Fort Worth  ·  2026</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.driverBg },
  container: { flex: 1, paddingHorizontal: Spacing.xl, paddingTop: Spacing.xxxl, paddingBottom: Spacing.xxl, justifyContent: 'space-between' },
  logoArea: { alignItems: 'center', gap: 8 },
  logo: { width: 260, height: 130 },
  tagline: { fontSize: Typography.base, color: Colors.driverSubtext, textAlign: 'center' },
  roleArea: { gap: Spacing.md },
  rolePrompt: { fontSize: Typography.md, fontWeight: '700', color: Colors.driverText, marginBottom: 4 },
  roleCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.riderCard, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 2, borderColor: Colors.riderBorder },
  roleCardActive: { borderColor: Colors.brand, backgroundColor: Colors.passBg },
  roleCardDark: { backgroundColor: Colors.driverCard, borderColor: Colors.driverBorder },
  roleCardDarkActive: { borderColor: Colors.driverCyan, backgroundColor: 'rgba(0,194,255,0.08)' },
  roleIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: Colors.riderBg, alignItems: 'center', justifyContent: 'center' },
  roleIconActive: { backgroundColor: 'rgba(0,119,204,0.1)' },
  roleIconDark: { backgroundColor: Colors.driverBg },
  roleIconDarkActive: { backgroundColor: 'rgba(0,194,255,0.1)' },
  roleCopy: { flex: 1 },
  roleTitle: { fontSize: Typography.lg, fontWeight: '800', color: Colors.riderText },
  roleTitleActive: { color: Colors.brand },
  roleTitleDark: { color: Colors.driverText },
  roleTitleDarkActive: { color: Colors.driverCyan },
  roleSub: { fontSize: Typography.sm, color: Colors.riderSubtext, marginTop: 2 },
  roleSubDark: { color: Colors.driverSubtext },
  continueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.brand, borderRadius: Radius.lg, paddingVertical: 18 },
  continueBtnDisabled: { backgroundColor: Colors.driverBorder },
  continueBtnText: { fontSize: Typography.md, fontWeight: '800', color: Colors.white },
  footer: { textAlign: 'center', fontSize: 11, color: Colors.driverSubtext },
});
