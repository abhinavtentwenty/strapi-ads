import React from 'react';

const Download = ({ stroke = '#666687', onClick, style }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      onClick={onClick}
      style={style}
    >
      <path
        d="M10 11.75V3M10 11.75L13.125 8.625M10 11.75L6.875 8.625M16.875 11.75V16.75H3.125V11.75"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Download;
