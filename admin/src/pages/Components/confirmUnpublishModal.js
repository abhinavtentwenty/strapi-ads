import * as React from 'react';
import CustomModal from '../../components/elements/customModal';

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
      <h3 style={{ marginBottom: '0.5rem', fontWeight: 700, fontSize: '22px' }}>
        Unpublish {variant === 'ads' ? 'Ad' : 'Campaign'}?
      </h3>
      <p style={{ fontSize: '16px' }}>
        {variant === 'ads'
          ? 'This will unpublish the selected ad, making it inactive and no longer visible.'
          : 'The campaign will be paused and all 4 Ads will no longer be active or visible to your audience. You can republish it anytime.'}
      </p>
    </CustomModal>
  );
}
