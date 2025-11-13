// @ts-nocheck
import '../../global.css';
import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import qs from 'qs';
import { useForm } from 'react-hook-form';
import {
  Button,
  Dots,
  NextLink,
  PageLink,
  Pagination,
  PreviousLink,
  Searchbar,
  SingleSelect,
  SingleSelectOption,
  MultiSelect,
  MultiSelectOption,
  Box,
  Flex,
  Typography,
  TabGroup,
  Tabs,
  TabPanels,
  TabPanel,
} from '@strapi/design-system';

import { Plus, List, Calendar } from '@strapi/icons';

import { useState } from 'react';
import useCampaigns from '../../components/hooks/useCampaigns';
// import { useDebounce } from "../utils/useDebounce";
import TabButton from '../../components/elements/tabButton';

import ListView from './listView';
import TimelineView from './timelineView';

const Dashboard = () => {
  /**
   * ===============================
   * STATE DECLARATIONS
   * All state variables used in the Dashboard component are grouped here for clarity and maintainability.
   * ===============================
   */
  const [status, setStatus] = useState(['all']);
  const [type, setType] = useState('all');
  const [time, setTime] = useState('all');

  const [search, setSearch] = useState('');
  // const debouncedSearch = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const location = useLocation();
  const history = useHistory();

  const params = qs.parse(location.search, { ignoreQueryPrefix: true });
  const activeTab = Number(params.tab) || 0;

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
  });

  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.pageCount || 1;
  const paginatedCampaigns = campaigns;

  const TrStyles = 'text-xl text-[#62627B] uppercase font-bold';
  const TdStyles = 'text-2xl';

  useEffect(() => {
    if (currentPage > totalPages) setPage(1);
  }, [totalPages]);

  return (
    <section className="py-16 !w-full overflow-hidden">
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
                <Button variant="tertiary" size="L" startIcon={<List />} style={{ width: '100%' }}>
                  <Typography fontWeight="bold">List view</Typography>
                </Button>
              </TabButton>
              <TabButton>
                <Button
                  variant="tertiary"
                  size="L"
                  startIcon={<Calendar />}
                  style={{ width: '100%' }}
                >
                  <Typography style={{ whiteSpace: 'nowrap' }} fontWeight="bold">
                    Timeline View
                  </Typography>
                </Button>
              </TabButton>
            </Tabs>
            <Button size="L" variant="tertiary" onClick={() => history.push('custom-ui/campaign')}>
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
              <Typography variant="beta" fontWeight="bold" textColor="neutral900">
                All campaigns
              </Typography>
              <Flex gap={3} wrap="wrap" alignItems="center">
                <Searchbar
                  name="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onClear={() => setSearch('')}
                  clearLabel="Clear search"
                  placeholder="Search..."
                >
                  <></>
                </Searchbar>
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
                <SingleSelect value={time} onChange={(value) => setTime(String(value))} size="S">
                  <SingleSelectOption value="all">All Time</SingleSelectOption>
                  <SingleSelectOption value="banner">Banner</SingleSelectOption>
                  <SingleSelectOption value="video">Video</SingleSelectOption>
                </SingleSelect>
              </Flex>
            </Flex>
          </div>

          <TabPanels>
            <TabPanel>
              <ListView paginatedCampaigns={paginatedCampaigns} />
            </TabPanel>
            <TabPanel>
              <TimelineView paginatedCampaigns={paginatedCampaigns} />
            </TabPanel>
          </TabPanels>
        </Box>
        {/* Display per page selector */}
        <Flex alignItems="center" justifyContent="space-between" marginTop={6}>
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
