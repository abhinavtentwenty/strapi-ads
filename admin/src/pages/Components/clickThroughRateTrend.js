// @ts-nocheck
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/charts';
import React from 'react';
import { useTheme } from '@strapi/design-system';
import { format, parseISO } from 'date-fns';

const chartConfig = {
  ctr: {
    label: 'CTR',
    color: '#104EF5',
  },
};

const formatCTRChartData = (apiData) => {
  if (!Array.isArray(apiData)) return [];
  return apiData.map((item) => {
    const { stat_date, impressions, clicks } = item.attributes;
    const ctr = Number(impressions) > 0 ? (Number(clicks) / Number(impressions)) * 100 : 0;
    return {
      date: format(parseISO(stat_date), 'MMM d'),
      ctr: Number(ctr.toFixed(2)),
    };
  });
};

const ClickThroughRateTrend = ({ data }) => {
  const theme = useTheme();
  const chartData = formatCTRChartData(data);

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
