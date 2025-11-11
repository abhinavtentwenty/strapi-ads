import React from 'react';

const CustomIconButton = ({ children, onClick, ariaLabel, isDark = false }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    style={{
      border: !isDark ? '1px solid #dcdce4' : 'none',
      padding: '5px',
      borderRadius: '4px',
      backgroundColor: isDark ? '#181826' : 'transparent',
      width: 'fit-content',
    }}
  >
    {children}
  </button>
);

export default CustomIconButton;
