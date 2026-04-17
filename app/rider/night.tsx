import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function NightModeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.back}>
          <Ionicons name="arrow-back" size={22} color="#E0EAF5" />
        </TouchableOpacity>
        <Text style={[s.title, {color: '#E0EAF5'}]}>Night Mode</Text>
        <View style={{width: 30}} />
      </View>
      <View style={s.body}>
        <Ionicons name="construct" size={48} color="rgba(107,136,168,0.4)" />
        <Text style={s.coming}>Coming soon</Text>
        <Text style={s.sub}>This screen is being built</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#07122B' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(107,136,168,0.15)' },
  back:   { padding: 4 },
  title:  { fontSize: 17, fontWeight: '800' },
  body:   { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  coming: { fontSize: 20, fontWeight: '800', color: 'rgba(107,136,168,0.7)' },
  sub:    { fontSize: 14, color: 'rgba(107,136,168,0.5)' },
});
