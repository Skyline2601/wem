import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  SafeAreaView, StatusBar, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { Colors, Typography, Spacing, Radius, DEMO_DRIVER } from '../../constants';
import { claudeDriverSupport, ChatMessage } from '../../hooks/useClaudeService';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const INITIAL: Message = {
  id: '0',
  role: 'assistant',
  content: `Hi ${DEMO_DRIVER.name.split(' ')[0]} 👋 I have your full account in front of me — last payout, pending balance, all your recent rides.\n\nWhat do you need help with?`,
};

const QUICK = [
  "Why is my payout lower than expected?",
  "Where's my gas adjustment for today?",
  "What's my pending balance?",
  "How is my pay calculated?",
];

export default function DriverSupportScreen() {
  const router = useRouter();
  const { theme } = useTheme();
const styles = useMemo(() => StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    backgroundColor: theme.card,
    borderBottomWidth: 1, borderBottomColor: theme.border,
  },
  backBtn: { padding: 4 },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  claudeIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  claudeIconText: { color: Colors.white, fontSize: 16, fontWeight: '900' },
  headerTitle: { fontSize: Typography.base, fontWeight: '800', color: theme.text },
  headerSub: { fontSize: Typography.xs, color: Colors.green },

  msgList: { padding: Spacing.md, gap: Spacing.md },
  msgRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  msgRowUser: { justifyContent: 'flex-end' },
  avatar: {
    width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.brand,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  avatarText: { color: Colors.white, fontSize: 11, fontWeight: '900' },
  bubble: { maxWidth: '80%', borderRadius: Radius.lg, padding: Spacing.md },
  bubbleAssist: {
    backgroundColor: theme.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1, borderColor: theme.border,
  },
  bubbleUser: { backgroundColor: Colors.brand, borderBottomRightRadius: 4, borderBottomLeftRadius: Radius.lg },
  bubbleText: { fontSize: Typography.base, color: theme.text, lineHeight: 22 },
  bubbleTextUser: { color: Colors.white },

  typingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: Spacing.md, paddingBottom: 8,
  },
  typingBubble: {
    backgroundColor: theme.card,
    borderRadius: Radius.lg, borderBottomLeftRadius: 4,
    borderWidth: 1, borderColor: theme.border,
    paddingHorizontal: 16, paddingVertical: 12, width: 60,
  },

  quickList: { paddingHorizontal: Spacing.md, paddingBottom: 8, gap: 6 },
  quickItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: theme.card,
    borderRadius: Radius.md, padding: Spacing.md,
    borderWidth: 1, borderColor: theme.border,
  },
  quickText: { fontSize: Typography.sm, color: theme.text, flex: 1 },

  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    padding: Spacing.md,
    backgroundColor: theme.card,
    borderTopWidth: 1, borderTopColor: theme.border,
  },
  input: {
    flex: 1, backgroundColor: theme.bg,
    borderRadius: Radius.lg, borderWidth: 1.5, borderColor: theme.border,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    fontSize: Typography.base, color: theme.text, maxHeight: 100,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.driverCyan,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnOff: { backgroundColor: theme.border },
}), [theme]);
  const [messages, setMessages] = useState<Message[]>([INITIAL]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  async function send(text?: string) {
    const content = (text || input).trim();
    if (!content || loading) return;
    setInput('');

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const history: ChatMessage[] = updated.map(m => ({ role: m.role, content: m.content }));
      const reply = await claudeDriverSupport(history, DEMO_DRIVER);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
      }]);
    } finally {
      setLoading(false);
    }
  }

  function renderMsg({ item }: { item: Message }) {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.msgRow, isUser && styles.msgRowUser]}>
        {!isUser && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>✦</Text>
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssist]}>
          <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={theme.bg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.claudeIcon}>
            <Text style={styles.claudeIconText}>✦</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Claude · Payout Support</Text>
            <Text style={styles.headerSub}>{loading ? 'Looking up your account...' : '● Full account access'}</Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        renderItem={renderMsg}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.msgList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />

      {loading && (
        <View style={styles.typingRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>✦</Text>
          </View>
          <View style={styles.typingBubble}>
            <ActivityIndicator size="small" color={theme.subtext} />
          </View>
        </View>
      )}

      {/* Quick options */}
      {messages.length === 1 && !loading && (
        <View style={styles.quickList}>
          {QUICK.map(q => (
            <TouchableOpacity key={q} style={styles.quickItem} onPress={() => send(q)}>
              <Text style={styles.quickText}>{q}</Text>
              <Ionicons name="chevron-forward" size={14} color={theme.subtext} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask about your pay..."
            placeholderTextColor={theme.subtext}
            multiline
            maxLength={400}
            onSubmitEditing={() => send()}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnOff]}
            onPress={() => send()}
            disabled={!input.trim() || loading}
          >
            <Ionicons name="send" size={18} color={theme.bg} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

