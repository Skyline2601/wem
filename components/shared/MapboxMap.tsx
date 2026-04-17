/**
 * WemDriveMap — SVG-based animated ride map
 * No WebView, no network requests, works everywhere
 * Clean premium look with animated car icon, glowing route, grid overlay
 */
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Platform } from 'react-native';
import Svg, {
  Defs, LinearGradient, Stop, RadialGradient,
  Path, Circle, Rect, G, Line, Text as SvgText,
  Polygon, Filter, FeGaussianBlur,
} from 'react-native-svg';

interface MapboxMapProps {
  style?: object;
  progress?: number;
  mapboxKey?: string;
}

// Map viewport dimensions
const W = 390;
const H = 320;

// Route points normalized to SVG space
// Real DFW coords projected to viewport
const RAW = [
  [32.8022, -96.8006],
  [32.8031, -96.8080],
  [32.8055, -96.8120],
  [32.8090, -96.8180],
  [32.8120, -96.8250],
  [32.8145, -96.8310],
  [32.8160, -96.8390],
  [32.8180, -96.8420],
  [32.8195, -96.8455],
  [32.8472, -96.8517],
];

const LAT_MIN = 32.8022, LAT_MAX = 32.8472;
const LNG_MIN = -96.8517, LNG_MAX = -96.8006;
const PAD = 40;

function project([lat, lng]: number[]): [number, number] {
  const x = PAD + ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * (W - PAD * 2);
  const y = (H - PAD) - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * (H - PAD * 2);
  return [x, y];
}

const POINTS = RAW.map(project);

function routePath(): string {
  return POINTS.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
}

function interpolate(progress: number): [number, number] {
  const max = POINTS.length - 1;
  const fi = Math.min(progress * max, max - 0.001);
  const i = Math.floor(fi);
  const f = fi - i;
  const a = POINTS[i], b = POINTS[i + 1] || POINTS[i];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
}

function carAngle(progress: number): number {
  const max = POINTS.length - 1;
  const fi = Math.min(progress * max, max - 0.001);
  const i = Math.floor(fi);
  const a = POINTS[i], b = POINTS[Math.min(i + 1, max)];
  return Math.atan2(b[1] - a[1], b[0] - a[0]) * (180 / Math.PI);
}

// Street grid lines (background texture)
const STREETS_H = [60, 110, 160, 200, 240, 280];
const STREETS_V = [55, 110, 170, 230, 290, 340];

export default function MapboxMap({ style, progress = 0 }: MapboxMapProps) {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const glowAnim  = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: false }),
      Animated.timing(pulseAnim, { toValue: 0, duration: 900, useNativeDriver: false }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 1400, useNativeDriver: false }),
      Animated.timing(glowAnim, { toValue: 0.4, duration: 1400, useNativeDriver: false }),
    ])).start();
  }, []);

  const [carX, carY] = interpolate(progress);
  const angle = carAngle(progress);
  const start = POINTS[0];
  const end   = POINTS[POINTS.length - 1];
  const done  = progress;

  return (
    <View style={[styles.container, style]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          {/* Sky gradient */}
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#07122B" />
            <Stop offset="1" stopColor="#0d1f3c" />
          </LinearGradient>
          {/* Route gradient */}
          <LinearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#0A84FF" />
            <Stop offset="1" stopColor="#00E5FF" />
          </LinearGradient>
          {/* Progress gradient */}
          <LinearGradient id="doneGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#30D158" />
            <Stop offset="1" stopColor="#00E5FF" />
          </LinearGradient>
          {/* Car glow */}
          <RadialGradient id="carGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#0A84FF" stopOpacity="0.6" />
            <Stop offset="1" stopColor="#0A84FF" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Background */}
        <Rect x="0" y="0" width={W} height={H} fill="url(#sky)" />

        {/* Street grid */}
        {STREETS_H.map((y, i) => (
          <Line key={`h${i}`} x1="0" y1={y} x2={W} y2={y}
            stroke="#1a3a5c" strokeWidth={i % 2 === 0 ? 1.5 : 0.7} strokeOpacity="0.6" />
        ))}
        {STREETS_V.map((x, i) => (
          <Line key={`v${i}`} x1={x} y1="0" x2={x} y2={H}
            stroke="#1a3a5c" strokeWidth={i % 2 === 0 ? 1.5 : 0.7} strokeOpacity="0.6" />
        ))}

        {/* Route glow */}
        <Path d={routePath()} fill="none"
          stroke="#0A84FF" strokeWidth={16} strokeOpacity={0.15}
          strokeLinecap="round" strokeLinejoin="round" />

        {/* Route remaining */}
        <Path d={routePath()} fill="none"
          stroke="#0A84FF" strokeWidth={3} strokeOpacity={0.35}
          strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6,4" />

        {/* Route completed */}
        <Path
          d={POINTS.slice(0, Math.ceil(progress * POINTS.length) + 1)
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')}
          fill="none"
          stroke="url(#doneGrad)" strokeWidth={3.5}
          strokeLinecap="round" strokeLinejoin="round" />

        {/* Origin dot */}
        <Circle cx={start[0]} cy={start[1]} r={7} fill="#0A84FF" opacity={0.5} />
        <Circle cx={start[0]} cy={start[1]} r={4} fill="#0A84FF" />
        <Circle cx={start[0]} cy={start[1]} r={2} fill="white" />

        {/* Destination pin */}
        <G transform={`translate(${end[0]}, ${end[1] - 18})`}>
          {/* Pin body */}
          <Circle cx={0} cy={0} r={10} fill="#30D158" />
          <Circle cx={0} cy={0} r={6} fill="white" opacity={0.9} />
          {/* Pin tail */}
          <Polygon points="0,10 -4,20 4,20" fill="#30D158" />
          <Circle cx={0} cy={22} r={2.5} fill="#30D158" opacity={0.4} />
        </G>

        {/* Destination label */}
        <Rect x={end[0] - 36} y={end[1] - 42} width={72} height={16}
          rx={8} fill="#30D158" opacity={0.15} />
        <SvgText x={end[0]} y={end[1] - 31} textAnchor="middle"
          fontSize={9} fontWeight="bold" fill="#30D158">
          Love Field
        </SvgText>

        {/* Car glow halo */}
        <Circle cx={carX} cy={carY} r={28} fill="url(#carGlow)" />

        {/* Car icon — Uber-style */}
        <G transform={`translate(${carX}, ${carY}) rotate(${angle})`}>
          {/* Car body */}
          <Rect x={-13} y={-8} width={26} height={16} rx={5} fill="#0A84FF" />
          {/* Roof */}
          <Rect x={-8} y={-14} width={16} height={9} rx={3} fill="#0A84FF" />
          {/* Windshield */}
          <Rect x={-6} y={-13} width={12} height={7} rx={2} fill="#E8F4FF" opacity={0.9} />
          {/* Headlights */}
          <Circle cx={13} cy={-4} r={2.5} fill="#FFE566" opacity={0.95} />
          <Circle cx={13} cy={4} r={2.5} fill="#FFE566" opacity={0.95} />
          {/* Tail lights */}
          <Circle cx={-13} cy={-4} r={2} fill="#FF453A" opacity={0.8} />
          <Circle cx={-13} cy={4} r={2} fill="#FF453A" opacity={0.8} />
          {/* Wheels */}
          <Circle cx={-8} cy={8} r={3.5} fill="#001133" stroke="#60A0FF" strokeWidth={1.5} />
          <Circle cx={8} cy={8} r={3.5} fill="#001133" stroke="#60A0FF" strokeWidth={1.5} />
          <Circle cx={-8} cy={-8} r={3.5} fill="#001133" stroke="#60A0FF" strokeWidth={1.5} />
          <Circle cx={8} cy={-8} r={3.5} fill="#001133" stroke="#60A0FF" strokeWidth={1.5} />
          {/* Direction arrow */}
          <Polygon points="16,0 11,-3 11,3" fill="white" opacity={0.6} />
        </G>

        {/* ETA badge */}
        <Rect x={W - 70} y={8} width={62} height={22} rx={11} fill="#0A84FF" opacity={0.9} />
        <SvgText x={W - 39} y={23} textAnchor="middle"
          fontSize={10} fontWeight="bold" fill="white">
          {Math.max(1, Math.round((1 - progress) * 14))} min
        </SvgText>

        {/* Progress bar at bottom */}
        <Rect x={0} y={H - 4} width={W} height={4} fill="#0A84FF" opacity={0.15} />
        <Rect x={0} y={H - 4} width={W * progress} height={4} fill="url(#doneGrad)" opacity={0.9} />

      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden', backgroundColor: '#07122B' },
});
