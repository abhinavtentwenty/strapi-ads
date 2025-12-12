// @ts-nocheck
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/charts';
import React from 'react';
import { useTheme } from '@strapi/design-system';
import { format, parseISO } from 'date-fns';
import { Typography } from '@strapi/design-system';
import styled from 'styled-components';

const chartConfig = {
  impressions: {
    label: 'Impressions',
    color: '#104EF5',
  },
  clicks: {
    label: 'Clicks',
    color: '#008B7E',
  },
};

// Styled wrapper for tooltip with white text
const StyledTooltipContent = styled(ChartTooltipContent)`
  /* Background and border */
  background-color: ${({ theme }) => theme.colors.neutral100} !important;
  border: 1px solid ${({ theme }) => theme.colors.neutral150} !important;
  border-radius: 4px !important;

  /* Force white text color on all elements */
  color: ${({ theme }) => theme.colors.neutral0} !important;

  /* Target specific recharts tooltip classes */
  .recharts-tooltip-item-name,
  .recharts-tooltip-item-value,
  .recharts-tooltip-label,
  .recharts-tooltip-item {
    color: ${({ theme }) => theme.colors.neutral800} !important;
  }

  /* Universal selector for all children */
  * {
    color: ${({ theme }) => theme.colors.neutral800} !important;
  }

  /* Target any div inside */
  div {
    color: ${({ theme }) => theme.colors.neutral800} !important;
  }

  /* Target any span inside */
  span {
    color: ${({ theme }) => theme.colors.neutral800} !important;
  }
`;

const formatChartData = (apiData) => {
  if (!Array.isArray(apiData)) return [];

  return apiData
    .map((item) => {
      try {
        if (!item?.attributes?.stat_date) {
          console.warn('Missing stat_date in item:', item);
          return null;
        }

        return {
          date: format(parseISO(item.attributes.stat_date), 'MMM d'),
          impressions: Number(item.attributes.impressions) || 0,
          clicks: Number(item.attributes.clicks) || 0,
        };
      } catch (error) {
        console.error('Error formatting chart data:', error, item);
        return null;
      }
    })
    .filter(Boolean);
};

const PerformanceAnalytics = ({ data }) => {
  const chartData = formatChartData(data);

  if (!chartData.length) {
    return (
      <ChartContainer className="h-[350px] w-full" config={chartConfig}>
        <Typography className="flex items-center justify-center h-full text-neutral500">
          No analytics data available
        </Typography>
      </ChartContainer>
    );
  }
  return (
    <ChartContainer className="h-[350px] w-full" config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 0,
          right: 20,
        }}
      >
        <CartesianGrid vertical={true} horizontal={false} strokeDasharray="2 2" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={{ stroke: '#C0C0C0', strokeDasharray: '2 2' }}
          tickMargin={8}
          tickFormatter={(value) => (value ? value.slice(0, 6) : '')}
          tick={{ fontSize: 10 }}
        />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
        <ChartTooltip
          cursor={{
            stroke: '#32324d',
            strokeWidth: 3,
          }}
          content={<StyledTooltipContent indicator="dot" hideLabel />}
        />
        <Area
          dataKey="impressions"
          type="linear"
          fill={chartConfig.impressions.color}
          fillOpacity={0}
          stroke={chartConfig.impressions.color}
          strokeWidth={2}
          dot={{ r: 5, fill: chartConfig.impressions.color, fillOpacity: 1 }}
        />
        <Area
          dataKey="clicks"
          type="linear"
          fill={chartConfig.clicks.color}
          fillOpacity={0}
          stroke={chartConfig.clicks.color}
          strokeWidth={2}
          dot={{ r: 5, fill: chartConfig.clicks.color, fillOpacity: 1 }}
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default PerformanceAnalytics;
