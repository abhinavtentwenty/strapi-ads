// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Searchbar,
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
  Combobox,
  ComboboxOption,
  NextLink,
  PageLink,
  Pagination,
  PreviousLink,
} from '@strapi/design-system';
import { format } from 'date-fns';
import { CarretDown } from '@strapi/icons';
import CustomIconButton from '../../../components/elements/customIconButton';
import Analytics from '../../../components/Icons/Analytics';
import AdActionMenu from '../adActionMenu';
import BadgeCustom from '../../../components/elements/badge';
import useAds from '../../../components/hooks/useAds';
import useCampaigns from '../../../components/hooks/useCampaigns';
import useAdType from '../../../components/hooks/useAdType';
import { AD_STATUS_OPTIONS } from '../../../utils/constants';
import StatusBadge from '../../../components/elements/statusBadge';
import CustomBadge from '../../../components/elements/badge';
import { useFetchClient } from '@strapi/helper-plugin';
import qs from 'qs';
import pluginId from '../../../pluginId';

const TrStyles = 'text-xl text-[#62627B] uppercase font-bold';
const TdStyles = 'text-2xl';

const AdList = () => {
  const history = useHistory();
  const { get } = useFetchClient();

  const [campaign, setCampaign] = useState('');
  const [status, setStatus] = useState(['']);
  const [filter, setFilter] = useState('');
  const [type, setType] = useState('');
  const [search, setSearch] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { ads, pagination } = useAds({ page, pageSize, status, type, search, campaign });

  const { adTypes } = useAdType();
  const [activeCampaignPage, setActiveCampaignPage] = React.useState(1);
  const [activeCampaignPageOptions, setActiveCampaignPageOptions] = React.useState([]);
  const { campaigns, pagination: campaignPagination } = useCampaigns({
    page: activeCampaignPage ?? 1,
    pageSize: 10,
  });

  React.useEffect(() => {
    if (!campaigns) return;

    setActiveCampaignPageOptions((prev) => {
      if (activeCampaignPage === 1) {
        return campaigns.map((c) => ({
          id: c.id,
          value: c.campaign_name,
        }));
      }

      return [
        ...prev,
        ...campaigns.map((c) => ({
          id: c.id,
          value: c.campaign_name,
        })),
      ];
    });
  }, [campaigns, activeCampaignPage]);

  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.pageCount || 1;
  const paginatedCampaigns = campaigns;

  useEffect(() => {
    if (currentPage > totalPages) setPage(1);
  }, [totalPages]);

  const filteredCampaignOptions = activeCampaignPageOptions.filter((c) =>
    c.value.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDownloadCSV = async () => {
    try {
      const cleanStatus = status.filter(Boolean);

      const query = qs.stringify(
        {
          filters: {
            ...(type !== '' && { ad_type: type }),
            ...(campaign !== '' && {
              campaign,
            }),
            ...(cleanStatus.length > 0 && { ad_status: cleanStatus }),
            ...(search && { ad_name: { $containsi: search } }),
          },
        },
        { encodeValuesOnly: true }
      );

      const response = await get(`/${pluginId}/ad/generate-report?${query}`);
      window.open(response?.data?.downloadUrl, '_blank');
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

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
        <Button size="L" variant="tertiary" onClick={handleDownloadCSV}>
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
              {pagination?.total} Ads
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
              <Combobox
                placeholder="All Campaigns"
                value={campaign}
                onChange={(v) => setCampaign(v)}
                filterValue={filter}
                onFilterValueChange={(v) => setFilter(v ?? '')}
              >
                <ComboboxOption key={0} value="">
                  All Campaigns
                </ComboboxOption>
                {filteredCampaignOptions.map((c) => (
                  <ComboboxOption key={c.id} value={c.id}>
                    {c.value}
                  </ComboboxOption>
                ))}
                {activeCampaignPage < campaignPagination?.pageCount && (
                  <Button
                    style={{ width: '100%' }}
                    variant="tertiary"
                    onClick={() => setActiveCampaignPage((prev) => prev + 1)}
                  >
                    Load More
                  </Button>
                )}
              </Combobox>
              <MultiSelect value={status} onChange={(value) => setStatus(value)}>
                {AD_STATUS_OPTIONS.map((status) => (
                  <MultiSelectOption key={status.value} value={status.value}>
                    {status.label}
                  </MultiSelectOption>
                ))}
              </MultiSelect>
              <SingleSelect value={type} onChange={(value) => setType(String(value))}>
                <SingleSelectOption key={0} value="">
                  All Types
                </SingleSelectOption>
                {adTypes.map((type) => (
                  <SingleSelectOption key={type?.id} value={type?.id}>
                    {type?.title}
                  </SingleSelectOption>
                ))}
              </SingleSelect>
            </Flex>
          </Flex>
        </div>
        <Table colCount={7} rowCount={ads.length + 1}>
          <Thead>
            <Tr className={TrStyles}>
              <Th>
                <div className="flex gap-2">
                  <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                    Ad
                  </Typography>
                  <button
                  // onClick={() => console.log('sort campaigns')}
                  >
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
            {ads.length > 0 &&
              ads.map((ad, idx) => (
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
                        <p className="text-sm font-normal leading-5">{ad?.ad_name}</p>
                        <div className=" flex items-center gap-1">
                          {ad?.ad_type && (
                            <CustomBadge variant="draft">{ad.ad_type?.title}</CustomBadge>
                          )}
                          {ad?.ad_spot && (
                            <CustomBadge variant="grayOutline">
                              {ad.ad_spot?.ad_spot_title}
                            </CustomBadge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Td>
                  {/* Campaign date range (static for now) */}
                  <Td className={TdStyles}>
                    {ad?.ad_start_date ? format(new Date(ad?.ad_start_date), 'dd/MM/yyyy') : ''} -{' '}
                    {ad?.ad_end_date ? format(new Date(ad?.ad_end_date), 'dd/MM/yyyy') : ''}
                  </Td>

                  <Td className={TdStyles}>
                    <StatusBadge status={ad?.ad_status} />
                  </Td>

                  <Td className={TdStyles}>
                    <Typography as="span" variant="epsilon">
                      {ad?.campaign?.campaign_name || ''}
                    </Typography>
                  </Td>
                  <Td className={TdStyles}>
                    <Badge
                      backgroundColor={ad?.ad_external_url ? 'primary100' : 'neutral150'}
                      textColor="neutral900"
                    >
                      {ad?.ad_external_url ? 'External' : 'Internal'}
                    </Badge>
                  </Td>
                  <Td className={TdStyles}>
                    <Typography as="span" variant="epsilon">
                      {ad?.total_impressions ?? ''}
                    </Typography>
                  </Td>
                  <Td className={TdStyles}>
                    <Typography as="span" variant="epsilon">
                      {ad?.total_clicks ?? ''}
                    </Typography>
                  </Td>
                  <Td className={TdStyles}>
                    <Typography as="span" variant="epsilon">
                      {ad?.total_clicks && ad?.total_impressions
                        ? `${(ad?.total_clicks / ad?.total_impressions) * 100}%`
                        : '0%'}
                    </Typography>
                  </Td>
                  {/* Action menu for campaign */}
                  <Td>
                    <Flex className="gap-2">
                      <CustomIconButton
                        onClick={() => history.push(`ads/report/${ad.id}`)}
                        ariaLabel="View Analytics"
                      >
                        <Analytics />
                      </CustomIconButton>
                      <AdActionMenu data={ad} />
                    </Flex>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>
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
                  if (start > 2) links.push(<p>...</p>);
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
                  if (end < totalPages - 1) links.push(<p key="dots-end">...</p>);
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
    </div>
  );
};

export default AdList;
