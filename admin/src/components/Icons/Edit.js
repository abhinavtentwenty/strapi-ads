import React from 'react';

const Edit = ({ stroke = '#666687' }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
      <g clip-path="url(#clip0_2724_15361)">
        <path
          d="M7.5 17.004H3.75C3.58424 17.004 3.42527 16.9382 3.30806 16.8209C3.19085 16.7037 3.125 16.5448 3.125 16.379V12.8876C3.12508 12.7221 3.19082 12.5633 3.30781 12.4462L12.9422 2.81182C13.0594 2.6947 13.2183 2.62891 13.384 2.62891C13.5497 2.62891 13.7086 2.6947 13.8258 2.81182L17.3172 6.30088C17.4343 6.41808 17.5001 6.57699 17.5001 6.74268C17.5001 6.90837 17.4343 7.06728 17.3172 7.18448L7.5 17.004Z"
          stroke={stroke}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M16.875 17.0039H7.5"
          stroke={stroke}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10.625 5.12891L15 9.50391"
          stroke={stroke}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2724_15361">
          <rect width="20" height="20" fill="none" transform="translate(0 0.128906)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Edit;
