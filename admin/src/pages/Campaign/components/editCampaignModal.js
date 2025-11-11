import * as React from 'react';
import CustomModal from '../../../components/elements/customModal';

export default function EditCampaignModal({ isOpen, setIsOpen, onSubmit, adsCount }) {
  return (
    <CustomModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onSubmit={onSubmit}
      label="edit-campaign-title"
    >
      <h3 style={{ marginBottom: '0.5rem', fontWeight: 700, fontSize: '22px' }}>
        Publish Changes?
      </h3>
      <p style={{ fontSize: '16px' }}>
        You're ready to publish {adsCount} Ads. Please double-check everything to ensure it's all
        set before you confirm.
      </p>
    </CustomModal>
  );
}
