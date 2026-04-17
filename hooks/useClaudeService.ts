// ── Wem Claude API Service ─────────────────────────────────────────────────
// All Claude calls go through this service
// API key lives in .env: EXPO_PUBLIC_ANTHROPIC_KEY=sk-ant-...
// Without a key, all functions return graceful fallback messages

import { DEMO_RIDER, DEMO_DRIVER } from '../constants';

const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 1024;

export type MessageRole = 'user' | 'assistant';
export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface RideContext {
  destination?: string;
  tier?: string;
  estimatedMiles?: number;
  estimatedMinutes?: number;
  isPassMember?: boolean;
  driverName?: string;
  driverRating?: number;
  isFemaleDriverPref?: boolean;
  routeStatus?: string;
  etaMinutes?: number;
  progress?: number;
}

// ── Safe API caller ────────────────────────────────────────────────────────

async function callClaude(system: string, messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return "Claude AI is not connected yet. Add your Anthropic API key to the .env file to enable live responses.";
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.warn('Claude API error:', JSON.stringify(err));
      console.warn('Claude status:', response.status);
      return "I'm having trouble connecting right now. Please try again in a moment.";
    }

    const data = await response.json();
    return data.content?.[0]?.text || "I didn't get a response. Please try again.";

  } catch (error) {
    console.warn('Claude fetch error:', error);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
}

// ── USE CASE 1: Conversational Booking ────────────────────────────────────

export async function claudeBooking(
  messages: ChatMessage[],
  rider = DEMO_RIDER,
): Promise<string> {
  const system = `You are Wem AI, the booking assistant for the Wem rideshare app in Dallas/Fort Worth.
You help riders book rides conversationally — no forms, no dropdowns, just natural conversation.

RIDER CONTEXT:
- Name: ${rider.name}
- Wem Pass member: ${rider.hasPass ? 'YES ($14.99/mo) — surge waived (1.5x cap removed), gas adj waived, pickup fees waived, enhanced Claude AI' : 'No — standard rate with 1.5x surge cap, $0.15/mi gas adj, pickup fees apply'}
- Saved places: Home (${rider.savedPlaces.home.address}), Office (${rider.savedPlaces.office.address})
- Preferences: ${rider.preferences.driverGender}, ${rider.preferences.music} music

VEHICLE TIERS:
- Wem Standard (1.0x): sedan, 1–3 passengers
- Wem XL (1.4x): SUV, up to 6 passengers — suggest for 4+ people or lots of luggage
- Wem Noir (2.2x): luxury sedan — suggest for client dinner, formal event, or "something nicer"

DEMO FARES (Love Field Airport, 7.2 miles):
- Standard Pass rate: $11.73 | Standard: $12.36 (saves $0.63 + gas adj + no surge)
- XL Pass rate: $16.42 | XL: $17.26
- Noir Pass rate: $25.81 | Noir: $27.14

BOOKING FLOW:
1. Understand destination
2. Suggest appropriate tier if needed
3. Confirm destination, tier, fare, driver (Maria S., 4.98 stars, Female Driver Preference, 3 min away)
4. Book when rider confirms — say "booked" or "on the way" when confirmed

Keep responses concise — this is a mobile app.`;

  return callClaude(system, messages);
}

// ── USE CASE 2: Mid-Ride Companion ────────────────────────────────────────

export async function claudeMidRide(
  messages: ChatMessage[],
  rideContext: RideContext,
  rider = DEMO_RIDER,
): Promise<string> {
  const progress = rideContext.progress || 0;
  const phase = progress < 0.3 ? 'just started' : progress < 0.7 ? 'en route' : 'almost there';

  const system = `You are Wem AI, the mid-ride companion for an active Wem ride.

ACTIVE RIDE:
- Rider: ${rider.name}
- Destination: ${rideContext.destination || 'Love Field Airport'}
- Driver: ${rideContext.driverName || 'Maria S.'}, Female Driver Preference
- Phase: ${phase} — ${rideContext.etaMinutes || 4} minutes remaining

SAFETY FIRST:
- Any discomfort/unease → acknowledge, offer to end ride, share location
- "scared/help/danger" → surface SOS immediately, stay calm and present
- NEVER dismiss a concern

Keep responses warm, direct, and concise.`;

  return callClaude(system, messages);
}

// ── USE CASE 3: Driver Payout Support ─────────────────────────────────────

export async function claudeDriverSupport(
  messages: ChatMessage[],
  driver = DEMO_DRIVER,
): Promise<string> {
  const system = `You are Wem's driver support agent with full account access.

DRIVER: ${driver.name}
Weekly earnings: $847.32 | Last payout: $312.40 (March 28) | Pending: $89.12
Gas adjustments this week: $42.30 | Pickup compensation: $8.90

WEM PAY STRUCTURE (CONFIRMED):
- Base fare: 75% to driver Year 1, rising to 78% Year 2+
- Gas adjustment: $0.15/mile → 100% to driver, Wem takes NONE
- Pickup compensation: paid when driver travels >1 mile baseline → 100% to driver
- Surge cap: 1.5x max for non-Pass riders, Pass riders always pay base rate
- Commission: 25% Year 1 (only on base fare, never on gas adj or pickup comp)

Be direct, honest, transparent about pay. Resolve issues conversationally. Never use ticket numbers.
If driver asks why pay seems low, walk through the breakdown line by line.`;

  return callClaude(system, messages);
}

// ── USE CASE 4: Route Deviation Check ────────────────────────────────────

export function claudeRouteCheck(
  deviationMeters: number,
): { alert: boolean; severity: 'none' | 'low' | 'high'; message: string } {
  if (deviationMeters < 150) return { alert: false, severity: 'none', message: '' };
  if (deviationMeters < 400) return {
    alert: true, severity: 'low',
    message: "Your route looks a little different than expected. Everything okay?",
  };
  return {
    alert: true, severity: 'high',
    message: "Your driver has taken an unexpected route. Are you okay? Your ride is being monitored.",
  };
}

// ── Utilities ─────────────────────────────────────────────────────────────

export function detectSafetyConcern(message: string): 'none' | 'mild' | 'serious' {
  const lower = message.toLowerCase();
  const serious = ['scared', 'help', 'danger', 'threatening', 'attack', 'hurt', 'emergency', 'stop', 'let me out'];
  const mild = ['uncomfortable', 'weird', 'creepy', 'strange', 'nervous', 'unsafe', 'off', 'bad feeling'];
  if (serious.some(w => lower.includes(w))) return 'serious';
  if (mild.some(w => lower.includes(w))) return 'mild';
  return 'none';
}

export function detectTier(message: string): string | null {
  const lower = message.toLowerCase();
  if (/\b(4|5|6|four|five|six)\s*(of us|people|passengers|friends)\b/.test(lower)) return 'xl';
  if (/group|family|luggage|bags|suv/.test(lower)) return 'xl';
  if (/client|dinner|formal|nicer|fancy|business|interview|event/.test(lower)) return 'noir';
  return null;
}
