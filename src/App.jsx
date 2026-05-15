/**
 * App.jsx — Main application shell.
 * Three-panel layout: Input | Canvas | Properties
 */
import React, { useState, useRef, useCallback, createRef } from 'react';
import { Plus, Monitor, Box, Check, X, AlertCircle } from 'lucide-react';
import THEMES from './config/themes';
import { generateFrames } from './services/gemini';
import { exportAllAsPngZip, exportFrameAsPng, exportAsPdf, exportAsPptx, copyAsMarkdown } from './services/exportService';
import InputPanel from './components/InputPanel';
import PropertiesPanel from './components/PropertiesPanel';
import FrameCard from './components/FrameCard';

const INITIAL_FRAMES = [];

export default function App() {
  const [rawText, setRawText] = useState('');
  const [frames, setFrames] = useState(INITIAL_FRAMES);
  const [activeTheme, setActiveTheme] = useState('clean');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFrameIds, setSelectedFrameIds] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Refs for each frame card (for export)
  const frameRefs = useRef({});

  const theme = THEMES[activeTheme];

  /* ---- Toast ---- */
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  /* ---- AI Generation ---- */
  const handleGenerate = async () => {
    if (!rawText.trim()) {
      showToast('Please enter some text first.', 'error');
      return;
    }

    setIsGenerating(true);
    setHasStarted(true);
    setFrames([]); // clear to show loading empty state
    
    // Slight delay so the UI morph begins before the thread freezes
    await new Promise(r => setTimeout(r, 100));

    showToast('Analyzing and structuring your content...', 'info');
    showToast('Analyzing and structuring your content...', 'info');

    try {
      const result = await generateFrames(rawText);
      setFrames(result.frames);
      setSelectedFrameIds(new Set());
      showToast(`Successfully generated ${result.frames.length} frames!`, 'success');
    } catch (error) {
      console.error('Generation failed:', error);
      showToast(error.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  /* ---- Frame CRUD ---- */
  const updateFrame = (id, updatedFrame) => {
    setFrames((prev) => prev.map((f) => (f.id === id ? updatedFrame : f)));
  };

  const deleteFrame = (id) => {
    setFrames((prev) => prev.filter((f) => f.id !== id));
    setSelectedFrameIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const duplicateFrame = (frame) => {
    const newFrame = {
      ...frame,
      id: `frame-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: `${frame.title} (Copy)`,
      sections: frame.sections.map((s) => ({ ...s })),
    };
    setFrames((prev) => {
      const idx = prev.findIndex((f) => f.id === frame.id);
      const next = [...prev];
      next.splice(idx + 1, 0, newFrame);
      return next;
    });
  };

  const addBlankFrame = () => {
    const newFrame = {
      id: `frame-${Date.now()}`,
      type: 'presentation',
      title: 'New Frame',
      subtitle: '',
      sections: [{ heading: 'Section', content: 'Edit this content...' }],
    };
    setFrames((prev) => [...prev, newFrame]);
  };

  /* ---- Selection ---- */
  const toggleSelectFrame = (id) => {
    setSelectedFrameIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedFrameIds.size === frames.length) {
      setSelectedFrameIds(new Set());
    } else {
      setSelectedFrameIds(new Set(frames.map((f) => f.id)));
    }
  };

  /* ---- Export ---- */
  const getFrameElements = (ids = null) => {
    const targetIds = ids || frames.map((f) => f.id);
    const elements = [];
    const names = [];
    targetIds.forEach((id) => {
      const el = frameRefs.current[id];
      if (el) {
        const frame = frames.find((f) => f.id === id);
        elements.push(el);
        names.push(`${(frame?.title || id).replace(/[^a-zA-Z0-9]/g, '_')}.png`);
      }
    });
    return { elements, names };
  };

  const handleExport = async (type) => {
    try {
      if (type === 'all-zip') {
        const { elements, names } = getFrameElements();
        if (elements.length === 0) throw new Error('No frames to export.');
        showToast(`Exporting ${elements.length} frames...`, 'info');
        await exportAllAsPngZip(elements, names);
        showToast('ZIP downloaded successfully!', 'success');
      } 
      else if (type === 'selected-png') {
        const ids = Array.from(selectedFrameIds);
        const { elements, names } = getFrameElements(ids);
        if (elements.length === 0) throw new Error('No frames selected.');
        if (elements.length === 1) {
          await exportFrameAsPng(elements[0], names[0]);
          showToast('PNG downloaded!', 'success');
        } else {
          showToast(`Exporting ${elements.length} selected frames...`, 'info');
          await exportAllAsPngZip(elements, names);
          showToast('ZIP of selected frames downloaded!', 'success');
        }
      }
      else if (type === 'pdf') {
        const { elements } = getFrameElements();
        if (elements.length === 0) throw new Error('No frames to export.');
        showToast('Generating PDF...', 'info');
        await exportAsPdf(elements);
        showToast('PDF downloaded!', 'success');
      }
      else if (type === 'pptx') {
        const { elements } = getFrameElements();
        if (elements.length === 0) throw new Error('No frames to export.');
        showToast('Generating PPTX...', 'info');
        await exportAsPptx(elements);
        showToast('PPTX downloaded!', 'success');
      }
      else if (type === 'markdown') {
        const targetFrames = selectedFrameIds.size > 0 
          ? frames.filter(f => selectedFrameIds.has(f.id)) 
          : frames;
        if (targetFrames.length === 0) throw new Error('No frames to export.');
        await copyAsMarkdown(targetFrames);
        showToast('Copied to clipboard as Markdown!', 'success');
      }
    } catch (err) {
      console.error('Export failed:', err);
      showToast(`Export failed: ${err.message}`, 'error');
    }
  };

  const springTransition = "all 0.9s cubic-bezier(0.16,1,0.3,1)";

  /* ---- Render ---- */
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      overflow: 'hidden',
      fontFamily: 'var(--font-sans)',
      background: 'var(--bg-primary)',
    }}>
      {/* Left Panel (Morphing Hero) */}
      <InputPanel
        rawText={rawText}
        onTextChange={setRawText}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        frameCount={frames.length}
        hasStarted={hasStarted}
      />

      {/* Center Canvas */}
      <div style={{
        flex: hasStarted ? 1 : 0,
        opacity: hasStarted ? 1 : 0,
        transform: hasStarted ? 'translateX(0)' : 'translateX(50px)',
        display: 'flex',
        flexDirection: 'column',
        background: theme.canvasBg,
        transition: springTransition,
        position: 'relative',
        minWidth: 0,
        pointerEvents: hasStarted ? 'auto' : 'none',
      }}>
        {/* Canvas Toolbar */}
        <div style={{
          height: '48px',
          minHeight: '48px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 5,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <input
                type="checkbox"
                checked={selectedFrameIds.size === frames.length && frames.length > 0}
                onChange={selectAll}
                style={{ width: '15px', height: '15px' }}
              />
              {selectedFrameIds.size > 0 ? `${selectedFrameIds.size} Selected` : 'Select All'}
            </label>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--text-muted)',
            fontWeight: 500,
          }}>
            <Monitor size={14} />
            <span>{THEMES[activeTheme].name}</span>
            <span style={{
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'var(--bg-elevated)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
            }}>
              {frames.length} frames
            </span>
          </div>
        </div>

        {/* Scrollable Frame Canvas */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '48px 80px',
        }}>
          {frames.length === 0 ? (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              opacity: 0.4,
            }}>
              <Box size={64} strokeWidth={1} color="var(--text-muted)" />
              <p style={{
                fontSize: '16px',
                fontWeight: 500,
                color: 'var(--text-muted)',
              }}>No frames generated yet</p>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
              }}>Paste text and click Generate to get started</p>
            </div>
          ) : (
            <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
              {frames.map((frame, idx) => (
                <FrameCard
                  key={frame.id}
                  ref={(el) => { frameRefs.current[frame.id] = el; }}
                  frame={frame}
                  theme={theme}
                  onUpdate={updateFrame}
                  onDelete={deleteFrame}
                  onDuplicate={duplicateFrame}
                  isSelected={selectedFrameIds.has(frame.id)}
                  onToggleSelect={toggleSelectFrame}
                  index={idx}
                />
              ))}

              {/* Add Frame Button */}
              <button
                onClick={addBlankFrame}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  margin: '16px auto 0',
                  padding: '12px 28px',
                  borderRadius: 'var(--radius-full)',
                  border: '2px dashed var(--border-strong)',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-sans)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.color = 'var(--accent-primary)';
                  e.currentTarget.style.background = 'var(--glow-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <Plus size={18} />
                Add Blank Frame
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{
        width: hasStarted ? '320px' : '0px',
        opacity: hasStarted ? 1 : 0,
        transform: hasStarted ? 'translateX(0)' : 'translateX(100px)',
        transition: springTransition,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: hasStarted ? 'auto' : 'none',
        flexShrink: 0,
      }}>
        <PropertiesPanel
          activeTheme={activeTheme}
          onThemeChange={setActiveTheme}
          frames={frames}
          selectedCount={selectedFrameIds.size}
          onExport={handleExport}
        />
      </div>

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 24px',
          borderRadius: 'var(--radius-full)',
          background: toast.type === 'error' 
            ? 'linear-gradient(135deg, #991b1b, #7f1d1d)' 
            : toast.type === 'info'
              ? 'linear-gradient(135deg, #1e3a5f, #1e293b)'
              : 'linear-gradient(135deg, #14532d, #1a2e1a)',
          color: 'white',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 100,
          animation: 'toastIn 0.3s ease-out',
          fontFamily: 'var(--font-sans)',
          maxWidth: '500px',
        }}>
          {toast.type === 'error' 
            ? <AlertCircle size={16} color="#fca5a5" /> 
            : toast.type === 'info'
              ? <Monitor size={16} color="#93c5fd" />
              : <Check size={16} color="#86efac" />
          }
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{toast.message}</span>
          <button 
            onClick={() => setToast(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              marginLeft: '4px',
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
