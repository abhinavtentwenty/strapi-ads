import { Flex, GridItem, Typography } from '@strapi/design-system';
import React from 'react';

const DashboardCard = ({
  data = { title: 'Total Campaigns', currentValue: 150, isPositive: true, differenceValue: null },
}) => {
  const { title, currentValue, isPositive, differenceValue } = data;
  return (
    <GridItem
      col={3}
      background="neutral0"
      hasRadius
      shadow="tableShadow"
      padding={4}
      className="flex flex-col gap-2.5"
    >
      <Flex justifyContent="space-between" alignItems="unset">
        <Typography variant="pi" textColor="neutral500" fontWeight="bold" textTransform="uppercase">
          {title}
        </Typography>
      </Flex>
      <Typography variant="alpha" fontWeight="bold" as="p">
        {currentValue}
      </Typography>
      {differenceValue && (
        <Typography
          variant="delta"
          fontWeight="bold"
          textColor={isPositive ? 'success500' : 'danger500'}
          textTransform="uppercase"
        >
          {isPositive ? `+${differenceValue} since Last week` : `-${differenceValue} vs last week`}
        </Typography>
      )}
    </GridItem>
  );
};

export default DashboardCard;
