import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Radius } from '../../constants';

export function PassBadge({ small = false }: { small?: boolean }) {
  const fs = small ? 10 : 12;
  return (
    <View style={[styles.passBadge, small && styles.small]}>
      <Ionicons name="star" size={fs - 1} color={Colors.brand} />
      <Text style={[styles.passText, { fontSize: fs }]}>  Wem Pass</Text>
    </View>
  );
}

export function FemaleDriverPrefBadge({ small = false }: { small?: boolean }) {
  const fs = small ? 10 : 12;
  return (
    <View style={[styles.certBadge, small && styles.small]}>
      <Ionicons name="shield-checkmark" size={fs - 1} color={Colors.certText} />
      <Text style={[styles.certText, { fontSize: fs }]}>  Female Driver</Text>
    </View>
  );
}

export function RecordingBadge() {
  return (
    <View style={styles.recordingBadge}>
      <View style={styles.recordingDot} />
      <Text style={styles.recordingText}>Recording</Text>
    </View>
  );
}

export function NoirBadge({ small = false }: { small?: boolean }) {
  const fs = small ? 10 : 12;
  return (
    <View style={[styles.noirBadge, small && styles.small]}>
      <Ionicons name="moon" size={fs - 1} color={Colors.driverCyan} />
      <Text style={[styles.noirText, { fontSize: fs }]}>  Wem Noir</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  passBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.passBg,
    borderColor: Colors.passBorder,
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  passText: {
    color: Colors.passText,
    fontWeight: '700',
  },
  certBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.certBg,
    borderColor: Colors.certText,
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  certText: {
    color: Colors.certText,
    fontWeight: '700',
  },
  noirBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,194,255,0.1)',
    borderColor: Colors.driverCyan,
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  noirText: {
    color: Colors.driverCyan,
    fontWeight: '700',
  },
  recordingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229,57,53,0.1)',
    borderColor: Colors.red,
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 5,
  },
  recordingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.red,
  },
  recordingText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.red,
  },
  small: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
});
