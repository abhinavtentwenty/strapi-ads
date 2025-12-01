import * as React from 'react';
import CustomModal from '../../../components/elements/customModal';
import { format, parseISO } from 'date-fns';

export default function adDurationOverlapModal({ isOpen, setIsOpen, onSubmit, data }) {
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
      <p>Campaign Name : {data?.campaign?.campaign_name}</p>
      <p>Ad Name : {data?.ad_name}</p>
      {/* TODO: Add ad type */}
      <p>Ad type : Business listing : News, Events.</p>
      <p>
        Duration : {format(parseISO(data?.ad_start_date), 'dd LLL')} -{' '}
        {format(parseISO(data?.ad_end_date), 'dd LLL')}
      </p>
    </CustomModal>
  );
}
