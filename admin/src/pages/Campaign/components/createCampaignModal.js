import * as React from 'react';
import CustomModal from '../../../components/elements/customModal';
import { Typography, Flex } from '@strapi/design-system';

export default function CreateCampaignModal({ isOpen, setIsOpen, onSubmit, adsCount, disabled }) {
  return (
    <CustomModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onSubmit={onSubmit}
      disabled={disabled}
      label="create-campaign-title"
    >
      <Flex direction="column" gap={2}>
        <Typography style={{ marginBottom: '0.5rem', fontWeight: 700, fontSize: '22px' }}>
          Get Ready to Launch Campaign!
        </Typography>
        <Typography style={{ fontSize: '16px' }}>
          You're ready to publish {adsCount} Ads. Please double-check everything to ensure it's all
          set before you confirm.
        </Typography>
      </Flex>
    </CustomModal>
  );
}
