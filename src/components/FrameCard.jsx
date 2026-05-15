/**
 * FrameCard — A single visual frame/slide.
 * Renders differently based on frame type (presentation, skill_card, infographic).
 * Fully inline-editable. Exports cleanly via html-to-image.
 */
import React, { forwardRef } from 'react';
import { Layers, Sparkles, BarChart3, Copy, Trash2, RefreshCw, X } from 'lucide-react';
import EditableText from './EditableText';

const TYPE_ICONS = {
  presentation: Layers,
  skill_card: Sparkles,
  infographic: BarChart3,
};

const TYPE_LABELS = {
  presentation: 'Presentation',
  skill_card: 'Skill Card',
  infographic: 'Infographic',
};

const FrameCard = forwardRef(({ 
  frame, 
  theme, 
  onUpdate, 
  onDelete, 
  onDuplicate,
  isSelected,
  onToggleSelect,
  index,
}, ref) => {
  const TypeIcon = TYPE_ICONS[frame.type] || Layers;

  const updateField = (field, value) => {
    onUpdate(frame.id, { ...frame, [field]: value });
  };

  const updateSection = (idx, field, value) => {
    const newSections = [...frame.sections];
    newSections[idx] = { ...newSections[idx], [field]: value };
    updateField('sections', newSections);
  };

  const deleteSection = (idx) => {
    const newSections = frame.sections.filter((_, i) => i !== idx);
    updateField('sections', newSections);
  };

  const addSection = () => {
    const newSections = [...frame.sections, { heading: 'New Section', content: 'Edit this content...' }];
    updateField('sections', newSections);
  };

  /* ---- Render Sections by Type ---- */
  const renderSections = () => {
    if (frame.type === 'skill_card') {
      return (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '12px',
          marginTop: '24px' 
        }}>
          {frame.sections.map((section, idx) => (
            <div
              key={idx}
              style={{
                background: theme.accentBg,
                border: theme.accentBorder,
                borderRadius: theme.card.borderRadius === '0px' ? '0px' : '12px',
                padding: '16px',
                position: 'relative',
              }}
            >
              <button
                className="no-export"
                onClick={() => deleteSection(idx)}
                title="Remove Section"
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: theme.accentText,
                  opacity: 0.3,
                  padding: '4px',
                  transition: 'opacity 0.2s',
                  zIndex: 10,
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.3}
              >
                <X size={14} />
              </button>
              {section.heading && (
                <EditableText
                  tag="h4"
                  value={section.heading}
                  onChange={(v) => updateSection(idx, 'heading', v)}
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    color: theme.accentText,
                    marginBottom: '6px',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
              )}
              <EditableText
                tag="p"
                value={section.content}
                onChange={(v) => updateSection(idx, 'content', v)}
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: theme.accentText,
                  lineHeight: 1.5,
                  fontFamily: 'var(--font-sans)',
                }}
              />
            </div>
          ))}
        </div>
      );
    }

    if (frame.type === 'infographic') {
      return (
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {frame.sections.map((section, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                position: 'relative',
              }}
            >
              <button
                className="no-export"
                onClick={() => deleteSection(idx)}
                title="Remove Section"
                style={{
                  position: 'absolute',
                  top: '0px',
                  right: '0px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: theme.textColor,
                  opacity: 0.2,
                  padding: '4px',
                  transition: 'opacity 0.2s',
                  zIndex: 10,
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.2}
              >
                <X size={14} />
              </button>
              {/* Step Number */}
              <div style={{
                minWidth: '36px',
                height: '36px',
                borderRadius: '50%',
                background: theme.accentBg,
                border: theme.accentBorder,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 700,
                color: theme.accentText,
                flexShrink: 0,
                fontFamily: 'var(--font-mono)',
              }}>
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div style={{ flex: 1 }}>
                {section.heading && (
                  <EditableText
                    tag="h3"
                    value={section.heading}
                    onChange={(v) => updateSection(idx, 'heading', v)}
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: theme.headingColor,
                      marginBottom: '4px',
                      fontFamily: 'var(--font-sans)',
                    }}
                  />
                )}
                <EditableText
                  tag="p"
                  value={section.content}
                  onChange={(v) => updateSection(idx, 'content', v)}
                  style={{
                    fontSize: '14px',
                    color: theme.textColor,
                    lineHeight: 1.6,
                    fontFamily: 'var(--font-sans)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Default: presentation
    return (
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {frame.sections.map((section, idx) => (
          <div key={idx} style={{ position: 'relative', paddingRight: '24px' }}>
            <button
              className="no-export"
              onClick={() => deleteSection(idx)}
              title="Remove Section"
              style={{
                position: 'absolute',
                top: '0px',
                right: '0px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: theme.textColor,
                opacity: 0.2,
                padding: '4px',
                transition: 'opacity 0.2s',
                zIndex: 10,
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 0.2}
            >
              <X size={14} />
            </button>
            {section.heading && (
              <EditableText
                tag="h3"
                value={section.heading}
                onChange={(v) => updateSection(idx, 'heading', v)}
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: theme.headingColor,
                  marginBottom: '6px',
                  fontFamily: 'var(--font-sans)',
                }}
              />
            )}
            <EditableText
              tag="p"
              value={section.content}
              onChange={(v) => updateSection(idx, 'content', v)}
              style={{
                fontSize: '14px',
                color: theme.textColor,
                lineHeight: 1.7,
                fontFamily: 'var(--font-sans)',
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'relative',
        marginBottom: '32px',
        animation: `slideUp 0.4s ease-out ${index * 0.08}s both`,
      }}
      onMouseEnter={(e) => {
        const actions = e.currentTarget.querySelector('.frame-actions');
        if (actions) actions.style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        const actions = e.currentTarget.querySelector('.frame-actions');
        if (actions) actions.style.opacity = '0';
      }}
    >
      {/* Floating Action Bar */}
      <div
        className="frame-actions"
        style={{
          position: 'absolute',
          top: '12px',
          right: '-56px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          opacity: 0,
          transition: 'opacity 0.2s ease',
          zIndex: 5,
        }}
      >
        {[
          { icon: Copy, label: 'Duplicate', action: () => onDuplicate(frame) },
          { icon: Trash2, label: 'Delete', action: () => onDelete(frame.id) },
        ].map(({ icon: Icon, label, action }) => (
          <button
            key={label}
            onClick={action}
            title={label}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-elevated)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-primary)';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-elevated)';
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'var(--border-default)';
            }}
          >
            <Icon size={15} />
          </button>
        ))}
      </div>

      {/* Selection Checkbox */}
      <div className="no-export" style={{
        position: 'absolute',
        top: '20px',
        left: '-44px',
        zIndex: 5,
      }}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(frame.id)}
          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
        />
      </div>

      {/* The Exportable Card */}
      <div
        ref={ref}
        className="frame-export-target"
        style={{
          ...theme.card,
          padding: '40px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'box-shadow 0.3s ease, transform 0.3s ease',
          transform: isSelected ? 'scale(1.01)' : 'scale(1)',
          boxShadow: isSelected
            ? `${theme.card.boxShadow}, 0 0 0 3px var(--accent-primary)`
            : theme.card.boxShadow,
        }}
      >
        {/* Type Badge */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '20px',
          background: theme.badgeBg,
          color: theme.badgeText,
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontFamily: 'var(--font-mono)',
        }}>
          <TypeIcon size={12} />
          {TYPE_LABELS[frame.type] || frame.type}
        </div>

        {/* Title */}
        <EditableText
          tag="h1"
          value={frame.title}
          onChange={(v) => updateField('title', v)}
          style={{
            fontSize: '28px',
            fontWeight: 800,
            color: theme.titleColor,
            background: theme.titleGradient || 'none',
            WebkitBackgroundClip: theme.titleGradient ? 'text' : 'unset',
            WebkitTextFillColor: theme.titleGradient ? 'transparent' : 'unset',
            letterSpacing: '-0.5px',
            lineHeight: 1.2,
            fontFamily: 'var(--font-sans)',
            paddingRight: '120px',
          }}
        />

        {/* Subtitle */}
        {frame.subtitle && (
          <EditableText
            tag="h2"
            value={frame.subtitle}
            onChange={(v) => updateField('subtitle', v)}
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: theme.subtitleColor,
              marginTop: '8px',
              fontFamily: 'var(--font-sans)',
            }}
          />
        )}

        {/* Divider */}
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, ${theme.accentText}33 0%, transparent 100%)`,
          marginTop: '20px',
          opacity: 0.5,
        }} />

        {/* Sections */}
        {renderSections()}

        {/* Add Section Button */}
        <button
          className="no-export"
          onClick={addSection}
          style={{
            marginTop: '20px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: `1px dashed ${theme.accentText}44`,
            background: 'transparent',
            color: theme.accentText,
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            opacity: 0.5,
            transition: 'opacity 0.2s ease',
            fontFamily: 'var(--font-sans)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
        >
          + Add Section
        </button>
      </div>
    </div>
  );
});

FrameCard.displayName = 'FrameCard';

export default FrameCard;
