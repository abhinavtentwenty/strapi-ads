// @ts-nocheck
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/charts';
import React from 'react';
import { useTheme } from '@strapi/design-system';
import { format, parseISO } from 'date-fns';

const chartConfig = {
  impressions: {
    label: 'Impressions',
    color: '#F93E00',
  },
  clicks: {
    label: 'Clicks',
    color: '#008B7E',
  },
};

const formatChartData = (apiData) => {
  if (!Array.isArray(apiData)) return [];
  return apiData.map((item) => ({
    date: format(parseISO(item.attributes.stat_date), 'MMM d'),
    impressions: Number(item.attributes.impressions),
    clicks: Number(item.attributes.clicks),
  }));
};

const PerformanceAnalytics = ({ data }) => {
  const theme = useTheme();
  const chartData = formatChartData(data);

  if (!chartData.length) {
    return (
      <ChartContainer className="h-[350px] w-full" config={chartConfig}>
        <div className="flex items-center justify-center h-full text-neutral500">
          No analytics data available
        </div>
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
          tickFormatter={(value) => value.slice(0, 6)}
          tick={{ fontSize: 10 }}
        />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
        <ChartTooltip
          cursor={{
            stroke: theme.colors.neutral900,
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
};

export default PerformanceAnalytics;
