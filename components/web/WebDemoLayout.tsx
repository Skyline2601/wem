import React, { useState } from 'react';
import { Colors } from '../constants';

// ── This file only loads on web (Expo for Web / Vercel)
// On mobile, the normal single-screen app runs instead.
// On wide screens (laptop): two phone frames side by side
// On narrow screens (phone/tablet portrait): single frame

const PHONE_W = 390;
const PHONE_H = 844;
const FRAME_RADIUS = 44;
const NOTCH_W = 120;

type ActiveSide = 'rider' | 'driver';

export default function WebDemoLayout() {
  const [activeTab, setActiveTab] = useState<'both' | 'rider' | 'driver'>('both');

  return (
    <div style={styles.root}>

      {/* ── Top bar ── */}
      <div style={styles.topBar}>
        <div style={styles.logoRow}>
          <div style={styles.logoMark}>✦</div>
          <span style={styles.logoText}>wem</span>
          <span style={styles.logoBadge}>Demo · DFW</span>
        </div>

        {/* Tab selector */}
        <div style={styles.tabs}>
          {(['both', 'rider', 'driver'] as const).map(tab => (
            <button
              key={tab}
              style={{
                ...styles.tab,
                ...(activeTab === tab ? styles.tabActive : {}),
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'both' ? 'Both Apps' : tab === 'rider' ? '📱 Rider' : '🚗 Driver'}
            </button>
          ))}
        </div>

        <div style={styles.topBarRight}>
          <span style={styles.liveChip}>● Live Claude AI</span>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={styles.main}>

        {/* Label row */}
        <div style={{
          ...styles.labelRow,
          justifyContent: activeTab === 'both' ? 'space-around' : 'center',
        }}>
          {(activeTab === 'both' || activeTab === 'rider') && (
            <div style={styles.phoneLabel}>
              <span style={styles.phoneLabelText}>Rider App</span>
              <span style={styles.phoneLabelSub}>Jessica T. · Wem Pass</span>
            </div>
          )}
          {(activeTab === 'both' || activeTab === 'driver') && (
            <div style={styles.phoneLabel}>
              <span style={styles.phoneLabelText}>Driver App</span>
              <span style={styles.phoneLabelSub}>Maria S. · Female Driver Option</span>
            </div>
          )}
        </div>

        {/* Phone frames */}
        <div style={styles.phonesRow}>

          {/* Rider phone */}
          {(activeTab === 'both' || activeTab === 'rider') && (
            <div style={styles.phoneOuter}>
              <div style={styles.phoneFrame}>
                {/* Notch */}
                <div style={styles.notch} />
                {/* Screen */}
                <iframe
                  src="/?side=rider"
                  style={styles.screen}
                  title="Wem Rider App"
                />
                {/* Home indicator */}
                <div style={styles.homeIndicator} />
              </div>
              {/* Side buttons */}
              <div style={styles.sideButtonLeft} />
              <div style={{ ...styles.sideButtonLeft, top: 180 }} />
              <div style={styles.sideButtonRight} />
            </div>
          )}

          {/* Divider */}
          {activeTab === 'both' && (
            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <div style={styles.dividerBadge}>
                <span style={styles.dividerText}>live sync</span>
              </div>
              <div style={styles.dividerLine} />
            </div>
          )}

          {/* Driver phone */}
          {(activeTab === 'both' || activeTab === 'driver') && (
            <div style={styles.phoneOuter}>
              <div style={{ ...styles.phoneFrame, background: Colors.driverBg }}>
                <div style={{ ...styles.notch, background: Colors.driverBg }} />
                <iframe
                  src="/?side=driver"
                  style={styles.screen}
                  title="Wem Driver App"
                />
                <div style={{ ...styles.homeIndicator, background: 'rgba(255,255,255,0.3)' }} />
              </div>
              <div style={styles.sideButtonLeft} />
              <div style={{ ...styles.sideButtonLeft, top: 180 }} />
              <div style={styles.sideButtonRight} />
            </div>
          )}
        </div>

        {/* Feature highlights */}
        <div style={styles.features}>
          {[
            { icon: '✦', label: 'Real Claude AI', sub: 'Live API calls on every booking' },
            { icon: '🛡️', label: 'Dual SOS System', sub: 'Rider button · Driver voice phrase' },
            { icon: '📍', label: 'GPS Simulation', sub: 'Live route tracking, no API cost' },
            { icon: '⭐', label: 'Wem Pass', sub: 'Surge waived · Gas waived · Pickup waived · $14.99/mo' },
          ].map(f => (
            <div key={f.label} style={styles.featureChip}>
              <span style={styles.featureIcon}>{f.icon}</span>
              <div>
                <div style={styles.featureLabel}>{f.label}</div>
                <div style={styles.featureSub}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={styles.footer}>
        <span>Wem · WEM Concept & Design LLC · Dallas/Fort Worth · 2026</span>
        <span style={styles.footerDot}>·</span>
        <span>Built with Claude AI + React Native + Expo</span>
      </div>
    </div>
  );
}

// ── Styles (plain JS objects for web) ─────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #07122B 0%, #0A1E3D 50%, #07122B 100%)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    overflow: 'hidden',
  },

  // Top bar
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(7,18,43,0.8)',
    backdropFilter: 'blur(12px)',
    flexWrap: 'wrap',
    gap: 16,
  },
  logoRow: {
    display: 'flex', alignItems: 'center', gap: 10,
  },
  logoMark: {
    width: 36, height: 36, borderRadius: 10,
    background: Colors.brand,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: 16, fontWeight: 900,
  },
  logoText: {
    fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: -1,
  },
  logoBadge: {
    fontSize: 12, color: 'rgba(255,255,255,0.4)',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 20, padding: '3px 10px',
  },
  tabs: {
    display: 'flex', gap: 8,
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 12, padding: 4,
  },
  tab: {
    padding: '8px 20px', borderRadius: 9, border: 'none',
    background: 'transparent', color: 'rgba(255,255,255,0.5)',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabActive: {
    background: Colors.brand,
    color: '#fff',
  },
  topBarRight: {
    display: 'flex', alignItems: 'center', gap: 12,
  },
  liveChip: {
    fontSize: 12, fontWeight: 700,
    color: Colors.green,
    background: 'rgba(0,168,118,0.12)',
    border: `1px solid rgba(0,168,118,0.3)`,
    borderRadius: 20, padding: '4px 12px',
  },

  // Main
  main: {
    flex: 1,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '24px 16px',
    gap: 20,
    overflowY: 'auto',
  },

  // Labels
  labelRow: {
    display: 'flex', width: '100%',
    maxWidth: PHONE_W * 2 + 80,
    gap: 40,
  },
  phoneLabel: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    flex: 1,
  },
  phoneLabelText: {
    fontSize: 16, fontWeight: 800, color: '#fff',
  },
  phoneLabelSub: {
    fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2,
  },

  // Phones row
  phonesRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 0,
    flexWrap: 'wrap',
  },

  // Phone frame
  phoneOuter: {
    position: 'relative',
    margin: '0 8px',
  },
  phoneFrame: {
    width: PHONE_W,
    height: PHONE_H,
    borderRadius: FRAME_RADIUS,
    background: '#fff',
    border: '8px solid #1A1A2E',
    boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.1)',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  notch: {
    position: 'absolute',
    top: 0, left: '50%',
    transform: 'translateX(-50%)',
    width: NOTCH_W, height: 30,
    background: '#fff',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    zIndex: 10,
  },
  screen: {
    flex: 1,
    width: '100%',
    height: '100%',
    border: 'none',
    marginTop: 0,
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8, left: '50%',
    transform: 'translateX(-50%)',
    width: 120, height: 4,
    background: 'rgba(0,0,0,0.2)',
    borderRadius: 2,
    zIndex: 10,
  },
  sideButtonLeft: {
    position: 'absolute',
    left: -10, top: 140,
    width: 4, height: 40,
    background: '#1A1A2E',
    borderRadius: 2,
  },
  sideButtonRight: {
    position: 'absolute',
    right: -10, top: 160,
    width: 4, height: 60,
    background: '#1A1A2E',
    borderRadius: 2,
  },

  // Divider
  divider: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 12, padding: '0 16px',
    height: PHONE_H,
  },
  dividerLine: {
    flex: 1, width: 1,
    background: 'rgba(255,255,255,0.08)',
  },
  dividerBadge: {
    padding: '8px 14px',
    background: 'rgba(0,119,204,0.15)',
    border: `1px solid rgba(0,119,204,0.3)`,
    borderRadius: 20,
  },
  dividerText: {
    fontSize: 11, fontWeight: 700,
    color: Colors.brand, letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // Feature chips
  features: {
    display: 'flex', flexWrap: 'wrap',
    gap: 12, justifyContent: 'center',
    maxWidth: 900,
  },
  featureChip: {
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12, padding: '10px 16px',
  },
  featureIcon: { fontSize: 20 },
  featureLabel: { fontSize: 13, fontWeight: 700, color: '#fff' },
  featureSub: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 },

  // Footer
  footer: {
    padding: '16px 32px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    fontSize: 12, color: 'rgba(255,255,255,0.25)',
    display: 'flex', gap: 12, justifyContent: 'center',
    flexWrap: 'wrap',
  },
  footerDot: { opacity: 0.3 },
};
