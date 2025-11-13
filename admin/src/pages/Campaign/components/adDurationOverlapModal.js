import * as React from 'react';
import CustomModal from '../../../components/elements/customModal';

export default function adDurationOverlapModal({ isOpen, setIsOpen, onSubmit }) {
  return (
    <CustomModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onSubmit={onSubmit}
      label="ad-duration-overlap-modal"
    >
      <h3 style={{ marginBottom: '0.5rem', fontWeight: 700, fontSize: '22px' }}>
        Ad Duration Overlap! Cannot Publish This Ad
      </h3>
      <p style={{ fontSize: '16px', marginBottom: '0.5rem' }}>
        Already an ad running for the same "AD Spot" during the date range provided. Please refer to
        the timeline view to adjust the dates.
      </p>
      <p>Campaign Name : Tourism</p>
      <p>Ad Name : XYZ Ad</p>
      <p>Ad type : Business listing : News, Events.</p>
      <p>Duration : 10 Aug - 1 Sep 25</p>
    </CustomModal>
  );
}
