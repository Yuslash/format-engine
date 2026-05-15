/**
 * PropertiesPanel — Right sidebar with theme selector and export controls.
 */
import React, { useState } from 'react';
import { 
  Settings, Palette, Download, Layers, Check, FileText, 
  Image as ImageIcon, Presentation, Archive, Loader2, MessageSquare
} from 'lucide-react';
import THEMES from '../config/themes';

export default function PropertiesPanel({ 
  activeTheme, 
  onThemeChange, 
  frames,
  selectedCount,
  onExport,
  isExporting,
}) {
  const [exportingType, setExportingType] = useState(null);

  const handleExport = async (type) => {
    setExportingType(type);
    await onExport(type);
    setExportingType(null);
  };

  return (
    <div style={{
      width: '300px',
      minWidth: '300px',
      background: 'var(--bg-secondary)',
      borderLeft: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      zIndex: 10,
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <Settings size={18} color="var(--text-secondary)" />
        <h2 style={{
          fontSize: '14px',
          fontWeight: 700,
          color: 'var(--text-primary)',
        }}>Properties</h2>
      </div>

      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}>

        {/* Theme Section */}
        <div>
          <h3 style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <Palette size={13} />
            Visual Theme
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
          }}>
            {Object.values(THEMES).map((t) => (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                style={{
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  border: activeTheme === t.id 
                    ? '2px solid var(--accent-primary)' 
                    : '1px solid var(--border-default)',
                  background: activeTheme === t.id 
                    ? 'var(--glow-primary)' 
                    : 'var(--bg-tertiary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  position: 'relative',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {/* Preview Swatch */}
                <div style={{
                  width: '100%',
                  height: '32px',
                  borderRadius: '6px',
                  background: t.canvasBg,
                  marginBottom: '8px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: '70%',
                    height: '20px',
                    borderRadius: t.card.borderRadius === '0px' ? '0px' : '4px',
                    background: typeof t.card.background === 'string' && t.card.background.startsWith('linear') 
                      ? t.card.background 
                      : t.card.background,
                    border: t.card.border || 'none',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: activeTheme === t.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                }}>
                  {t.emoji} {t.name}
                </div>

                {/* Active Indicator */}
                {activeTheme === t.id && (
                  <div style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Check size={10} color="white" strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Export Section */}
        <div>
          <h3 style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <Download size={13} />
            Export Options
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Export All ZIP */}
            <ExportButton
              icon={Archive}
              label={`Export All (${frames.length})`}
              badge="ZIP"
              disabled={frames.length === 0}
              loading={exportingType === 'all-zip'}
              onClick={() => handleExport('all-zip')}
              primary
            />

            {/* Export Selected PNG */}
            <ExportButton
              icon={ImageIcon}
              label={`Export Selected (${selectedCount})`}
              badge="PNG"
              disabled={selectedCount === 0}
              loading={exportingType === 'selected-png'}
              onClick={() => handleExport('selected-png')}
            />

            {/* PDF */}
            <ExportButton
              icon={FileText}
              label="Download PDF"
              badge="PDF"
              disabled={frames.length === 0}
              loading={exportingType === 'pdf'}
              onClick={() => handleExport('pdf')}
            />

            {/* Markdown */}
            <ExportButton
              icon={MessageSquare}
              label="Copy as Markdown"
              badge="MD"
              disabled={frames.length === 0}
              loading={exportingType === 'markdown'}
              onClick={() => handleExport('markdown')}
            />

            {/* PPTX */}
            <ExportButton
              icon={Presentation}
              label="Download PPTX"
              badge="PPTX"
              disabled={frames.length === 0}
              loading={exportingType === 'pptx'}
              onClick={() => handleExport('pptx')}
            />
          </div>
        </div>

        {/* Info */}
        <div style={{
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-subtle)',
        }}>
          <p style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
          }}>
            💡 <strong style={{ color: 'var(--text-tertiary)' }}>Tip:</strong> Click any text on a frame to edit it inline. 
            Use the checkboxes to select specific frames for export.
          </p>
        </div>
      </div>
    </div>
  );
}

function ExportButton({ icon: Icon, label, badge, disabled, loading, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        width: '100%',
        padding: '10px 14px',
        borderRadius: 'var(--radius-md)',
        border: primary ? 'none' : '1px solid var(--border-default)',
        background: primary 
          ? (disabled ? 'var(--bg-elevated)' : 'linear-gradient(135deg, var(--accent-primary), #4f46e5)')
          : 'var(--bg-tertiary)',
        color: primary 
          ? (disabled ? 'var(--text-muted)' : 'white')
          : (disabled ? 'var(--text-muted)' : 'var(--text-secondary)'),
        fontSize: '13px',
        fontWeight: 600,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'var(--font-sans)',
        transition: 'all 0.15s',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {loading 
          ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
          : <Icon size={16} />
        }
        {loading ? 'Exporting...' : label}
      </div>
      {badge && (
        <span style={{
          padding: '2px 8px',
          borderRadius: '4px',
          background: primary ? 'rgba(255,255,255,0.2)' : 'var(--bg-elevated)',
          fontSize: '10px',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.5px',
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}
