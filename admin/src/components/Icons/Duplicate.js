import React from 'react';

const Download = ({ stroke = '#666687' }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
      <g clip-path="url(#clip0_2724_15368)">
        <path
          d="M13.125 13.2539H16.875V3.25391H6.875V7.00391"
          stroke={stroke}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M13.125 7.00391H3.125V17.0039H13.125V7.00391Z"
          stroke={stroke}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2724_15368">
          <rect width="20" height="20" fill="white" transform="translate(0 0.128906)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Download;
