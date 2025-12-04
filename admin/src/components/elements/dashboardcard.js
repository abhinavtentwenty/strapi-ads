import { Flex, GridItem, Typography } from '@strapi/design-system';
import React from 'react';

const DashboardCard = ({ data }) => {
  const showDelta = data.delta !== 0 && Math.abs(data.delta) !== Math.abs(data.total);
  const isPositive = data.delta > 0;

  return (
    <GridItem
      col={3}
      background="neutral0"
      hasRadius
      shadow="tableShadow"
      padding={4}
      style={{ minHeight: 128 }}
      className="flex flex-col gap-2.5 size-full"
    >
      <Flex justifyContent="space-between" alignItems="unset">
        <Typography variant="pi" textColor="neutral500" fontWeight="bold" textTransform="uppercase">
          {data.label}
        </Typography>
      </Flex>
      <Typography variant="alpha" fontWeight="bold" as="p">
        {data.total}
        {data?.type === 'ctr' ? '%' : ''}
      </Typography>
      {showDelta && (
        <Typography
          variant="omega"
          fontWeight="bold"
          textColor={isPositive ? 'success500' : 'danger500'}
          textTransform="uppercase"
        >
          {`${isPositive ? '+' : ''}${data.delta} ${data.text}`}
        </Typography>
      )}
    </GridItem>
  );
};

export default DashboardCard;
