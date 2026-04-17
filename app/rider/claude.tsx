import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  SafeAreaView, StatusBar, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { Colors, Typography, Spacing, Radius, DEMO_RIDER } from '../../constants';
import { claudeBooking, detectSafetyConcern, detectTier, ChatMessage } from '../../hooks/useClaudeService';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const INITIAL_MESSAGE: Message = {
  id: '0',
  role: 'assistant',
  content: `Hi ${DEMO_RIDER.name}! 👋 I see you're a Wem Pass member — you're always surge-free.\n\nWhere are you headed today? I can book your ride, suggest a tier based on who you're with or where you're going, and answer any questions along the way.`,
  timestamp: new Date(),
};

const QUICK_SUGGESTIONS = [
  'Love Field Airport',
  'Deep Ellum tonight 🎵',
  'Client dinner downtown',
  'Group of 5 going out',
];

export default function ClaudeBookingScreen() {
  const router = useRouter();
  const { theme } = useTheme();
const styles = useMemo(() => StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.bg },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    backgroundColor: theme.card,
    borderBottomWidth: 1, borderBottomColor: theme.border,
    gap: 10,
  },
  backBtn: { padding: 4 },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  claudeHeaderIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  claudeHeaderIconText: { color: Colors.white, fontSize: 16, fontWeight: '900' },
  headerTitle: { fontSize: Typography.base, fontWeight: '800', color: theme.text },
  headerSub: { fontSize: Typography.xs, color: Colors.green },
  sosBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(229,57,53,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Safety banners
  safetyBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(245,158,11,0.12)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(245,158,11,0.3)',
    paddingHorizontal: Spacing.lg, paddingVertical: 8,
  },
  safetyBannerText: { fontSize: Typography.xs, color: Colors.amber, fontWeight: '600' },
  sosBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.red,
    paddingVertical: 10,
  },
  sosBannerText: { fontSize: Typography.sm, color: Colors.white, fontWeight: '800' },
  bookedBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center',
    backgroundColor: 'rgba(0,168,118,0.12)',
    paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,168,118,0.3)',
  },
  bookedText: { fontSize: Typography.sm, color: Colors.green, fontWeight: '700' },

  // Messages
  msgList: { padding: Spacing.md, gap: Spacing.md },
  msgRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  msgRowUser: { justifyContent: 'flex-end' },
  claudeAvatar: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: Colors.brand,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  claudeAvatarText: { color: Colors.white, fontSize: 11, fontWeight: '900' },
  bubble: {
    maxWidth: '80%',
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  bubbleAssistant: {
    backgroundColor: theme.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1, borderColor: theme.border,
  },
  bubbleUser: {
    backgroundColor: Colors.brand,
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: Typography.base,
    color: theme.text,
    lineHeight: 22,
  },
  bubbleTextUser: { color: Colors.white },

  // Typing indicator
  typingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: Spacing.md, paddingBottom: 8,
  },
  typingBubble: {
    backgroundColor: theme.card,
    borderRadius: Radius.lg, borderBottomLeftRadius: 4,
    borderWidth: 1, borderColor: theme.border,
    paddingHorizontal: 16, paddingVertical: 12,
    width: 60,
  },

  // Suggestions
  suggestions: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
    paddingHorizontal: Spacing.md, paddingBottom: 8,
  },
  suggestion: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1.5, borderColor: theme.border,
    backgroundColor: theme.card,
  },
  suggestionText: {
    fontSize: Typography.sm, fontWeight: '600', color: Colors.brand,
  },

  // Input
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: theme.card,
    borderTopWidth: 1, borderTopColor: theme.border,
  },
  input: {
    flex: 1,
    backgroundColor: theme.bg,
    borderRadius: Radius.lg,
    borderWidth: 1.5, borderColor: theme.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.base,
    color: theme.text,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.brand,
    alignItems: 'center', justifyContent: 'center',
    
  },
  sendBtnDisabled: {
    backgroundColor: theme.border,
  },
}), [theme]);
  const rider = DEMO_RIDER;

  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [safetyConcernLevel, setSafetyConcernLevel] = useState<'none' | 'mild' | 'serious'>('none');

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  async function sendMessage(text?: string) {
    // DEBUG — remove after confirming API works
    console.log('ANTHROPIC KEY:', process.env.EXPO_PUBLIC_ANTHROPIC_KEY ? 
      'FOUND (' + process.env.EXPO_PUBLIC_ANTHROPIC_KEY.slice(0,10) + '...)' : 
      'NOT FOUND - check .env file');
    const content = (text || input).trim();
    if (!content || loading) return;

    setInput('');

    // Check for safety concern in message
    const concern = detectSafetyConcern(content);
    if (concern !== 'none') setSafetyConcernLevel(concern);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const history: ChatMessage[] = updatedMessages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await claudeBooking(history, rider);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMsg]);

      // Check if Claude confirmed a booking
      if (
        reply.toLowerCase().includes('booked') ||
        reply.toLowerCase().includes('on the way') ||
        reply.toLowerCase().includes("on her way") ||
        reply.toLowerCase().includes("on his way")
      ) {
        setBooked(true);
        setTimeout(() => router.push('/rider/active'), 2000);
      }

    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having a moment — let me try again. You can also use the classic booking option from the home screen.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  function renderMessage({ item }: { item: Message }) {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.msgRow, isUser && styles.msgRowUser]}>
        {!isUser && (
          <View style={styles.claudeAvatar}>
            <Text style={styles.claudeAvatarText}>✦</Text>
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
          <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.card} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.claudeHeaderIcon}>
            <Text style={styles.claudeHeaderIconText}>✦</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Claude · Wem AI</Text>
            <Text style={styles.headerSub}>
              {loading ? 'Thinking...' : '● Online · Pass member'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push('/rider/safety')} style={styles.sosBtn}>
          <Ionicons name="shield-checkmark" size={18} color={Colors.red} />
        </TouchableOpacity>
      </View>

      {/* ── Safety banner (mild concern) ── */}
      {safetyConcernLevel === 'mild' && (
        <View style={styles.safetyBanner}>
          <Ionicons name="eye" size={14} color={Colors.amber} />
          <Text style={styles.safetyBannerText}>
            Your ride is being monitored. Claude is here with you.
          </Text>
        </View>
      )}

      {/* ── Safety banner (serious concern) ── */}
      {safetyConcernLevel === 'serious' && (
        <TouchableOpacity
          style={styles.sosBanner}
          onPress={() => router.push('/rider/safety')}
        >
          <Ionicons name="alert-circle" size={16} color={Colors.white} />
          <Text style={styles.sosBannerText}>Tap to activate SOS</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.white} />
        </TouchableOpacity>
      )}

      {/* ── Booked confirmation ── */}
      {booked && (
        <View style={styles.bookedBanner}>
          <Ionicons name="checkmark-circle" size={16} color={Colors.green} />
          <Text style={styles.bookedText}>Booked! Taking you to your ride...</Text>
        </View>
      )}

      {/* ── Messages ── */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.msgList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* ── Typing indicator ── */}
      {loading && (
        <View style={styles.typingRow}>
          <View style={styles.claudeAvatar}>
            <Text style={styles.claudeAvatarText}>✦</Text>
          </View>
          <View style={styles.typingBubble}>
            <ActivityIndicator size="small" color={theme.muted} />
          </View>
        </View>
      )}

      {/* ── Quick suggestions (show until first user message) ── */}
      {messages.length === 1 && !loading && (
        <View style={styles.suggestions}>
          {QUICK_SUGGESTIONS.map(s => (
            <TouchableOpacity
              key={s}
              style={styles.suggestion}
              onPress={() => sendMessage(s)}
            >
              <Text style={styles.suggestionText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── Input ── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Message Wem AI..."
            placeholderTextColor={theme.muted}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage()}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            <Ionicons name="send" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

