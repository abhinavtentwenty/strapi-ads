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
  Pagination,
  PreviousLink,
  PageLink,
  Dots,
  NextLink,
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
  const [status, setStatus] = React.useState(['']);
  const [type, setType] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [dateRange, setDateRange] = React.useState(''); // Default to empty string for "All Time"

  const { stats } = useAdModuleStats({ page, pageSize, dateRange }); // Pass dateRange to stats hook too
  const { overallGraph, pagination, isLoading } = useOverallGraph({ page, pageSize, dateRange });

  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.pageCount || 1;

  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setPage(1);
  }, [totalPages, currentPage]);

  // Reset to page 1 when dateRange changes
  React.useEffect(() => {
    setPage(1);
  }, [dateRange]);

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
              <BreadcrumbItem
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  history.push('campaigns');
                }}
              >
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
          <Button
            variant="tertiary"
            onClick={(e) => {
              history.push('campaigns');
            }}
            size="L"
          >
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
            {/* <MultiSelect value={status} onChange={(value) => setStatus(value)} size="S">
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
            </SingleSelect> */}
            <SingleSelect
              value={dateRange}
              onChange={(value) => {
                setDateRange(String(value));
              }}
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
        <Flex style={{ marginTop: 8, width: '100% !important' }} gap={4}>
          {stats?.length > 0 && stats?.map((stat) => <DashboardCard key={stat.type} data={stat} />)}
        </Flex>
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
                    backgroundColor: '#104EF5',
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
            {isLoading ? (
              <Typography textAlign="center" padding={4}>
                Loading...
              </Typography>
            ) : (
              <PerformanceAnalytics data={overallGraph} />
            )}
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
          <Box padding={4} marginTop={4} style={{ maxHeight: '384px' }}>
            {isLoading ? (
              <Typography textAlign="center" padding={4}>
                Loading...
              </Typography>
            ) : (
              <ClickThroughRateTrend data={overallGraph} />
            )}
          </Box>
        </Box>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          marginTop={6}
          style={{ position: 'relative', zIndex: 50 }}
        >
          <Flex alignItems="center" gap={2}>
            <SingleSelect
              value={String(pageSize)}
              onChange={(value) => {
                setPageSize(Number(value));
                setPage(1);
              }}
              size="S"
            >
              <SingleSelectOption value={10}>10</SingleSelectOption>
              <SingleSelectOption value={20}>20</SingleSelectOption>
              <SingleSelectOption value={50}>50</SingleSelectOption>
              <SingleSelectOption value={100}>100</SingleSelectOption>
            </SingleSelect>
            <Typography variant="pi" textColor="neutral600" className="mr-2">
              Entries per page:
            </Typography>
          </Flex>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="w-min float-end mt-6">
              <Pagination activePage={currentPage} pageCount={totalPages}>
                <PreviousLink
                  as="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setPage(currentPage - 1);
                  }}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  Previous
                </PreviousLink>
                {(() => {
                  const links = [];
                  let start = Math.max(1, page - 2);
                  let end = Math.min(totalPages, page + 2);
                  if (start > 1) {
                    links.push(
                      <PageLink
                        key={1}
                        number={1}
                        as="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(1);
                        }}
                      >
                        1
                      </PageLink>
                    );
                    if (start > 2) links.push(<Dots key="dots-start">...</Dots>);
                  }
                  for (let i = start; i <= end; i++) {
                    links.push(
                      <PageLink
                        key={i}
                        number={i}
                        as="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(i);
                        }}
                        aria-current={i === currentPage ? 'page' : undefined}
                      >
                        {i}
                      </PageLink>
                    );
                  }
                  if (end < totalPages) {
                    if (end < totalPages - 1) links.push(<Dots key="dots-end">...</Dots>);
                    links.push(
                      <PageLink
                        key={totalPages}
                        number={totalPages}
                        as="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(totalPages);
                        }}
                      >
                        {totalPages}
                      </PageLink>
                    );
                  }
                  return links;
                })()}
                <NextLink
                  as="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setPage(currentPage + 1);
                  }}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  Next
                </NextLink>
              </Pagination>
            </div>
          )}
        </Flex>
      </Flex>
    </div>
  );
};

export default CampaignAnalyticsReport;
