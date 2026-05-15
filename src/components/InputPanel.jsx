/**
 * InputPanel — Left sidebar with text input and generation controls.
 */
import React, { useState, useEffect } from 'react';
import { Sparkles, Wand2, Loader2, AlertCircle, FileText, Zap } from 'lucide-react';

const EXAMPLE_TEXTS = [
  {
    label: '🎮 Game Character',
    text: `Character: Shadow Blade — Assassin Class

Passive — Ghost Step: After dodging an attack, gain 30% movement speed for 2 seconds. Cooldown: 8s.

Skill 1 — Phantom Strike: Dash forward 6m, dealing 180 (+80% ATK) physical damage to enemies in path. If an enemy champion is hit, reset cooldown. Mana: 45. Cooldown: 6s.

Skill 2 — Smoke Bomb: Throw a smoke bomb at target location, creating a 4m zone for 3s. Enemies inside are slowed by 40% and have reduced vision. Allies inside gain 15% evasion. Mana: 60. Cooldown: 12s.

Ultimate — Blade Storm: Channel for 0.5s, then unleash a flurry of 8 strikes in a cone, each dealing 95 (+45% ATK) physical damage. Final strike deals 200% damage and applies Bleed for 3s. Mana: 100. Cooldown: 60s.

Stats at Level 1: HP 580, ATK 62, DEF 28, Speed 345
Stats at Level 18: HP 2180, ATK 298, DEF 96, Speed 345`,
  },
  {
    label: '📋 Product Spec',
    text: `Product: AeroFlow Pro Wireless Earbuds

Overview: Premium true wireless earbuds with adaptive noise cancellation, spatial audio, and 40-hour total battery life. Designed for audiophiles and professionals.

Key Features:
- Adaptive Hybrid ANC with 3 modes (Transport, Outdoor, Indoor)
- Custom 11mm titanium-coated drivers
- Bluetooth 5.3 with multipoint connection (2 devices)
- Spatial Audio with head tracking
- IP55 water and dust resistance
- Touch controls with customizable gestures
- AI-powered call noise reduction

Battery: 8 hours per charge (ANC on), 10 hours (ANC off). Case provides 4 additional charges. Fast charge: 10 min = 2 hours playback. Wireless Qi charging supported.

Audio Specs: Frequency Response 20Hz-40kHz, Driver Size 11mm, Codec Support: LDAC, AAC, SBC, aptX Adaptive

In the Box: Earbuds, Charging Case, USB-C Cable, 4 sizes ear tips (XS/S/M/L), Quick Start Guide

Price: $179.99
Available Colors: Midnight Black, Lunar White, Forest Green`,
  },
  {
    label: '📚 Study Notes',
    text: `Chapter 5: Photosynthesis

Definition: The process by which green plants convert light energy into chemical energy stored in glucose.

Overall Equation: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2

Two Main Stages:
1. Light-Dependent Reactions — occur in thylakoid membranes. Water is split (photolysis), producing O2, ATP, and NADPH. Requires chlorophyll to absorb light (mainly red and blue wavelengths).

2. Light-Independent Reactions (Calvin Cycle) — occur in the stroma. CO2 is fixed into G3P using ATP and NADPH from stage 1. Key enzyme: RuBisCO. 3 turns of the cycle produce 1 molecule of G3P.

Factors Affecting Rate: Light intensity (increases rate up to saturation point), CO2 concentration, Temperature (optimal around 25-30°C, enzymes denature above 40°C), Water availability.

Key Terms: Chloroplast, Thylakoid, Stroma, Photosystem I & II, Electron Transport Chain, Carbon Fixation, Photorespiration.

Important: C4 and CAM plants have evolved adaptations to minimize photorespiration in hot/dry climates.`,
  },
];

export default function InputPanel({ 
  rawText, 
  onTextChange, 
  onGenerate, 
  isGenerating,
  frameCount,
  hasStarted 
}) {
  const [showExamples, setShowExamples] = useState(false);
  const [loadingText, setLoadingText] = useState('Structuring Content...');
  const springTransition = "all 0.9s cubic-bezier(0.16,1,0.3,1)";

  const loadingPhrases = [
    'Connecting to AI...',
    'Analyzing text structure...',
    'Extracting key points...',
    'Designing visual frames...',
    'Applying theme styles...',
    'Finalizing layout...'
  ];

  useEffect(() => {
    let interval;
    if (isGenerating) {
      let index = 0;
      setLoadingText(loadingPhrases[0]);
      interval = setInterval(() => {
        index = (index + 1) % loadingPhrases.length;
        setLoadingText(loadingPhrases[index]);
      }, 2000);
    } else {
      setLoadingText('Structuring Content...');
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  return (
    <div style={{
      width: hasStarted ? '320px' : '100%',
      minWidth: hasStarted ? '320px' : '100%',
      background: hasStarted ? 'var(--bg-secondary)' : 'var(--bg-primary)',
      borderRight: hasStarted ? '1px solid var(--border-subtle)' : 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: hasStarted ? 'stretch' : 'center',
      justifyContent: hasStarted ? 'flex-start' : 'center',
      height: '100%',
      zIndex: 30,
      transition: springTransition,
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{
        padding: hasStarted ? '16px 20px' : '0',
        marginBottom: hasStarted ? '0' : '48px',
        borderBottom: hasStarted ? '1px solid var(--border-subtle)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: hasStarted ? 'flex-start' : 'center',
        gap: '12px',
        transition: springTransition,
        width: hasStarted ? 'auto' : '100%',
      }}>
        <div style={{
          width: hasStarted ? '34px' : '56px',
          height: hasStarted ? '34px' : '56px',
          borderRadius: hasStarted ? '10px' : '16px',
          background: 'var(--accent-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: hasStarted ? '0 0 10px rgba(255,255,255,0.1)' : '0 10px 40px rgba(255,255,255,0.15)',
          transition: springTransition,
        }}>
          <Sparkles size={hasStarted ? 16 : 28} color="black" style={{ transition: springTransition }} />
        </div>
        <div>
          <h1 style={{
            fontSize: hasStarted ? '16px' : '40px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.04em',
            transition: springTransition,
          }}>Format Engine</h1>
          <p style={{
            fontSize: hasStarted ? '11px' : '15px',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            letterSpacing: '-0.01em',
            transition: springTransition,
          }}>AI-Powered Slide Formatter</p>
        </div>
      </div>

      {/* Content Area */}
      <div style={{
        flex: hasStarted ? 1 : 'none',
        width: hasStarted ? 'auto' : '100%',
        maxWidth: hasStarted ? 'none' : '800px',
        display: 'flex',
        flexDirection: 'column',
        padding: hasStarted ? '16px' : '0 32px',
        gap: '16px',
        overflow: hasStarted ? 'hidden' : 'visible',
        transition: springTransition,
      }}>
        <p style={{
          textAlign: 'center',
          fontSize: '18px',
          color: 'var(--text-secondary)',
          opacity: hasStarted ? 0 : 1,
          height: hasStarted ? 0 : 'auto',
          margin: hasStarted ? 0 : '0 0 16px 0',
          overflow: 'hidden',
          transition: springTransition,
        }}>
          Paste messy text, character kits, or notes.<br/>Watch AI transform it into beautiful visual frames.
        </p>
        {/* Label */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <label style={{
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <FileText size={14} />
            Raw Content
          </label>
          <button
            onClick={() => setShowExamples(!showExamples)}
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--accent-primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '6px',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--glow-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            {showExamples ? 'Hide' : 'Try Examples'}
          </button>
        </div>

        {/* Example Quick-Fill Buttons */}
        {showExamples && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            animation: 'slideDown 0.2s ease-out',
          }}>
            {EXAMPLE_TEXTS.map((ex, i) => (
              <button
                key={i}
                onClick={() => {
                  onTextChange(ex.text);
                  setShowExamples(false);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-default)',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  fontFamily: 'var(--font-sans)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-elevated)';
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-tertiary)';
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {ex.label}
              </button>
            ))}
          </div>
        )}

        {/* Textarea */}
        <textarea
          value={rawText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Paste your messy notes, character kits, product specs, study notes, patch notes, or any unformatted text here...&#10;&#10;The AI will automatically organize it into beautiful visual frames."
          style={{
            flex: hasStarted ? 1 : 'none',
            height: hasStarted ? 'auto' : '260px',
            width: '100%',
            padding: hasStarted ? '14px' : '20px',
            borderRadius: hasStarted ? 'var(--radius-md)' : 'var(--radius-xl)',
            border: '1px solid var(--border-default)',
            background: hasStarted ? 'var(--bg-tertiary)' : 'rgba(255,255,255,0.02)',
            color: 'var(--text-primary)',
            fontSize: hasStarted ? '13px' : '15px',
            lineHeight: 1.6,
            resize: 'none',
            fontFamily: 'var(--font-sans)',
            transition: springTransition,
            outline: 'none',
            boxShadow: hasStarted ? 'none' : 'inset 0 2px 10px rgba(0,0,0,0.5)',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--text-secondary)';
            e.target.style.background = 'rgba(255,255,255,0.04)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border-default)';
            e.target.style.background = hasStarted ? 'var(--bg-tertiary)' : 'rgba(255,255,255,0.02)';
          }}
        />

        {/* Character Count */}
        <div style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          textAlign: 'right',
          fontFamily: 'var(--font-mono)',
        }}>
          {rawText.length > 0 ? `${rawText.length} characters` : ''}
        </div>

        {/* Generate Button */}
        <button
          onClick={onGenerate}
          disabled={isGenerating || (!hasStarted && !rawText.trim())}
          style={{
            width: hasStarted ? '100%' : 'auto',
            alignSelf: hasStarted ? 'stretch' : 'center',
            padding: hasStarted ? '14px' : '16px 36px',
            borderRadius: hasStarted ? 'var(--radius-md)' : 'var(--radius-full)',
            border: '1px solid rgba(255,255,255,0.1)',
            background: isGenerating
              ? 'var(--bg-elevated)'
              : 'var(--text-primary)',
            color: isGenerating ? 'var(--text-tertiary)' : 'black',
            fontSize: hasStarted ? '13px' : '15px',
            fontWeight: 600,
            cursor: isGenerating || (!hasStarted && !rawText.trim()) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            fontFamily: 'var(--font-sans)',
            transition: springTransition,
            boxShadow: isGenerating ? 'none' : '0 8px 30px rgba(255,255,255,0.1)',
            opacity: (!hasStarted && !rawText.trim()) ? 0.5 : 1,
            marginTop: hasStarted ? 'auto' : '16px',
          }}
          onMouseEnter={(e) => !isGenerating && (e.currentTarget.style.transform = 'scale(1.02)')}
          onMouseLeave={(e) => !isGenerating && (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isGenerating ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '160px', justifyContent: 'center' }}>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ 
                animation: 'fadeIn 0.3s ease-in-out',
              }}>
                {loadingText}
              </span>
            </div>
          ) : (
            <>
              <Wand2 size={18} />
              Generate Frames
            </>
          )}
        </button>

        {/* Status */}
        {frameCount > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.15)',
          }}>
            <Zap size={14} color="#22c55e" />
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#22c55e',
            }}>
              {frameCount} frames generated
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
