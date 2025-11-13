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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../../../components/ui/breadcrumb';

import BackButton from '../../../components/elements/backButton';
import DashboardCard from '../../../components/elements/dashboardcard';
import PerformanceAnalytics from '../../Components/performanceAnalytics';
import ClickThroughRateTrend from '../../Components/clickThroughRateTrend';
import ExportReportCsvModal from '../components/exportReportCsvModal';

const DummyData = [
  {
    id: 1,
    title: 'Total Campaigns',
    currentValue: 13,
    isPositive: false,
    differenceValue: 100,
  },
  {
    id: 2,
    title: 'Active Ads',
    currentValue: 30,
    isPositive: false,
    differenceValue: 100,
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

const CampaignAnalyticsReport = () => {
  const [status, setStatus] = React.useState(['all']);
  const [type, setType] = React.useState('all');
  const [dateRange, setDateRange] = React.useState('last_7_days');
  const [isOpenExportReportCsvModal, setIsOpenExportReportCsvModal] = React.useState(false);
  const history = useHistory();

  return (
    <div>
      <ExportReportCsvModal
        isOpen={isOpenExportReportCsvModal}
        setIsOpen={setIsOpenExportReportCsvModal}
        onSubmit={() => {}}
      />
      {/* <BackButton /> */}
      <Flex justifyContent="space-between" alignItems="flex-end" style={{ marginBottom: '2rem' }}>
        <Flex direction="column" alignItems="flex-start">
          <Typography variant="alpha">Analytics & Reports</Typography>
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
                <BreadcrumbLink>Analytics & Report</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Flex>
        <Flex gap={2}>
          <Button variant="tertiary" onClick={(e) => {}} size="L">
            View Campaign details
          </Button>
          <Button
            variant="tertiary"
            onClick={(e) => {
              setIsOpenExportReportCsvModal(true);
            }}
            size="L"
          >
            Download CSV
          </Button>
        </Flex>
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

export default CampaignAnalyticsReport;
