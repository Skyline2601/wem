import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, StatusBar, Switch, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../../constants';
import { useTheme } from '../../context/ThemeContext';
import { PixelRatio } from 'react-native';
import WemCard from '../../components/shared/WemCard';

export default function RiderSettingsScreen() {
  const router = useRouter();
  const { theme, toggleMode, fadeAnim } = useTheme();
  const isDark = theme.mode === 'dark';
  const systemScale = PixelRatio.getFontScale(); // reads phone accessibility font size
  const [textSize, setTextSize] = React.useState<'normal' | 'large' | 'xlarge'>(
    systemScale >= 1.3 ? 'xlarge' : systemScale >= 1.15 ? 'large' : 'normal'
  );

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
    <Animated.View style={[{ flex: 1, opacity: fadeAnim }]}>
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
              trackColor={{ false: theme.border, true: Colors.brand }}
              thumbColor={Colors.white}
            />,
            toggleMode,
          )}
        </WemCard>

        {/* Safety */}
        <Text style={[s.sectionLabel, { color: theme.muted }]}>SAFETY</Text>
        <WemCard style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {row('shield-checkmark', 'SOS Settings', 'Configure emergency contacts', <Ionicons name="chevron-forward" size={16} color={theme.muted} />, () => router.push('/rider/safety'))}
          {row('location', 'Location Sharing', 'Share live location during rides', <Switch value={true} trackColor={{ false: theme.border, true: Colors.brand }} thumbColor={Colors.white} />)}
          {row('notifications', 'Ride Alerts', 'Driver arriving, route changes', <Switch value={true} trackColor={{ false: theme.border, true: Colors.brand }} thumbColor={Colors.white} />)}
        </WemCard>

        {/* Safety */}
        <Text style={[s.sectionLabel, { color: theme.muted }]}>SAFETY</Text>
        <WemCard style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {row(
            'moon',
            'Auto Wem Go',
            "Opens Wem Go automatically when you're at a venue after 9pm",
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: theme.border, true: Colors.brand }}
              thumbColor={Colors.white}
            />
          )}
          {row(
            'shield-checkmark',
            'Female Driver Option by default',
            'Always prefer female drivers',
            <Switch
              value={false}
              onValueChange={() => {}}
              trackColor={{ false: theme.border, true: Colors.brand }}
              thumbColor={Colors.white}
            />,
          )}
        </WemCard>

        {/* Text Size */}
        <Text style={[s.sectionLabel, { color: theme.muted }]}>TEXT SIZE</Text>
        <WemCard style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={{ padding: 14, gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[s.rowIcon, { backgroundColor: theme.accentGlow }]}>
                <Ionicons name="text" size={18} color={theme.accent} />
              </View>
              <Text style={[{ flex: 1, fontSize: 15, fontWeight: '700' }, { color: theme.text }]}>Text Size</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['normal', 'large', 'xlarge'] as const).map(size => (
                <TouchableOpacity
                  key={size}
                  style={{
                    flex: 1, paddingVertical: 10, alignItems: 'center',
                    borderRadius: 10, borderWidth: 1.5,
                    borderColor: textSize === size ? theme.accent : theme.border,
                    backgroundColor: textSize === size ? theme.accentGlow : 'transparent',
                  }}
                  onPress={() => setTextSize(size)}>
                  <Text style={{
                    fontWeight: '700',
                    color: textSize === size ? theme.accent : theme.subtext,
                    fontSize: size === 'normal' ? 13 : size === 'large' ? 15 : 18,
                  }}>
                    {size === 'normal' ? 'Normal' : size === 'large' ? 'Large' : 'Extra Large'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ fontSize: 12, color: theme.muted, lineHeight: 16 }}>
              Wem Go always uses extra large text. This setting applies to the rest of the app.
              {systemScale > 1.1 ? " Your phone is set to larger text — we've matched it." : ""}
            </Text>
          </View>
        </WemCard>

        {/* Account */}
        <Text style={[s.sectionLabel, { color: theme.muted }]}>ACCOUNT</Text>
        <WemCard style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {row('person', 'Edit Profile', 'Name, photo, preferences', <Ionicons name="chevron-forward" size={16} color={theme.muted} />, () => router.push('/rider/profile'))}
          {row('card', 'Payment Methods', 'Cards and Wem Pass', <Ionicons name="chevron-forward" size={16} color={theme.muted} />)}
          {row('star', 'Wem Pass', 'Manage your subscription', <Ionicons name="chevron-forward" size={16} color={theme.muted} />)}
        </WemCard>

        {/* About */}
        <Text style={[s.sectionLabel, { color: theme.muted }]}>ABOUT</Text>
        <WemCard style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {row('information-circle', 'App Version', 'WemApp 1.0.0', <Text style={[s.version, { color: theme.muted }]}>1.0.0</Text>)}
          {row('document-text', 'Privacy Policy', 'How we handle your data', <Ionicons name="chevron-forward" size={16} color={theme.muted} />)}
          {row('document', 'Terms of Service', 'Usage terms', <Ionicons name="chevron-forward" size={16} color={theme.muted} />)}
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
  signOut: {
    marginTop: Spacing.xl,
    borderWidth: 1.5, borderRadius: Radius.lg,
    paddingVertical: 16, alignItems: 'center',
  },
  signOutText: { fontSize: Typography.base, fontWeight: '700', color: Colors.red },
});
