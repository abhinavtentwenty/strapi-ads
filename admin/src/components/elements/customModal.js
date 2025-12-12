import { Button, ModalBody, ModalFooter, ModalHeader, ModalLayout } from '@strapi/design-system';
import * as React from 'react';
import styled from 'styled-components';

const HighZIndexModal = styled(ModalLayout)`
  & > div {
    /* ModalWrapper */
    z-index: 9999 !important;
  }
`;

export default function CustomModal({
  isOpen,
  setIsOpen,
  onSubmit,
  children,
  label,
  disabled = false,
  endActionOkayLabel = false,
}) {
  return (
    <>
      {isOpen && (
        <HighZIndexModal
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
              <Button disabled={disabled} variant="primary" onClick={onSubmit}>
                {endActionOkayLabel ? 'Okay' : 'Confirm'}
              </Button>
            }
          />
        </HighZIndexModal>
      )}
    </>
  );
}
