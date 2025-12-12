// @ts-nocheck
import {
  Box,
  Button,
  Dots,
  Flex,
  MultiSelect,
  MultiSelectOption,
  NextLink,
  PageLink,
  Pagination,
  PreviousLink,
  Searchbar,
  SingleSelect,
  SingleSelectOption,
  TabGroup,
  TabPanel,
  TabPanels,
  Tabs,
  Typography,
} from '@strapi/design-system';
import qs from 'qs';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import '../../global.css';

import { Calendar, List, Plus } from '@strapi/icons';

import { useState } from 'react';
import useCampaigns from '../../components/hooks/useCampaigns';
// import { useDebounce } from "../utils/useDebounce";
import TabButton from '../../components/elements/tabButton';

import { useFetchClient } from '@strapi/helper-plugin';
import useAdType from '../../components/hooks/useAdType';
import pluginId from '../../pluginId';
import { CAMPAIGN_STATUS_OPTIONS, TIMEFRAME_OPTIONS } from '../../utils/constants';
import getTimeframeDate from '../../utils/getTimeframeDate';
import ExportReportCsvModal from '../Campaign/components/exportReportCsvModal';
import ListView from './listView';
import TimelineView from './timelineView';

const Dashboard = () => {
  /**
   * ===============================
   * STATE DECLARATIONS
   * All state variables used in the Dashboard component are grouped here for clarity and maintainability.
   * ===============================
   */
  const { get } = useFetchClient();

  const { adTypes } = useAdType();
  const [status, setStatus] = useState(['']);
  const [type, setType] = useState('');
  const [time, setTime] = useState('');
  const [sort, setSort] = useState({ field: 'campaign_name', order: 'ASC' });

  const [search, setSearch] = useState('');
  // const debouncedSearch = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isOpenExportReportCsvModal, setIsOpenExportReportCsvModal] = React.useState(false);

  const location = useLocation();
  const history = useHistory();

  const params = qs.parse(location.search, { ignoreQueryPrefix: true });
  const activeTab = Number(params.tab) || 0;

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.getElementById('strapi');
    if (!root) return;
    const className = 'is-campaign-page';
    root.classList.add(className);
    return () => root.classList.remove(className);
  }, []);

  useEffect(() => {
    if (activeTab !== 0) return;
    const pageWrapper = document.querySelector('.page-wrapper');
    const target = pageWrapper?.parentElement?.parentElement;
    const className = 'adgm-dashboard-wrapper';

    if (target) target.classList.add(className);

    return () => {
      if (target) target.classList.remove(className);
    };
  }, []);

  const handleTabChange = (index) => {
    const newParams = { ...params, tab: index };
    history.replace({
      pathname: location.pathname,
      search: qs.stringify(newParams, { addQueryPrefix: true }),
    });
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { campaigns, pagination, isLoading, isError } = useCampaigns({
    page,
    pageSize,
    status,
    type,
    time,
    search,
    sort,
  });

  const handleSortChange = (field) => {
    setSort((prevSort) => ({
      field,
      order: prevSort.field === field ? (prevSort.order === 'ASC' ? 'DESC' : 'ASC') : 'ASC',
    }));
    setPage(1);
  };

  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.pageCount || 1;
  const paginatedCampaigns = campaigns;

  const TrStyles = 'text-xl text-[#62627B] uppercase font-bold';
  const TdStyles = 'text-2xl';

  useEffect(() => {
    if (currentPage > totalPages) setPage(1);
  }, [totalPages]);

  const handleDownloadCSV = async () => {
    try {
      const cleanStatus = status.filter(Boolean);
      const timeframeDate = getTimeframeDate(time);

      const query = qs.stringify(
        {
          filters: {
            ...(type !== '' && { ads: { ad_type: type } }),
            ...(cleanStatus?.length > 0 && { campaign_status: cleanStatus }),
            ...(search && { campaign_name: { $containsi: search } }),
            ...(timeframeDate && {
              createdAt: { $gte: timeframeDate.toISOString() },
            }),
          },
        },
        { encodeValuesOnly: true }
      );

      const response = await get(`/${pluginId}/campaign/generate-report?${query}`);
      window.open(response?.data?.downloadUrl, '_blank');
      setIsOpenExportReportCsvModal(false);
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };
  return (
    <section className="py-16 !w-full overflow-hidden page-wrapper">
      <ExportReportCsvModal
        isOpen={isOpenExportReportCsvModal}
        setIsOpen={setIsOpenExportReportCsvModal}
        onSubmit={handleDownloadCSV}
      />
      <TabGroup
        label="Manage your attribute"
        selectedTabIndex={activeTab}
        onTabChange={handleTabChange}
      >
        <div className="flex items-center justify-between mb-10">
          <Flex direction="column" alignItems="flex-start" gap={2}>
            <Typography variant="alpha" className="h1 font-semibold" textColor="neutral900">
              Campaign Management
            </Typography>
            <Typography variant="delta" className="text-2xl" textColor="neutral600">
              ADGM / Campaign Management
            </Typography>
          </Flex>
          <Flex gap={2}>
            <Tabs>
              <TabButton>
                <Button
                  variant="tertiary"
                  size="L"
                  startIcon={<List />}
                  style={{
                    width: '100%',
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                >
                  <Typography fontWeight="bold">List view</Typography>
                </Button>
              </TabButton>
              <TabButton>
                <Button
                  style={{ borderTopRightRadius: 0 }}
                  variant="tertiary"
                  size="L"
                  startIcon={<Calendar />}
                  style={{
                    width: '100%',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    marginLeft: -2,
                  }}
                >
                  <Typography style={{ whiteSpace: 'nowrap' }} fontWeight="bold">
                    Timeline View
                  </Typography>
                </Button>
              </TabButton>
            </Tabs>
            <Button size="L" variant="tertiary" onClick={() => setIsOpenExportReportCsvModal(true)}>
              Export CSV
            </Button>
            <Button
              size="L"
              startIcon={<Plus />}
              variant="default"
              onClick={() => history.push('campaigns/create')}
            >
              Create
            </Button>
          </Flex>
        </div>
        <Box className background="neutral0" hasRadius marginTop={6}>
          <div className="!p-6">
            {/* All campaigns row with filters */}
            <Flex
              direction="row"
              className="p-5"
              justifyContent="space-between"
              alignItems="center"
              gap={4}
            >
              <Typography
                variant="beta"
                style={{ fontSize: '1.4rem' }}
                fontWeight="bold"
                textColor="neutral900"
              >
                All campaigns
              </Typography>
              <Flex gap={3} wrap="wrap" alignItems="center">
                <Searchbar
                  name="search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1); // Reset page to 1 when search changes
                  }}
                  onClear={() => {
                    setSearch('');
                    setPage(1); // Reset page to 1 when search is cleared
                  }}
                  clearLabel="Clear search"
                  placeholder="Search..."
                >
                  <></>
                </Searchbar>
                <MultiSelect
                  value={status}
                  onChange={(value) => {
                    setStatus(value);
                    setPage(1); // Reset page to 1 when status filter changes
                  }}
                  customizeContent={(value) =>
                    value
                      .map((v) => CAMPAIGN_STATUS_OPTIONS.find((opt) => opt.value === v)?.label)
                      .join(', ')
                  }
                >
                  {CAMPAIGN_STATUS_OPTIONS.map((status) => (
                    <MultiSelectOption key={status.value} value={status.value}>
                      {status.label}
                    </MultiSelectOption>
                  ))}
                </MultiSelect>
                <SingleSelect
                  value={type}
                  onChange={(value) => {
                    setType(String(value));
                    setPage(1); // Reset page to 1 when type filter changes
                  }}
                >
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
                  value={time}
                  onChange={(value) => {
                    setTime(String(value));
                    setPage(1); // Reset page to 1 when time filter changes
                  }}
                >
                  {TIMEFRAME_OPTIONS.map((timeframe) => (
                    <SingleSelectOption key={timeframe?.value} value={timeframe?.value}>
                      {timeframe?.label}
                    </SingleSelectOption>
                  ))}
                </SingleSelect>
              </Flex>
            </Flex>
          </div>

          <TabPanels>
            <TabPanel>
              <ListView
                paginatedCampaigns={paginatedCampaigns}
                handleSortChange={handleSortChange}
                isLoading={isLoading}
                sort={sort}
                filters={{
                  page,
                  pageSize,
                  status,
                  type,
                  time,
                  search,
                  sort,
                }}
              />
            </TabPanel>
            <TabPanel>
              <TimelineView
                paginatedCampaigns={paginatedCampaigns}
                isLoading={isLoading}
                filters={{
                  page,
                  pageSize,
                  status,
                  type,
                  time,
                  search,
                  sort,
                }}
              />
            </TabPanel>
          </TabPanels>
        </Box>
        {/* Display per page selector */}
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
                {/* Render page links dynamically, show up to 5 pages with Dots if needed */}
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
      </TabGroup>
    </section>
  );
};

export default Dashboard;
