//@ts-nocheck
import '../../global.css';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Button,
  Dots,
  IconButton,
  MenuItem,
  NextLink,
  PageLink,
  Pagination,
  PreviousLink,
  Searchbar,
  SimpleMenu,
  SingleSelect,
  SingleSelectOption,
  MultiSelect,
  MultiSelectOption,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Badge,
  Box,
  Flex,
  Typography,
  Grid,
  GridItem,
  TabGroup,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
} from '@strapi/design-system';

import {
  CarretDown,
  ChevronDown,
  CrossCircle,
  Duplicate,
  Eye,
  More,
  Pencil,
  Play,
  Plus,
  Bell,
  List,
  Calendar,
} from '@strapi/icons';
// import { EmptyDocuments } from "@strapi/icons/symbols";
import qs from 'qs';
import { useState } from 'react';
// import { useNavigate } from "react-router-dom";
import useSWR from 'swr';
// import { campaigns } from '../../utils/campaings';
import useCampaigns from '../../components/hooks/useCampaign';
// import { CampaignEndpoints } from "../api/endpoints";
// import { useDebounce } from "../utils/useDebounce";

const DummyData = [
  {
    id: 1,
    title: 'Total Campaigns',
    currentValue: 150,
    isPositive: true,
    differenceValue: 2,
  },
  {
    id: 2,
    title: 'active ads',
    currentValue: 3000,
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

import ListView from './listView';
import TimelineView from './timelineView';
import AttributeTabs from './tabs';
import { cn } from '../../utils/utils';

const TrStyles = 'text-xl text-[#62627B] uppercase font-bold';
const TdStyles = 'text-2xl';
import styled from 'styled-components';
const Dashboard = () => {
  /**
   * ===============================
   * STATE DECLARATIONS
   * All state variables used in the Dashboard component are grouped here for clarity and maintainability.
   * ===============================
   */
  const [status, setStatus] = useState(['all']);
  const [type, setType] = useState('all');
  const [sitemap, setSitemap] = useState(null);
  const [sitemapError, setSitemapError] = useState('');
  const [search, setSearch] = useState('');
  // const debouncedSearch = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { campaigns, isLoading, isError } = useCampaigns();

  /**
   * ===============================
   * CONSTANTS
   * All constants used for styling and configuration are grouped here.
   * ===============================
   */
  const TrStyles = 'text-xl text-[#62627B] uppercase font-bold';
  const TdStyles = 'text-2xl';

  /**
   * ===============================
   * HOOKS & ENDPOINTS
   * Data fetching and navigation logic.
   * ===============================
   */
  const history = useHistory();

  // --- API data commented out ---
  // const filters = {};
  // const queryString = qs.stringify(
  //   debouncedSearch ? { q: debouncedSearch, filters } : { filters },
  //   { encode: false }
  // );
  // const endpoint = CampaignEndpoints.getAll(queryString);
  // const { data, error, isLoading } = useSWR(endpoint);
  // const campaigns = data?.data || [];
  // console.log("Campaigns data:", campaigns);

  const totalPages = Math.ceil(campaigns.length / pageSize);
  const paginatedCampaigns = campaigns.slice((page - 1) * pageSize, page * pageSize);

  /**
   * ===============================
   * FUNCTIONS & COMPONENTS
   * All helper functions and sub-components are grouped here for organization.
   * ===============================
   */

  const TabButton = styled(Tab)`
    padding: 0; /* remove Tab's default padding */
    border: none;
    background: transparent;

    > div {
      padding: 0 !important;
      background: transparent !important;
    }

    &[aria-selected='true'] {
      /* styles for active tab */
      button {
        background: #32324d !important; /* active bg */
        color: #ffffff !important; /* white text */
      }

      /* ensure ALL text + icon parts become white */
      svg,
      svg path,
      span,
      p,
      div {
        color: #ffffff !important;
        fill: #ffffff !important;
      }
    }

    &[aria-disabled='true'] {
      cursor: not-allowed;
      opacity: 0.6;
    }
  `;

  return (
    <section className="py-16 !w-full overflow-hidden">
      <TabGroup label="Manage your attribute">
        <div className="flex items-center justify-between mb-10">
          <Flex direction="column" alignItems="flex-start" gap={2}>
            <Typography variant="alpha" className="h1 font-semibold" textColor="neutral900">
              Campaign Management
            </Typography>
            <Typography variant="delta" className="text-2xl" textColor="neutral600">
              ADGM / Campaign Management
            </Typography>
          </Flex>
          {/* {JSON.stringify(campaigns)} */}

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
            <Button
              size="L"
              variant="tertiary"
              onClick={() => history.push('custom-ui/create-campaign')}
            >
              Export CSV
            </Button>
            <Button
              size="L"
              startIcon={<Plus />}
              variant="default"
              onClick={() => history.push('custom-ui/create-campaign')}
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
                <SingleSelect value={type} onChange={(value) => setType(String(value))} size="S">
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
              <SingleSelectOption value="3">03</SingleSelectOption>
              <SingleSelectOption value="5">05</SingleSelectOption>
              <SingleSelectOption value="10">10</SingleSelectOption>
            </SingleSelect>
            <Typography variant="pi" textColor="neutral600" className="mr-2">
              Entries per page:
            </Typography>
          </Flex>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="w-min float-end mt-6">
              <Pagination activePage={page} pageCount={totalPages}>
                <PreviousLink
                  as="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  disabled={page === 1}
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
                    if (page < totalPages) setPage(page + 1);
                  }}
                  disabled={page === totalPages}
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
