import * as React from 'react';
import CustomModal from '../../components/elements/customModal';
import { Typography, Flex } from '@strapi/design-system';

export default function ConfirmUnpublishModal({
  isOpen,
  setIsOpen,
  onSubmit,
  variant = 'campaign', // 'campaign' or 'ads'
}) {
  return (
    <CustomModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onSubmit={onSubmit}
      label="confirm-unpublish-title"
    >
      <Flex direction="column" gap={2}>
        <Typography style={{ marginBottom: '0.5rem', fontWeight: 700, fontSize: '22px' }}>
          Unpublish {variant === 'ads' ? 'Ad' : 'Campaign'}?
        </Typography>
        <Typography style={{ fontSize: '16px' }}>
          {variant === 'ads'
            ? 'This will unpublish the selected ad, making it inactive and no longer visible.'
            : 'The campaign will be paused and all Ads will no longer be active or visible to your audience. You can republish it anytime.'}
        </Typography>
      </Flex>
    </CustomModal>
  );
}
