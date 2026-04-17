/**
 * WemMap.web.tsx — Web stub
 * Metro automatically uses this file on web instead of WemMap.tsx
 * No react-native-maps import — that package is native-only
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants';

interface WemMapProps {
  style?: object;
  initialRegion?: object;
  children?: React.ReactNode;
  mapRef?: React.RefObject<any>;
}

export function WemMap({ style }: WemMapProps) {
  return (
    <View style={[styles.map, style]}>
      <View style={styles.inner}>
        <Text style={styles.icon}>🗺</Text>
        <Text style={styles.label}>Live Map</Text>
        <Text style={styles.sub}>GPS simulation active</Text>
        <View style={styles.route}>
          <View style={styles.dotFrom} />
          <View style={styles.line} />
          <View style={styles.dotTo} />
        </View>
        <Text style={styles.caption}>Uptown Dallas → Love Field</Text>
      </View>
    </View>
  );
}

// Web stubs — native components not needed on web
export const Marker    = () => null;
export const Polyline  = () => null;

const styles = StyleSheet.create({
  map:     { backgroundColor: '#1a2744', alignItems: 'center', justifyContent: 'center' },
  inner:   { alignItems: 'center', gap: 8 },
  icon:    { fontSize: 40 },
  label:   { fontSize: 16, fontWeight: '800', color: Colors.white },
  sub:     { fontSize: 12, color: 'rgba(255,255,255,0.5)' },
  route:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  dotFrom: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.driverCyan },
  dotTo:   { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.brand },
  line:    { width: 80, height: 2, backgroundColor: Colors.brand },
  caption: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 },
});
