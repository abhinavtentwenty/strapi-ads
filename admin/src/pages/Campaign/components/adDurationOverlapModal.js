import * as React from 'react';
import { Button, ModalLayout, ModalHeader, ModalBody, ModalFooter } from '@strapi/design-system';

export default function adDurationOverlapModal({ isOpen, setIsOpen, onSubmit }) {
  return (
    <>
      {/* Modal */}
      {isOpen && (
        <ModalLayout
          width="32rem"
          maxWidth="90%"
          onClose={() => setIsOpen(false)}
          labelledBy="create-campaign-title"
        >
          <ModalHeader closeLabel="Close modal">
            <span></span>{' '}
          </ModalHeader>

          <ModalBody style={{ textAlign: 'center', padding: '62px 25px' }}>
            <h3 style={{ marginBottom: '0.5rem', fontWeight: 700, fontSize: '22px' }}>
              Ad Duration Overlap! Cannot Publish This Ad
            </h3>
            <p style={{ fontSize: '16px', marginBottom: '0.5rem' }}>
              Already an ad running for the same "AD Spot" during the date range provided. Please
              refer to the timeline view to adjust the dates.
            </p>
            <p>Campaign Name : Tourism</p>
            <p>Ad Name : XYZ Ad</p>
            <p>Ad type : Business listing : News, Events.</p>
            <p>Duration : 10 Aug - 1 Sep 25</p>
          </ModalBody>

          <ModalFooter
            startActions={
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            }
            endActions={
              <Button variant="primary" onClick={onSubmit}>
                Confirm
              </Button>
            }
          />
        </ModalLayout>
      )}
    </>
  );
}
