import React from 'react';
import {
  TouchableOpacity, Text, StyleSheet,
  ActivityIndicator, ViewStyle,
} from 'react-native';
import { Colors, Typography, Radius } from '../../constants';

interface WemButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  dark?: boolean;
}

export default function WemButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  dark = false,
}: WemButtonProps) {
  const heights = { sm: 38, md: 48, lg: 58 };
  const fontSizes = { sm: Typography.sm, md: Typography.base, lg: Typography.md };

  const bgMap: Record<string, string> = {
    primary:   disabled ? '#A0BFDD' : Colors.brand,
    secondary: disabled ? '#E8F0F8' : dark ? 'rgba(0,194,255,0.12)' : Colors.riderBg,
    ghost:     'transparent',
    danger:    disabled ? '#F0A0A0' : Colors.red,
  };

  const textMap: Record<string, string> = {
    primary:   '#fff',
    secondary: dark ? Colors.driverCyan : Colors.brand,
    ghost:     dark ? Colors.driverCyan : Colors.brand,
    danger:    '#fff',
  };

  const borderMap: Record<string, string | undefined> = {
    primary:   undefined,
    secondary: dark ? 'rgba(0,194,255,0.3)' : Colors.riderBorder,
    ghost:     'transparent',
    danger:    undefined,
  };

  return (
    <TouchableOpacity
      style={[
        {
          height: heights[size],
          backgroundColor: bgMap[variant],
          borderRadius: Radius.md,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 20,
          borderWidth: borderMap[variant] ? 1.5 : 0,
          borderColor: borderMap[variant] || 'transparent',
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.82}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#fff' : Colors.brand}
          size="small"
        />
      ) : (
        <Text
          style={{
            fontSize: fontSizes[size],
            fontWeight: '700',
            color: textMap[variant],
            letterSpacing: 0.2,
          }}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
