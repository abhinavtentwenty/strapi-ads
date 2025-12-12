import { Flex, Typography } from '@strapi/design-system';
import * as React from 'react';
import CustomModal from '../../../components/elements/customModal';

export default function EditCampaignModal({
  isOpen,
  isPublish,
  setIsOpen,
  onSubmit,
  adsCount,
  disabled,
}) {
  return (
    <CustomModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onSubmit={onSubmit}
      disabled={disabled}
      label="edit-campaign-title"
    >
      <Flex direction="column" gap={2}>
        <Typography style={{ marginBottom: '0.5rem', fontWeight: 700, fontSize: '22px' }}>
          {isPublish ? 'Publish' : 'Unpublish'} Changes?
        </Typography>
        <Typography style={{ fontSize: '16px' }}>
          {isPublish
            ? `You're ready to publish ${adsCount} Ads. Please double-check everything to ensure it's all set before you confirm.`
            : `You're unpublishing the campaign. This will make all ads inactive. Please double-check everything before you confirm.`}
        </Typography>
      </Flex>
    </CustomModal>
  );
}
