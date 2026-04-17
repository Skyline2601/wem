import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { RiderThemeProvider, DriverThemeProvider } from '../context/ThemeContext';

// Animated wrapper — reads fadeAnim from whichever ThemeProvider is active
// Each screen handles its own fade via useTheme().fadeAnim
export default function RootLayout() {
  return (
    <RiderThemeProvider>
      <DriverThemeProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="rider/home" />
          <Stack.Screen name="rider/claude" />
          <Stack.Screen name="rider/classic" />
          <Stack.Screen name="rider/active" />
          <Stack.Screen name="rider/profile" />
          <Stack.Screen name="rider/safety" />
          <Stack.Screen name="rider/saferide" />
          <Stack.Screen name="rider/trips" />
          <Stack.Screen name="rider/settings" />
          <Stack.Screen name="rider/night" />
          <Stack.Screen name="driver/home" />
          <Stack.Screen name="driver/request" />
          <Stack.Screen name="driver/active" />
          <Stack.Screen name="driver/support" />
          <Stack.Screen name="driver/safety" />
          <Stack.Screen name="driver/earnings" />
          <Stack.Screen name="driver/profile" />
          <Stack.Screen name="driver/trips" />
          <Stack.Screen name="driver/settings" />
          <Stack.Screen name="guest/[rideId]" />
        </Stack>
      </DriverThemeProvider>
    </RiderThemeProvider>
  );
}
