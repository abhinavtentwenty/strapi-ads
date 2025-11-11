import * as React from 'react';
import { Button, ModalLayout, ModalHeader, ModalBody, ModalFooter } from '@strapi/design-system';
import { CheckCircle } from '@strapi/icons';
import { toast } from 'sonner';

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
              <Button
                variant="primary"
                onClick={() => {
                  onSubmit(),
                    toast.success('Campaign Successfully Published!', {
                      icon: <CheckCircle color="success500" />,
                      position: 'top-center',
                      style: {
                        background: '#eafbe7',
                      },
                    });
                }}
              >
                Confirm
              </Button>
            }
          />
        </ModalLayout>
      )}
    </>
  );
}
