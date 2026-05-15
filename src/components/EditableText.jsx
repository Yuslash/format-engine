/**
 * EditableText — Inline-editable text component.
 * Click to edit, blur to save. Styled to feel seamless.
 */
import React, { useRef, useEffect, useState } from 'react';

export default function EditableText({ 
  value, 
  onChange, 
  style = {},
  className = '',
  tag = 'div',
  placeholder = 'Click to edit...'
}) {
  const ref = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value || '';
    }
  }, [value]);

  const handleBlur = () => {
    setIsFocused(false);
    const newValue = ref.current?.textContent || '';
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      ref.current?.blur();
    }
  };

  const Tag = tag;

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      data-placeholder={placeholder}
      style={{
        outline: 'none',
        cursor: 'text',
        borderRadius: '4px',
        padding: '2px 4px',
        margin: '-2px -4px',
        transition: 'box-shadow 0.15s ease, background 0.15s ease',
        boxShadow: isFocused ? '0 0 0 2px rgba(99,102,241,0.5)' : 'none',
        backgroundColor: isFocused ? 'rgba(99,102,241,0.05)' : 'transparent',
        minHeight: '1em',
        ...style,
      }}
      className={className}
    />
  );
}
