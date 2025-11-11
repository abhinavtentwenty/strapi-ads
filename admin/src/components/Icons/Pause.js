import React from 'react';

const Pause = ({ stroke = '#666687' }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
      <g clip-path="url(#clip0_52581_2718)">
        <path
          d="M15.625 3.25391H12.5C12.1548 3.25391 11.875 3.53373 11.875 3.87891V16.3789C11.875 16.7241 12.1548 17.0039 12.5 17.0039H15.625C15.9702 17.0039 16.25 16.7241 16.25 16.3789V3.87891C16.25 3.53373 15.9702 3.25391 15.625 3.25391Z"
          stroke={stroke}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M7.5 3.25391H4.375C4.02982 3.25391 3.75 3.53373 3.75 3.87891V16.3789C3.75 16.7241 4.02982 17.0039 4.375 17.0039H7.5C7.84518 17.0039 8.125 16.7241 8.125 16.3789V3.87891C8.125 3.53373 7.84518 3.25391 7.5 3.25391Z"
          stroke={stroke}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_52581_2718">
          <rect width="20" height="20" fill="none" transform="translate(0 0.128906)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Pause;
