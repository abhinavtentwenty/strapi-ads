import * as React from 'react';
import CustomModal from '../../../components/elements/customModal';

export default function CreateCampaignModal({ isOpen, setIsOpen, onSubmit, adsCount }) {
  return (
    <CustomModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onSubmit={onSubmit}
      label="create-campaign-title"
    >
      <h3 style={{ marginBottom: '0.5rem', fontWeight: 700, fontSize: '22px' }}>
        Get Ready to Launch Campaign!
      </h3>
      <p style={{ fontSize: '16px' }}>
        You're ready to publish {adsCount} Ads. Please double-check everything to ensure it's all
        set before you confirm.
      </p>
    </CustomModal>
  );
}
