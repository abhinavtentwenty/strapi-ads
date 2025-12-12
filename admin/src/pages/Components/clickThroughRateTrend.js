// @ts-nocheck
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/charts';
import React from 'react';
import { useTheme } from '@strapi/design-system';
import { format, parseISO } from 'date-fns';
import { Typography } from '@strapi/design-system';
import styled from 'styled-components';

const chartConfig = {
  ctr: {
    label: 'CTR',
    color: '#104EF5',
  },
};

const StyledTooltipContent = styled(ChartTooltipContent)`
  background-color: ${({ theme }) => theme.colors.neutral100} !important;
  border: 1px solid ${({ theme }) => theme.colors.neutral150} !important;
  border-radius: 4px !important;
  color: ${({ theme }) => theme.colors.neutral0} !important;

  /* Target the label text */
  .recharts-tooltip-item-name,
  .recharts-tooltip-item-value,
  .recharts-tooltip-label {
    color: ${({ theme }) => theme.colors.neutral800} !important;
  }

  /* Target all text inside tooltip */
  * {
    color: ${({ theme }) => theme.colors.neutral800} !important;
  }
`;

const formatCTRChartData = (apiData) => {
  if (!Array.isArray(apiData)) return [];

  return apiData
    .map((item) => {
      try {
        const { stat_date, impressions, clicks } = item?.attributes || {};

        if (!stat_date || isNaN(Date.parse(stat_date))) {
          console.warn('Missing stat_date in item:', item);
          return null;
        }

        const impressionNum = Number(impressions) || 0;
        const clickNum = Number(clicks) || 0;
        const ctr = impressionNum > 0 ? (clickNum / impressionNum) * 100 : 0;

        return {
          date: format(parseISO(stat_date), 'MMM d'),
          ctr: Number(ctr.toFixed(2)),
        };
      } catch (error) {
        console.error('Error formatting CTR data:', error, item);
        return null;
      }
    })
    .filter(Boolean);
};

const ClickThroughRateTrend = ({ data }) => {
  const chartData = formatCTRChartData(data);

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

        {/* Tooltip */}
        <ChartTooltip
          cursor={{
            stroke: '#32324d',
            strokeWidth: 3,
          }}
          content={
            <StyledTooltipContent
              indicator="dot"
              hideLabel
              formatter={(value) => `CTR ${value}%`}
            />
          }
        />
        <Area
          dataKey="ctr"
          type="linear"
          fill={chartConfig.ctr.color}
          fillOpacity={0}
          stroke={chartConfig.ctr.color}
          strokeWidth={2}
          dot={{ r: 5, fill: chartConfig.ctr.color, fillOpacity: 1 }}
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default ClickThroughRateTrend;
