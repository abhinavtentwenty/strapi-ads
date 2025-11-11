// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  Typography,
  Flex,
  Button,
  Grid,
  Box,
  SingleSelect,
  SingleSelectOption,
  MultiSelect,
  MultiSelectOption,
} from '@strapi/design-system';
import { ArrowLeft } from '@strapi/icons';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../../components/ui/breadcrumb';

import { Badge } from '../../../components/elements/badge';
import DashboardCard from '../../../components/elements/dashboardcard';
import PerformanceAnalytics from '../../Components/performanceAnalytics';
import ClickThroughRateTrend from '../../Components/clickThroughRateTrend';
import { format } from 'date-fns';
import date from '../../../../../../../../helpers/date';

const DummyData = [
  {
    id: 2,
    title: 'active ads',
    currentValue: 3,
    // isPositive: false,
    // differenceValue: 100,
  },
  {
    id: 3,
    title: 'Total Impressions',
    currentValue: 500,
    isPositive: true,
    differenceValue: 50,
  },
  {
    id: 4,
    title: 'Total CLicks',
    currentValue: 500,
    isPositive: true,
    differenceValue: 50,
  },
  {
    id: 5,
    title: 'CTR',
    currentValue: 500,
    isPositive: true,
    differenceValue: 50,
  },
];

const CampaignReport = () => {
  const [status, setStatus] = React.useState(['all']);
  const [type, setType] = React.useState('all');
  const [dateRange, setDateRange] = React.useState('last_7_days');
  const history = useHistory();

  return (
    <div>
      <Flex
        as="button"
        style={{ cursor: 'pointer', marginBottom: '1rem' }}
        gap={2}
        onClick={(e) => {
          history.goBack();
        }}
      >
        <ArrowLeft stroke="primary600" fill="primary600" />
        <Typography variant="epsilon" textColor="primary600">
          Back
        </Typography>
      </Flex>
      <Flex justifyContent="space-between" alignItems="flex-end" style={{ marginBottom: '2rem' }}>
        <Flex direction="column" alignItems="flex-start">
          <Flex gap={2}>
            <p className="text-xs text-[#62627B] font-normal">
              {format(new Date('2025-12-01'), 'MM/dd/yy')} -{' '}
              {format(new Date('2024-12-31'), 'MM/dd/yy')}
            </p>
            {/* <Badge $variant={feature.status}>{feature.status}</Badge> */}
            <Badge $variant="live">Live</Badge>
          </Flex>
          <Typography variant="alpha">Tourism Q1</Typography>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">ADGM</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>Campaign Management </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>Tourism Q1</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>Report</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Flex>
        <Button variant="tertiary" onClick={(e) => {}} size="L">
          Download PDF
        </Button>
      </Flex>
      <Flex
        direction="column"
        alignItems="unset"
        gap={6}
        background="neutral0"
        padding={5}
        shadow="filterShadow"
        hasRadius
      >
        {/* All campaigns row with filters */}
        <Flex
          direction="row"
          className="p-5"
          justifyContent="space-between"
          alignItems="center"
          gap={4}
        >
          <Typography variant="beta" fontWeight="bold" textColor="neutral900">
            Overall Campaign Stats
          </Typography>
          <Flex gap={3} wrap="wrap" alignItems="center">
            <MultiSelect value={status} onChange={(value) => setStatus(value)} size="S">
              <MultiSelectOption value="all">All Statuses</MultiSelectOption>
              <MultiSelectOption value="active">Active</MultiSelectOption>
              <MultiSelectOption value="paused">Paused</MultiSelectOption>
            </MultiSelect>
            <SingleSelect value={type} onChange={(value) => setType(String(value))} size="S">
              <SingleSelectOption value="all">All Types</SingleSelectOption>
              <SingleSelectOption value="banner">Banner</SingleSelectOption>
              <SingleSelectOption value="video">Video</SingleSelectOption>
            </SingleSelect>
            <SingleSelect
              value={dateRange}
              onChange={(value) => setDateRange(String(value))}
              size="S"
            >
              <SingleSelectOption value="last_7_days">Last 7 Days</SingleSelectOption>
              <SingleSelectOption value="last_30_days">Last 30 Days</SingleSelectOption>
            </SingleSelect>
          </Flex>
        </Flex>
        <Grid marginTop={8} gap={4}>
          {DummyData.map((data) => (
            <DashboardCard key={data.id} data={data} />
          ))}
        </Grid>
        <Box padding={6} hasRadius background="neutral0" shadow="filterShadow">
          <Flex direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="beta" fontWeight="semi-bold" textColor="neutral900">
              Performance Analytics
            </Typography>
            <Flex direction="row" alignItems="center" gap={5}>
              <Flex gap={1} alignItems="center">
                <span
                  style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#F93E00',
                  }}
                ></span>
                <Typography
                  as="span"
                  variant="omega"
                  style={{ textTransform: 'uppercase', fontWeight: 500 }}
                >
                  Impressions
                </Typography>
              </Flex>
              <Flex gap={1} alignItems="center">
                <span
                  style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#008B7E',
                  }}
                ></span>
                <Typography
                  as="span"
                  variant="omega"
                  style={{ textTransform: 'uppercase', fontWeight: 500 }}
                >
                  Clicks
                </Typography>
              </Flex>
            </Flex>
          </Flex>
          <Box padding={4} marginTop={4} className="max-h-96">
            <PerformanceAnalytics />
          </Box>
        </Box>
        <Box padding={6} hasRadius background="neutral0" shadow="filterShadow">
          <Flex direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="beta" fontWeight="semi-bold" textColor="neutral900">
              Click Through Rate (CTR) Trend
            </Typography>
            <Flex direction="row" alignItems="center" gap={5}>
              <Flex gap={1} alignItems="center">
                <span
                  style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#104EF5',
                  }}
                ></span>
                <Typography
                  as="span"
                  variant="omega"
                  style={{ textTransform: 'uppercase', fontWeight: 500 }}
                >
                  CTR (%)
                </Typography>
              </Flex>
            </Flex>
          </Flex>
          <Box padding={4} marginTop={4} className="max-h-96">
            <ClickThroughRateTrend />
          </Box>
        </Box>
      </Flex>
    </div>
  );
};

export default CampaignReport;
