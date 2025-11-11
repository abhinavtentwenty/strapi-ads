import React from 'react';

const Download = ({ stroke = '#666687' }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
      <g clip-path="url(#clip0_2724_15355)">
        <path
          d="M10 4.50391C3.75 4.50391 1.25 10.1289 1.25 10.1289C1.25 10.1289 3.75 15.7539 10 15.7539C16.25 15.7539 18.75 10.1289 18.75 10.1289C18.75 10.1289 16.25 4.50391 10 4.50391Z"
          stroke={stroke}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10 13.2539C11.7259 13.2539 13.125 11.8548 13.125 10.1289C13.125 8.40302 11.7259 7.00391 10 7.00391C8.27411 7.00391 6.875 8.40302 6.875 10.1289C6.875 11.8548 8.27411 13.2539 10 13.2539Z"
          stroke={stroke}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2724_15355">
          <rect width="20" height="20" fill="none" transform="translate(0 0.128906)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Download;
