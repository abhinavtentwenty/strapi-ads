import { format, parseISO } from 'date-fns';
import * as React from 'react';
import CustomModal from '../../../components/elements/customModal';
import { Typography, Flex, Box } from '@strapi/design-system';

export default function adDurationOverlapModal({ isOpen, setIsOpen, onSubmit, data, disabled }) {
  const screenTitles =
    data?.ad_screens && data.ad_screens.length > 0
      ? data.ad_screens.map((screen) => screen.ad_screen_title).join(', ')
      : '';
  return (
    <CustomModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      disabled={disabled}
      onSubmit={onSubmit}
      label="ad-duration-overlap-modal"
      endActionOkayLabel
    >
      <Flex direction="column" gap={2}>
        <Typography style={{ marginBottom: '0.5rem', fontWeight: 700, fontSize: '22px' }}>
          Ad Duration Overlap! Cannot Publish This Ad
        </Typography>
        <Typography style={{ fontSize: '16px', marginBottom: '0.5rem' }}>
          Already an ad running for the same "AD Spot" during the date range provided. Please refer
          to the timeline view to adjust the dates.
        </Typography>
        <Typography>Campaign Name : {data?.campaign?.campaign_name}</Typography>
        <Typography>Ad Name : {data?.ad_name}</Typography>
        <Box>
          <Typography>
            {data?.ad_type?.title} : {data?.ad_spot?.ad_spot_display_text}{' '}
            {screenTitles ? ` : ${screenTitles}` : ''}
          </Typography>
          <Typography>
            Duration :{format(parseISO(data?.ad_start_date), 'dd LLL')}-{' '}
            {data?.ad_end_date ? format(parseISO(data?.ad_end_date), 'dd LLL') : 'Ongoing'}
          </Typography>
        </Box>
      </Flex>
    </CustomModal>
  );
}
