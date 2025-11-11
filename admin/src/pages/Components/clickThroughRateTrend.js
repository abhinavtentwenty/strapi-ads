//@ts-nocheck
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/charts';
import React from 'react';
import { useTheme } from '@strapi/design-system';

const chartData = [
  { date: 'Jan 1', ctr: 1.5 },
  { date: 'Jan 2', ctr: 2.0 },
  { date: 'Jan 3', ctr: 1.5 },
  { date: 'Jan 4', ctr: 4.5 },
  { date: 'Jan 5', ctr: 1.3 },
  { date: 'Jan 6', ctr: 1.4 },
];

const chartConfig = {
  ctr: {
    label: 'CTR',
    color: '#104EF5',
  },
};

const ClickThroughRateTrend = () => {
  const theme = useTheme();
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
          tickFormatter={(value) => value.slice(0, 6)}
          tick={{ fontSize: 10 }}
        />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />

        {/* Tooltip */}
        <ChartTooltip
          cursor={{
            stroke: theme.colors.neutral900,
            strokeWidth: 3,
          }}
          content={
            <ChartTooltipContent indicator="dot" hideLabel formatter={(value) => `CTR ${value}%`} />
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
