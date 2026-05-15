/**
 * ============================================================================
 * 🎨 THEME CONFIGURATION (Easy to Modify!)
 * ============================================================================
 * 
 * Welcome to the Theme Engine! 
 * If you want to add your own theme, simply copy one of the blocks below 
 * and paste it at the bottom of the THEMES object.
 * 
 * Here is what each property does:
 * - id: A unique string identifier (e.g., 'my_theme')
 * - name: The display name shown in the UI
 * - emoji: A fun icon for the UI button
 * - canvasBg: The background color of the workspace behind the cards
 * - card: Settings for the main card container (background, border, shadow)
 * - titleColor: Color of the main huge text at the top
 * - subtitleColor: Color of the smaller text right below the title
 * - headingColor: Color of the section headings
 * - textColor: Color of the main paragraph text (make sure it has high contrast!)
 * - accentBg: Background color for highlighted blocks (like Skill Cards)
 * - accentText: Text color for highlighted blocks
 * - accentBorder: Border style for highlighted blocks
 * - badgeBg & badgeText: Colors for the tiny label in the top right corner
 * ============================================================================
 */

const THEMES = {
  clean: {
    id: 'clean',
    name: 'Apple Clean',
    emoji: '🍎',
    canvasBg: '#f5f5f7', // Apple's standard light gray
    card: {
      background: '#ffffff',
      border: '1px solid rgba(0,0,0,0.04)',
      borderRadius: '24px', // Apple squircle radius
      boxShadow: '0 8px 30px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)',
    },
    titleColor: '#1d1d1f',    // Apple's dark gray/black
    subtitleColor: '#86868b', // Apple's secondary text color
    headingColor: '#1d1d1f',  
    textColor: '#1d1d1f',     // Crisp, high-contrast reading text
    accentBg: '#f5f5f7',      // Subtle gray for cards/blocks instead of blue
    accentText: '#1d1d1f',    // Dark text on the gray
    accentBorder: 'none',
    badgeBg: 'rgba(0,0,0,0.05)',
    badgeText: '#1d1d1f',
  },

  gaming: {
    id: 'gaming',
    name: 'Dark Gaming',
    emoji: '🎮',
    canvasBg: '#09090b', // Deep dark
    card: {
      background: 'linear-gradient(145deg, #18181b 0%, #1e1b2e 100%)',
      border: '2px solid rgba(99,102,241,0.4)', // Stronger border
      borderRadius: '16px',
      boxShadow: '0 0 50px -15px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
    },
    titleColor: 'transparent',
    titleGradient: 'linear-gradient(135deg, #a5b4fc, #22d3ee)', // Brighter gradient
    subtitleColor: '#a1a1aa', // Lighter zinc for contrast
    headingColor: '#c7d2fe',  // Very light indigo
    textColor: '#e4e4e7',     // Almost white zinc (highly readable)
    accentBg: 'rgba(99,102,241,0.15)',
    accentText: '#c7d2fe',
    accentBorder: '1px solid rgba(99,102,241,0.3)',
    badgeBg: 'rgba(99,102,241,0.2)',
    badgeText: '#a5b4fc',
  },

  minimal: {
    id: 'minimal',
    name: 'Minimal Mono',
    emoji: '◻️',
    canvasBg: '#fafaf9',
    card: {
      background: '#ffffff',
      border: '3px solid #1c1917',
      borderRadius: '0px',
      boxShadow: '8px 8px 0px 0px #1c1917',
    },
    titleColor: '#1c1917',
    subtitleColor: '#44403c',
    headingColor: '#1c1917',
    textColor: '#292524',     // Very dark gray for maximum contrast
    accentBg: '#1c1917',
    accentText: '#fafaf9',
    accentBorder: 'none',
    badgeBg: '#1c1917',
    badgeText: '#fafaf9',
  },

  cyberpunk: {
    id: 'cyberpunk',
    name: 'Neon Cyber',
    emoji: '⚡',
    canvasBg: '#050505',
    card: {
      background: '#111111',
      border: '1px solid #333',
      borderLeft: '6px solid #22d3ee', // Thicker neon accent
      borderRadius: '0px',
      boxShadow: '10px 10px 0px 0px #ec4899, 0 0 30px rgba(34,211,238,0.1)',
    },
    titleColor: '#fde047',    // Bright yellow
    subtitleColor: '#67e8f9', // Bright cyan
    headingColor: '#f472b6',  // Bright pink
    textColor: '#f4f4f5',     // White-ish zinc for reading large text
    accentBg: 'rgba(34,211,238,0.1)',
    accentText: '#67e8f9',
    accentBorder: '1px solid rgba(34,211,238,0.3)',
    badgeBg: 'rgba(250,204,21,0.15)',
    badgeText: '#fde047',
  },

  ocean: {
    id: 'ocean',
    name: 'Deep Ocean',
    emoji: '🌊',
    canvasBg: '#080d19',
    card: {
      background: 'linear-gradient(160deg, #0d172a 0%, #080f1e 100%)',
      border: '1px solid rgba(56,189,248,0.3)',
      borderRadius: '16px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(56,189,248,0.1)',
    },
    titleColor: '#f0f9ff',    // Bright sky blue/white
    subtitleColor: '#7dd3fc', // Light sky
    headingColor: '#bae6fd',  // Very light sky
    textColor: '#e2e8f0',     // Light slate
    accentBg: 'rgba(56,189,248,0.1)',
    accentText: '#7dd3fc',
    accentBorder: '1px solid rgba(56,189,248,0.2)',
    badgeBg: 'rgba(56,189,248,0.15)',
    badgeText: '#bae6fd',
  },

  sunset: {
    id: 'sunset',
    name: 'Warm Sunset',
    emoji: '🌅',
    canvasBg: '#170e15',
    card: {
      background: 'linear-gradient(160deg, #2a1a25 0%, #170e15 100%)',
      border: '1px solid rgba(251,146,60,0.3)',
      borderRadius: '16px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(251,146,60,0.1)',
    },
    titleColor: '#ffedd5',    // Bright orange/white
    subtitleColor: '#fdba74', // Light orange
    headingColor: '#fcd34d',  // Light amber
    textColor: '#e7e5e4',     // Light stone
    accentBg: 'rgba(251,146,60,0.1)',
    accentText: '#fdba74',
    accentBorder: '1px solid rgba(251,146,60,0.2)',
    badgeBg: 'rgba(251,146,60,0.15)',
    badgeText: '#ffedd5',
  },
};

export default THEMES;
