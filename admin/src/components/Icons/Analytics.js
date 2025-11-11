import React from 'react';

const Analytics = ({ stroke = '#8e8ea9' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.5 16.25H2.5V3.75M17.5 7.5L12.5 11.875L7.5 8.125L2.5 12.5" />
    </svg>
  );
};

export default Analytics;
