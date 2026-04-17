import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, StatusBar, Switch, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../../constants';
import { useTheme } from '../../context/ThemeContext';
import WemCard from '../../components/shared/WemCard';

export default function DriverSettingsScreen() {
  const router = useRouter();
  const { theme, toggleMode, fadeAnim } = useTheme();
  const isDark = theme.mode === 'dark';

  const row = (
    icon: string,
    label: string,
    sub: string,
    right: React.ReactNode,
    onPress?: () => void,
  ) => (
    <TouchableOpacity
      style={[s.row, { borderBottomColor: theme.border }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[s.rowIcon, { backgroundColor: theme.accentGlow }]}>
        <Ionicons name={icon as any} size={18} color={theme.accent} />
      </View>
      <View style={s.rowCopy}>
        <Text style={[s.rowLabel, { color: theme.text }]}>{label}</Text>
        <Text style={[s.rowSub, { color: theme.subtext }]}>{sub}</Text>
      </View>
      {right}
    </TouchableOpacity>
  );

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <SafeAreaView style={[s.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[s.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: theme.text }]}>Settings</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={s.content}>

        {/* Appearance */}
        <Text style={[s.sectionLabel, { color: theme.muted }]}>APPEARANCE</Text>
        <WemCard style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {row(
            isDark ? 'sunny' : 'moon',
            'Dark Mode',
            isDark ? 'Currently on — tap to switch to light' : 'Currently off — tap to switch to dark',
            <Switch
              value={isDark}
              onValueChange={toggleMode}
              trackColor={{ false: theme.border, true: theme.accent }}
              thumbColor={Colors.white}
              ios_backgroundColor={theme.border}
            />,
            toggleMode,
          )}
        </WemCard>

        {/* Safety */}
        <Text style={[s.sectionLabel, { color: theme.muted }]}>SAFETY</Text>
        <WemCard style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {row('shield-checkmark', 'SOS Setup', 'Voice phrase and Bluetooth button', <Ionicons name="chevron-forward" size={16} color={theme.muted} />, () => router.push('/driver/safety'))}
          {row('mic', 'Voice SOS Phrase', 'Change your activation phrase', <Ionicons name="chevron-forward" size={16} color={theme.muted} />)}
          {row('bluetooth', 'Bluetooth Button', 'Paired · Armed', <Text style={[s.paired, { color: Colors.green }]}>●  Paired</Text>)}
        </WemCard>

        {/* Earnings */}
        <Text style={[s.sectionLabel, { color: theme.muted }]}>EARNINGS</Text>
        <WemCard style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {row('card', 'Payout Method', 'Instant payout to debit card', <Ionicons name="chevron-forward" size={16} color={theme.muted} />)}
          {row('time', 'Payout Schedule', 'Daily automatic payouts', <Ionicons name="chevron-forward" size={16} color={theme.muted} />)}
          {row('receipt', 'Tax Documents', '2025 1099 available', <Ionicons name="chevron-forward" size={16} color={theme.muted} />)}
        </WemCard>

        {/* Vehicle */}
        <Text style={[s.sectionLabel, { color: theme.muted }]}>VEHICLE</Text>
        <WemCard style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {row('car', 'Vehicle Info', '2022 Toyota Camry · WEM-2024', <Ionicons name="chevron-forward" size={16} color={theme.muted} />)}
          {row('camera', 'Dash Cam Status', 'Nexar One · Connected', <Text style={[s.paired, { color: Colors.green }]}>●  Active</Text>)}
        </WemCard>

        {/* Account */}
        <Text style={[s.sectionLabel, { color: theme.muted }]}>ACCOUNT</Text>
        <WemCard style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {row('person', 'Edit Profile', 'Name, photo, vehicle details', <Ionicons name="chevron-forward" size={16} color={theme.muted} />, () => router.push('/driver/profile'))}
          {row('document-text', 'Background Check', 'Verified · Mar 2026', <Text style={[s.paired, { color: Colors.green }]}>✓  Clear</Text>)}
          {row('information-circle', 'App Version', 'WemApp 1.0.0', <Text style={[s.version, { color: theme.muted }]}>1.0.0</Text>)}
        </WemCard>

        {/* Sign out */}
        <TouchableOpacity style={[s.signOut, { borderColor: Colors.red }]}>
          <Text style={s.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: Typography.lg, fontWeight: '800' },
  content: { padding: Spacing.md, gap: Spacing.xs },
  sectionLabel: {
    fontSize: Typography.xs, fontWeight: '700',
    letterSpacing: 0.8, marginTop: Spacing.lg, marginBottom: Spacing.sm,
  },
  card: { padding: 0, overflow: 'hidden' },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  rowIcon: {
    width: 36, height: 36, borderRadius: Radius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  rowCopy: { flex: 1 },
  rowLabel: { fontSize: Typography.base, fontWeight: '700' },
  rowSub: { fontSize: Typography.xs, marginTop: 2 },
  version: { fontSize: Typography.sm },
  paired: { fontSize: Typography.xs, fontWeight: '700' },
  signOut: {
    marginTop: Spacing.xl,
    borderWidth: 1.5, borderRadius: Radius.lg,
    paddingVertical: 16, alignItems: 'center',
  },
  signOutText: { fontSize: Typography.base, fontWeight: '700', color: Colors.red },
});
