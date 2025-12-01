// @ts-nocheck
import React, { useRef } from 'react';
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
import { AD_STATUS_OPTIONS, TIMEFRAME_OPTIONS } from '../../../utils/constants';
import useAdType from '../../../components/hooks/useAdType';
import useAdModuleStats from '../../../components/hooks/useAdModuleStats';
import useOverallGraph from '../../../components/hooks/useOverallGraph';
import useDownloadPdf from '../../../components/hooks/useDownloadPdf';

const CampaignAnalyticsReport = () => {
  const pdfRef = useRef();
  const downloadPdf = useDownloadPdf();
  const { adTypes } = useAdType();
  const { overallGraph } = useOverallGraph();
  const { stats } = useAdModuleStats();
  const [status, setStatus] = React.useState(['']);
  const [type, setType] = React.useState('');
  const [dateRange, setDateRange] = React.useState('');
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
            onClick={() => downloadPdf(pdfRef, 'Overall-Report.pdf')}
            size="L"
          >
            Download PDF
          </Button>
        </Flex>
      </Flex>
      <Flex
        ref={pdfRef}
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
              {AD_STATUS_OPTIONS.map((status) => (
                <MultiSelectOption key={status.value} value={status.value}>
                  {status.label}
                </MultiSelectOption>
              ))}
            </MultiSelect>
            <SingleSelect value={type} onChange={(value) => setType(String(value))} size="S">
              <SingleSelectOption key={0} value="">
                All Types
              </SingleSelectOption>
              {adTypes.map((type) => (
                <SingleSelectOption key={type?.id} value={type?.id}>
                  {type?.title}
                </SingleSelectOption>
              ))}
            </SingleSelect>
            <SingleSelect
              value={dateRange}
              onChange={(value) => setDateRange(String(value))}
              size="S"
            >
              {TIMEFRAME_OPTIONS.map((timeframe) => (
                <SingleSelectOption key={timeframe?.value} value={timeframe?.value}>
                  {timeframe?.label}
                </SingleSelectOption>
              ))}
            </SingleSelect>
          </Flex>
        </Flex>
        <Grid marginTop={8} gap={4}>
          {stats?.length > 0 && stats?.map((stat) => <DashboardCard key={stat.type} data={stat} />)}
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
            <PerformanceAnalytics data={overallGraph} />
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
            <ClickThroughRateTrend data={overallGraph} />
          </Box>
        </Box>
      </Flex>
    </div>
  );
};

export default CampaignAnalyticsReport;
