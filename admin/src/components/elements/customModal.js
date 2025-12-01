import * as React from 'react';
import { Button, ModalLayout, ModalHeader, ModalBody, ModalFooter } from '@strapi/design-system';

export default function CustomModal({ isOpen, setIsOpen, onSubmit, children, label }) {
  return (
    <>
      {isOpen && (
        <ModalLayout
          width="32rem"
          maxWidth="90%"
          onClose={() => setIsOpen(false)}
          labelledBy={label}
        >
          <ModalHeader closeLabel="Close modal">
            <span></span>{' '}
          </ModalHeader>

          <ModalBody style={{ textAlign: 'center', padding: '62px 25px' }}>{children}</ModalBody>

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
