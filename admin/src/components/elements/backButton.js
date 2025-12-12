import React from 'react';
import { useHistory } from 'react-router-dom';

import { Typography, Flex } from '@strapi/design-system';
import BackArrow from '../Icons/BackArrow';

function BackButton() {
  const history = useHistory();

  return (
    <Flex
      // as="button"
      aria-label="Go back"
      style={{ cursor: 'pointer', marginBottom: '1rem' }}
      gap={2}
      onClick={(e) => {
        history.goBack();
      }}
    >
      <BackArrow />
      <Typography variant="epsilon" textColor="primary600">
        Back
      </Typography>
    </Flex>
  );
}

export default BackButton;
