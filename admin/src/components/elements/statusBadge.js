import React from 'react';
import { Badge } from '@strapi/design-system';

const StatusBadge = ({ status }) => {
  return (
    <Badge
      width="fit-content"
      backgroundColor={
        status === 'live' || status === 'active'
          ? 'success100'
          : status === 'draft'
            ? 'neutral100'
            : status === 'inactive'
              ? 'warning100'
              : status === 'expired' || status === 'archived'
                ? 'danger100'
                : ''
      }
      textColor={
        status === 'live' || status === 'active'
          ? 'success500'
          : status === 'draft'
            ? 'neutral600'
            : status === 'inactive'
              ? 'warning500'
              : status === 'expired' || status === 'archived'
                ? 'danger500'
                : ''
      }
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;
