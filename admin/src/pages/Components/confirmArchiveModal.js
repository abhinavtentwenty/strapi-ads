import * as React from 'react';
import CustomModal from '../../components/elements/customModal';
import { Typography, Flex } from '@strapi/design-system';

export default function ConfirmArchiveModal({
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
      label="confirm-archive-title"
    >
      <Flex direction="column" gap={2}>
        <Typography style={{ marginBottom: '0.5rem', fontWeight: 700, fontSize: '22px' }}>
          Archive {variant === 'ads' ? 'Ad' : 'Campaign'}?
        </Typography>
        <Typography style={{ fontSize: '16px' }}>
          This will Archive the selected {variant === 'ads' ? 'Ad' : 'Campaign'}, making it inactive
          and no longer visible.
        </Typography>
      </Flex>
    </CustomModal>
  );
}
