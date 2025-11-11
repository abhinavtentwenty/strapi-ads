//@ts-nocheck
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../ui/charts';
import React from 'react';
import { useTheme } from '@strapi/design-system';

const chartData = [
  { month: 'January', impressions: 186, clicks: 120 },
  { month: 'February', impressions: 305, clicks: 200 },
  { month: 'March', impressions: 237, clicks: 150 },
  { month: 'April', impressions: 73, clicks: 45 },
  { month: 'May', impressions: 209, clicks: 135 },
  { month: 'June', impressions: 214, clicks: 140 },
];

const chartConfig = {
  impressions: {
    label: 'Impressions',
    color: 'var(--chart-1)',
  },
  clicks: {
    label: 'Clicks',
    color: 'var(--chart-2)',
  },
};

export function ChartAreaLinear() {
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
          dataKey="month"
          tickLine={false}
          axisLine={{ stroke: '#C0C0C0', strokeDasharray: '2 2' }}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
          tick={{ fontSize: 10 }}
        />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
        <ChartTooltip
          cursor={{
            stroke: theme.colors.neutral900, // Strapi black color
            strokeWidth: 3,
          }}
          content={<ChartTooltipContent indicator="dot" hideLabel />}
        />
        <Area
          dataKey="impressions"
          type="linear"
          fill="var(--color-impressions)"
          fillOpacity={0}
          stroke="var(--color-impressions)"
          strokeWidth={2}
          dot={{ r: 5, fill: 'var(--color-impressions)', fillOpacity: 1 }}
        />
        <Area
          dataKey="clicks"
          type="linear"
          fill="var(--color-clicks)"
          fillOpacity={0}
          stroke="var(--color-clicks)"
          strokeWidth={2}
          dot={{ r: 5, fill: 'var(--color-clicks)', fillOpacity: 1 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}
