/**
 * CarIllustration
 *
 * Fetches a real photo from CarsXE API by make/model/year/color.
 * Falls back to SVG silhouette if API key not set or call fails.
 *
 * API key: set EXPO_PUBLIC_CARSXE_KEY in your .env
 * Signup: https://api.carsxe.com (free sandbox tier available)
 * Docs:   https://api.carsxe.com/docs/v1/images
 *
 * Production upgrade: imagin.studio for color-accurate 3D renders
 */
import React, { useState, useEffect } from 'react';
import {
  Image, View, ActivityIndicator, StyleSheet,
} from 'react-native';
import Svg, { Path, Circle, Rect, Ellipse } from 'react-native-svg';
import { Colors } from '../../constants';

type CarType = 'sedan' | 'suv' | 'luxury';

interface Props {
  make?:   string;
  model?:  string;
  year?:   string | number;
  color?:  string;   // human-readable e.g. "white", "black", "silver"
  colorHex?: string; // hex for SVG fallback e.g. "#F2F2F0"
  type?:   CarType;
  width?:  number;
  height?: number;
}

// ── Color helpers for SVG fallback ────────────────────────────────────────────
function dk(hex: string, t = 0.25): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const f = (c: number) => Math.max(0, Math.floor(c * (1 - t))).toString(16).padStart(2, '0');
  return `#${f((n >> 16) & 0xff)}${f((n >> 8) & 0xff)}${f(n & 0xff)}`;
}
function lt(hex: string, t = 0.4): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const f = (c: number) => Math.min(255, Math.floor(c + (255 - c) * t)).toString(16).padStart(2, '0');
  return `#${f((n >> 16) & 0xff)}${f((n >> 8) & 0xff)}${f(n & 0xff)}`;
}

// ── SVG Fallbacks ─────────────────────────────────────────────────────────────
function SedanSVG({ color = '#DCDCDC', w = 280, h = 130 }: { color?: string; w?: number; h?: number }) {
  const dark = dk(color, 0.22); const hi = lt(color, 0.38);
  const glass = 'rgba(155,205,230,0.82)'; const tire = '#1C1C1C'; const rim = '#888';
  return (
    <Svg width={w} height={h} viewBox="0 0 280 140">
      <Ellipse cx="140" cy="128" rx="105" ry="7" fill="rgba(0,0,0,0.10)" />
      <Path d="M18 88 L18 100 Q18 108 26 108 L254 108 Q262 108 262 100 L262 88 L248 72 Q240 64 228 62 L188 60 L160 30 Q154 20 142 18 L110 18 Q98 18 90 28 L68 60 L44 62 Q30 64 22 74 Z" fill={color} />
      <Path d="M18 95 L18 100 Q18 108 26 108 L254 108 Q262 108 262 100 L262 95 Z" fill={dark} />
      <Path d="M93 60 L158 28 Q152 20 142 18 L110 18 Q100 18 94 26 Z" fill={glass} />
      <Path d="M162 28 L186 60 L194 60 L170 28 Z" fill={glass} opacity="0.85" />
      <Path d="M94 60 L66 62 L68 52 Q72 44 80 42 L90 40 Z" fill={glass} opacity="0.7" />
      <Path d="M188 60 L226 64 L222 52 Q216 44 206 42 L196 40 Z" fill={glass} opacity="0.7" />
      <Path d="M148 62 L148 106" stroke={dark} strokeWidth="1.5" opacity="0.6" />
      <Rect x="118" y="86" width="18" height="4" rx="2" fill={dark} opacity="0.7" />
      <Rect x="162" y="86" width="18" height="4" rx="2" fill={dark} opacity="0.7" />
      <Path d="M22 76 Q20 80 20 86 L40 86 L48 72 Q36 70 28 72 Z" fill="rgba(255,250,200,0.95)" />
      <Path d="M258 76 Q260 80 260 86 L242 86 L234 72 Q246 70 254 72 Z" fill="rgba(220,50,40,0.9)" />
      <Rect x="50" y="100" width="54" height="7" rx="3" fill={dk(color, 0.45)} />
      <Rect x="42" y="100" width="196" height="8" rx="0" fill={dk(color, 0.32)} />
      <Circle cx="68"  cy="108" r="22" fill={tire} /><Circle cx="68"  cy="108" r="15" fill="#2A2A2A" /><Circle cx="68"  cy="108" r="8" fill={rim} /><Circle cx="68"  cy="108" r="4" fill="#CCC" />
      {[0,72,144,216,288].map(a => <Path key={a} d={`M${68+4.5*Math.cos(a*Math.PI/180)} ${108+4.5*Math.sin(a*Math.PI/180)} L${68+14*Math.cos(a*Math.PI/180)} ${108+14*Math.sin(a*Math.PI/180)}`} stroke="#BBB" strokeWidth="2.2" />)}
      <Circle cx="212" cy="108" r="22" fill={tire} /><Circle cx="212" cy="108" r="15" fill="#2A2A2A" /><Circle cx="212" cy="108" r="8" fill={rim} /><Circle cx="212" cy="108" r="4" fill="#CCC" />
      {[0,72,144,216,288].map(a => <Path key={a} d={`M${212+4.5*Math.cos(a*Math.PI/180)} ${108+4.5*Math.sin(a*Math.PI/180)} L${212+14*Math.cos(a*Math.PI/180)} ${108+14*Math.sin(a*Math.PI/180)}`} stroke="#BBB" strokeWidth="2.2" />)}
    </Svg>
  );
}

function SUVSVG({ color = '#DCDCDC', w = 280, h = 148 }: { color?: string; w?: number; h?: number }) {
  const dark = dk(color, 0.22); const glass = 'rgba(150,200,228,0.82)'; const tire = '#1C1C1C'; const rim = '#888';
  return (
    <Svg width={w} height={h} viewBox="0 0 280 148">
      <Ellipse cx="140" cy="136" rx="108" ry="7" fill="rgba(0,0,0,0.11)" />
      <Path d="M16 96 L16 106 Q16 116 26 116 L254 116 Q264 116 264 106 L264 96 L264 52 Q264 46 258 42 L220 36 L188 20 Q182 14 172 14 L100 14 Q88 14 82 22 L52 40 L22 44 Q16 48 16 54 Z" fill={color} />
      <Path d="M16 104 L16 106 Q16 116 26 116 L254 116 Q264 116 264 106 L264 104 Z" fill={dark} />
      <Rect x="88" y="10" width="98" height="5" rx="2" fill={dk(color, 0.42)} />
      <Rect x="82" y="16" width="110" height="24" rx="2" fill={glass} opacity="0.75" />
      <Rect x="20"  y="46" width="56" height="26" rx="3" fill={glass} opacity="0.75" />
      <Rect x="82"  y="46" width="68" height="26" rx="3" fill={glass} opacity="0.75" />
      <Rect x="158" y="46" width="60" height="26" rx="3" fill={glass} opacity="0.75" />
      <Rect x="78"  y="40" width="6" height="40" rx="1" fill={dk(color, 0.4)} />
      <Rect x="152" y="40" width="6" height="40" rx="1" fill={dk(color, 0.4)} />
      <Rect x="220" y="40" width="6" height="40" rx="1" fill={dk(color, 0.4)} />
      <Path d="M16 56 L16 80 L20 80 L46 56 Q30 52 20 54 Z" fill="rgba(255,250,195,0.95)" />
      <Path d="M264 56 L264 80 L260 80 L234 56 Q250 52 260 54 Z" fill="rgba(220,45,35,0.9)" />
      <Rect x="46" y="100" width="76" height="13" rx="4" fill={dk(color, 0.5)} />
      <Rect x="48" y="102" width="72" height="9" rx="3" fill="#111" opacity="0.85" />
      <Rect x="44" y="106" width="192" height="10" rx="2" fill={dk(color, 0.28)} />
      <Circle cx="68"  cy="116" r="24" fill={tire} /><Circle cx="68"  cy="116" r="16" fill="#2A2A2A" /><Circle cx="68"  cy="116" r="9" fill={rim} /><Circle cx="68"  cy="116" r="4.5" fill="#CCC" />
      {[0,72,144,216,288].map(a => <Path key={a} d={`M${68+5*Math.cos(a*Math.PI/180)} ${116+5*Math.sin(a*Math.PI/180)} L${68+15*Math.cos(a*Math.PI/180)} ${116+15*Math.sin(a*Math.PI/180)}`} stroke="#BBB" strokeWidth="2.5" />)}
      <Circle cx="212" cy="116" r="24" fill={tire} /><Circle cx="212" cy="116" r="16" fill="#2A2A2A" /><Circle cx="212" cy="116" r="9" fill={rim} /><Circle cx="212" cy="116" r="4.5" fill="#CCC" />
      {[0,72,144,216,288].map(a => <Path key={a} d={`M${212+5*Math.cos(a*Math.PI/180)} ${116+5*Math.sin(a*Math.PI/180)} L${212+15*Math.cos(a*Math.PI/180)} ${116+15*Math.sin(a*Math.PI/180)}`} stroke="#BBB" strokeWidth="2.5" />)}
    </Svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CarIllustration({
  make = 'toyota', model = 'camry', year = '2022',
  color = 'white', colorHex = '#DCDCDC',
  type = 'sedan', width = 280, height = 130,
}: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [failed, setFailed]     = useState(false);

  const API_KEY = process.env.EXPO_PUBLIC_CARSXE_KEY || '';

  useEffect(() => {
    // No key set yet — use SVG fallback silently
    if (!API_KEY) return;

    setLoading(true);
    setFailed(false);

    const params = new URLSearchParams({
      key:   API_KEY,
      make:  make.toLowerCase(),
      model: model.toLowerCase(),
      year:  String(year),
      color: color.toLowerCase(),
      transparent: 'false',
      format: 'json',
    });

    fetch(`https://api.carsxe.com/images?${params}`)
      .then(r => r.json())
      .then(data => {
        // CarsXE returns { images: [{ link, thumbnail, ... }] }
        const first = data?.images?.[0]?.link || data?.images?.[0]?.thumbnail;
        if (first) {
          setImageUrl(first);
        } else {
          setFailed(true);
        }
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, [make, model, year, color, API_KEY]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={[s.container, { width, height }]}>
        <ActivityIndicator size="large" color={Colors.brand} />
      </View>
    );
  }

  // ── Real photo from CarsXE ─────────────────────────────────────────────────
  if (imageUrl && !failed) {
    // CarsXE images have built-in white padding around the car
    // Scale up and clip to show more car, less white space
    return (
      <View style={{ width, height, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={{ uri: imageUrl }}
          style={{ width: width * 1.25, height: height * 1.25, marginLeft: -28 }}
          resizeMode="contain"
          onError={() => setFailed(true)}
        />
      </View>
    );
  }

  // ── SVG fallback (no key, no result, or error) ─────────────────────────────
  if (type === 'suv') return <SUVSVG color={colorHex} w={width} h={height} />;
  return <SedanSVG color={colorHex} w={width} h={height} />;
}

const s = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  photo:     { borderRadius: 8 },
});
