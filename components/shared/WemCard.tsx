import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Shadow } from '../../constants';
import { useTheme } from '../../context/ThemeContext';

interface WemCardProps {
  children:  React.ReactNode;
  style?:    ViewStyle;
  dark?:     boolean;
  glow?:     boolean;
  padding?:  number;
}

export default function WemCard({ children, style, glow = false, padding = 16 }: WemCardProps) {
  const { theme } = useTheme();
  return (
    <View style={[
      styles.card,
      {
        backgroundColor: theme.card,
        borderColor:     theme.border,
        padding,
      },
      glow && { borderColor: Colors.brand + '44', shadowColor: Colors.brand, shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
      style,
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
});
