/**
 * ThemeContext
 * Supports animated 1.5s transitions between light and dark mode.
 * Both rider and driver apps share the same transition system.
 */
import React, {
  createContext, useContext, useState, useRef, useEffect, useCallback,
} from 'react';
import { Animated } from 'react-native';
import { Colors } from '../constants';

export type AppSide   = 'rider' | 'driver';
export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode:        ThemeMode;
  side:        AppSide;
  bg:          string;
  card:        string;
  border:      string;
  text:        string;
  subtext:     string;
  muted:       string;
  accent:      string;
  accentGlow:  string;
  navBg:       string;
  navBorder:   string;
  navActive:   string;
  navInactive: string;
  // Transition opacity — used by root layout to fade between themes
  transitioning: boolean;
}

function buildTheme(mode: ThemeMode, side: AppSide): Theme {
  const isDark = mode === 'dark';

  if (side === 'driver') {
    return {
      mode, side, transitioning: false,
      bg:          isDark ? Colors.driverBg      : '#F4F9FF',
      card:        isDark ? Colors.driverCard    : '#FFFFFF',
      border:      isDark ? Colors.driverBorder  : '#D0E8F8',
      text:        isDark ? Colors.driverText    : Colors.riderText,
      subtext:     isDark ? Colors.driverSubtext : Colors.riderSubtext,
      muted:       isDark ? Colors.driverMuted   : Colors.riderMuted,
      accent:      isDark ? Colors.driverCyan    : Colors.brand,
      accentGlow:  isDark ? 'rgba(0,194,255,0.12)' : Colors.brandGlow,
      navBg:       isDark ? Colors.driverCard    : '#FFFFFF',
      navBorder:   isDark ? Colors.driverBorder  : '#D0E8F8',
      navActive:   isDark ? Colors.driverCyan    : Colors.brand,
      navInactive: isDark ? Colors.driverSubtext : Colors.riderMuted,
    };
  }

  return {
    mode, side, transitioning: false,
    bg:          isDark ? Colors.driverBg      : Colors.riderBg,
    card:        isDark ? Colors.driverCard    : Colors.riderCard,
    border:      isDark ? Colors.driverBorder  : Colors.riderBorder,
    text:        isDark ? Colors.driverText    : Colors.riderText,
    subtext:     isDark ? Colors.driverSubtext : Colors.riderSubtext,
    muted:       isDark ? Colors.driverMuted   : Colors.riderMuted,
    accent:      Colors.brand,
    accentGlow:  Colors.brandGlow,
    navBg:       isDark ? Colors.driverCard    : Colors.riderCard,
    navBorder:   isDark ? Colors.driverBorder  : Colors.riderBorder,
    navActive:   Colors.brand,
    navInactive: isDark ? Colors.driverSubtext : Colors.riderMuted,
  };
}

interface ThemeContextValue {
  theme:       Theme;
  fadeAnim:    Animated.Value;
  toggleMode:  () => void;
  setMode:     (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme:      buildTheme('light', 'rider'),
  fadeAnim:   new Animated.Value(1),
  toggleMode: () => {},
  setMode:    () => {},
});

function ThemeProvider({
  children, side, defaultMode,
}: {
  children: React.ReactNode;
  side: AppSide;
  defaultMode: ThemeMode;
}) {
  const [mode, setModeState]           = useState<ThemeMode>(defaultMode);
  const [theme, setTheme]              = useState<Theme>(buildTheme(defaultMode, side));
  const fadeAnim                        = useRef(new Animated.Value(1)).current;
  const isTransitioning                 = useRef(false);

  const animateThemeChange = useCallback((newMode: ThemeMode) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    // Fade out over 0.5s
    Animated.timing(fadeAnim, {
      toValue:  0.15,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      // Swap theme at minimum opacity
      setModeState(newMode);
      setTheme(buildTheme(newMode, side));

      // Fade back in over 1s
      Animated.timing(fadeAnim, {
        toValue:  1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        isTransitioning.current = false;
      });
    });
  }, [fadeAnim, side]);

  const toggleMode = useCallback(() => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    animateThemeChange(newMode);
  }, [mode, animateThemeChange]);

  const setMode = useCallback((newMode: ThemeMode) => {
    if (newMode !== mode) animateThemeChange(newMode);
  }, [mode, animateThemeChange]);

  return (
    <ThemeContext.Provider value={{ theme, fadeAnim, toggleMode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function RiderThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeProvider side="rider" defaultMode="light">{children}</ThemeProvider>;
}

export function DriverThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeProvider side="driver" defaultMode="light">{children}</ThemeProvider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
