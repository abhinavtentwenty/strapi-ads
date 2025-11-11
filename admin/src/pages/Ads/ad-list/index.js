// @ts-nocheck
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
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
import CustomIconButton from '../../../components/elements/customIconButton';
import Analytics from '../../../components/Icons/Analytics';
import AdActionMenu from '../adActionMenu';
import { Badge as BadgeCustom } from '../../../components/elements/badge';
const TrStyles = 'text-xl text-[#62627B] uppercase font-bold';
const TdStyles = 'text-2xl';

const AdList = () => {
  const history = useHistory();
  const [status, setStatus] = useState(['all']);
  const [type, setType] = useState('all');
  const [sitemap, setSitemap] = useState(null);
  const [sitemapError, setSitemapError] = useState('');
  const [search, setSearch] = useState('');
  const paginatedCampaigns = [
    {
      id: 2,
      campaign_name: 'Doslyyy Perfumes pro',
      campaign_id: 'doslyyy-perfumes-pro',
      campaign_entity_type: 'adgm_entity',
      campaign_entity_name: 'Dosly limited',
      campaign_entity_license_number: '1234456',
      createdAt: '2025-10-01T05:26:02.496Z',
      updatedAt: '2025-10-01T05:26:02.496Z',
      publishedAt: null,
      archive: null,
      ads: [
        {
          id: 2,
          ad_name: 'Dummy1',
          ad_id: 'dummy1',
          ad_start_date: '2025-10-11T19:45:00.000Z',
          ad_end_date: '2025-10-29T19:30:00.000Z',
          ad_headline: 'dummy headline',
          ad_description: 'dummy description okayyyyyy',
          ad_video_url: null,
          ad_external_url: null,
          ad_destination_models: 'business',
          ad_destination_page: null,
          createdAt: '2025-10-01T05:23:44.880Z',
          updatedAt: '2025-10-01T05:23:44.880Z',
          publishedAt: null,
        },
      ],
      campaign_status: {
        id: 2,
        status_title: 'active',
        status_id: 'status-1',
        status_description: 'Scheduled or ready for publishing',
        createdAt: '2025-09-30T13:00:49.088Z',
        updatedAt: '2025-09-30T13:00:49.088Z',
        publishedAt: null,
        status_color: '#45AF2E',
      },
    },
    {
      id: 1,
      campaign_name: 'Doslyyy Perfumes',
      campaign_id: 'doslyyy-perfumes',
      campaign_entity_type: 'adgm_entity',
      campaign_entity_name: 'Dosly limited',
      campaign_entity_license_number: '1234456',
      createdAt: '2025-10-01T05:26:02.496Z',
      updatedAt: '2025-10-03T06:29:07.786Z',
      publishedAt: null,
      archive: null,
      ads: [
        {
          id: 1,
          ad_name: 'Dummy',
          ad_id: 'dummy',
          ad_start_date: '2025-10-11T19:45:00.000Z',
          ad_end_date: '2025-10-29T19:30:00.000Z',
          ad_headline: 'dummy headline',
          ad_description: 'dummy description okayyyyyy',
          ad_video_url: null,
          ad_external_url: null,
          ad_destination_models: 'business',
          ad_destination_page: null,
          createdAt: '2025-10-01T05:23:44.880Z',
          updatedAt: '2025-10-01T05:23:44.880Z',
          publishedAt: null,
        },
        {
          id: 3,
          ad_name: 'Dummy2',
          ad_id: 'dummy2',
          ad_start_date: '2025-10-11T19:45:00.000Z',
          ad_end_date: '2025-10-29T19:30:00.000Z',
          ad_headline: 'dummy headline',
          ad_description: 'dummy description okayyyyyy',
          ad_video_url: null,
          ad_external_url: null,
          ad_destination_models: 'business',
          ad_destination_page: null,
          createdAt: '2025-10-01T05:23:44.880Z',
          updatedAt: '2025-10-01T05:23:44.880Z',
          publishedAt: null,
        },
      ],
      campaign_status: {
        id: 2,
        status_title: 'active',
        status_id: 'status-1',
        status_description: 'Scheduled or ready for publishing',
        createdAt: '2025-09-30T13:00:49.088Z',
        updatedAt: '2025-09-30T13:00:49.088Z',
        publishedAt: null,
        status_color: '#45AF2E',
      },
    },
  ];

  return (
    <div>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Flex direction="column" alignItems="flex-start">
          <Typography variant="alpha" className="h1 font-semibold" textColor="neutral900">
            Ad Management
          </Typography>
          <Typography variant="epsilon" className="text-2xl" textColor="neutral600">
            Abu Dhabi Global Market - Ads
          </Typography>
        </Flex>
        <Button size="L" variant="tertiary" onClick={() => {}}>
          Export CSV
        </Button>
      </Flex>
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
              2334 Ads
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
              <SingleSelect value={type} onChange={(value) => setType(String(value))}>
                <SingleSelectOption value="all">All Campaign</SingleSelectOption>
                <SingleSelectOption value="banner">Banner</SingleSelectOption>
                <SingleSelectOption value="video">Video</SingleSelectOption>
              </SingleSelect>
              <MultiSelect value={status} onChange={(value) => setStatus(value)}>
                <MultiSelectOption value="all">All Statuses</MultiSelectOption>
                <MultiSelectOption value="active">Active</MultiSelectOption>
                <MultiSelectOption value="paused">Paused</MultiSelectOption>
              </MultiSelect>
              <SingleSelect value={type} onChange={(value) => setType(String(value))}>
                <SingleSelectOption value="all">All Types</SingleSelectOption>
                <SingleSelectOption value="banner">Banner</SingleSelectOption>
                <SingleSelectOption value="video">Video</SingleSelectOption>
              </SingleSelect>
            </Flex>
          </Flex>
        </div>
        <Table colCount={7} rowCount={paginatedCampaigns.length}>
          <Thead>
            <Tr className={TrStyles}>
              <Th>
                <div className="flex gap-2">
                  <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                    Ad
                  </Typography>
                  <button onClick={() => console.log('sort campaigns')}>
                    <CarretDown className="size-2" />
                  </button>
                </div>
              </Th>
              <Th>
                <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                  Date
                </Typography>
              </Th>
              <Th>
                <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                  Status
                </Typography>
              </Th>
              <Th>
                <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                  Campaign
                </Typography>
              </Th>
              <Th>
                <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                  Link
                </Typography>
              </Th>
              <Th>
                <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                  Impressions
                </Typography>
              </Th>
              <Th>
                <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                  Clicks
                </Typography>
              </Th>
              <Th>
                <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                  CTR
                </Typography>
              </Th>
              <Th>
                <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                  Action
                </Typography>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedCampaigns.length > 0 &&
              paginatedCampaigns.map((c, idx) => (
                <Tr key={idx}>
                  {/* Campaign name and ID */}
                  <Td className={TdStyles}>
                    <div
                      className="flex items-center gap-2"
                      style={{
                        padding: '20px 12px',
                      }}
                    >
                      <img
                        src="http://localhost:1332/uploads/thumbnail_Image_created_with_a_mobile_phone_de0a0f8e42.png"
                        // alt={feature.name}
                        style={{ width: 44, height: 44, borderRadius: 6 }}
                      />
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-normal leading-5">Ad name</p>
                        <div className=" flex items-center gap-1">
                          <BadgeCustom $variant="draft">Native card</BadgeCustom>
                          <BadgeCustom $variant="grayOutline">Lifestyle listing</BadgeCustom>
                        </div>
                      </div>
                    </div>
                  </Td>
                  {/* Campaign date range (static for now) */}
                  <Td className={TdStyles}>12/01/25 - 13/02/25</Td>
                  {/* Campaign status */}
                  <Td className={TdStyles}>
                    <Badge
                      backgroundColor={
                        c?.campaign_status?.status_title === 'Live'
                          ? 'success100'
                          : c?.campaign_status?.status_title === 'Draft'
                            ? 'neutral100'
                            : 'danger100'
                      }
                      textColor={
                        c?.campaign_status?.status_title === 'Live'
                          ? 'success500'
                          : c?.campaign_status?.status_title === 'Draft'
                            ? 'neutral600'
                            : 'danger500'
                      }
                    >
                      {c?.campaign_status?.status_title}
                    </Badge>
                  </Td>
                  <Td className={TdStyles}>
                    <Typography as="span" variant="epsilon">
                      Advertisements
                    </Typography>
                  </Td>
                  <Td className={TdStyles}>
                    <Badge
                      // backgroundColor="neutral150"
                      backgroundColor="primary200"
                      textColor="neutral900"
                    >
                      Internal
                    </Badge>
                  </Td>
                  <Td className={TdStyles}>
                    <Typography as="span" variant="epsilon">
                      {Math.floor(Math.random() * 10000)}
                    </Typography>
                  </Td>
                  <Td className={TdStyles}>
                    <Typography as="span" variant="epsilon">
                      {Math.floor(Math.random() * 10000)}
                    </Typography>
                  </Td>
                  <Td className={TdStyles}>
                    <Typography as="span" variant="epsilon">
                      {`${Math.floor(Math.random() * 100)}%`}
                    </Typography>
                  </Td>
                  {/* Action menu for campaign */}
                  <Td>
                    <Flex className="gap-2">
                      <CustomIconButton
                        onClick={() => history.push('ad-report')}
                        ariaLabel="View Analytics"
                      >
                        <Analytics />
                      </CustomIconButton>
                      <AdActionMenu data={c} />
                    </Flex>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>
    </div>
  );
};

export default AdList;
