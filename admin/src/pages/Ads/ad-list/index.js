// @ts-nocheck
import {
  Badge,
  Box,
  Button,
  Combobox,
  ComboboxOption,
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
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Typography,
} from '@strapi/design-system';
import { useFetchClient } from '@strapi/helper-plugin';
import { CarretDown, CarretUp } from '@strapi/icons';
import { format } from 'date-fns';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import CustomBadge from '../../../components/elements/badge';
import CustomIconButton from '../../../components/elements/customIconButton';
import StatusBadge from '../../../components/elements/statusBadge';
import useAds from '../../../components/hooks/useAds';
import useAdType from '../../../components/hooks/useAdType';
import useCampaigns from '../../../components/hooks/useCampaigns';
import Analytics from '../../../components/Icons/Analytics';
import pluginId from '../../../pluginId';
import { AD_STATUS_OPTIONS } from '../../../utils/constants';
import { truncate } from '../../../utils/utils';
import ExportReportCsvModal from '../../Campaign/components/exportReportCsvModal';
import AdActionMenu from '../adActionMenu';

const TrStyles = 'text-xl uppercase font-bold';
const TdStyles = 'text-2xl';

const AdList = () => {
  const history = useHistory();
  const { get } = useFetchClient();

  const [campaign, setCampaign] = useState('');
  const [status, setStatus] = useState(['']);
  const [campaignSearch, setCampaignSearch] = useState('');
  const [type, setType] = useState('');
  const [search, setSearch] = useState('');
  const [isOpenExportReportCsvModal, setIsOpenExportReportCsvModal] = React.useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [sort, setSort] = useState({ field: 'ad_name', order: 'ASC' });

  const { ads, pagination, isLoading, mutate } = useAds({
    page,
    pageSize,
    status,
    type,
    search,
    campaign,
    sort,
  });

  const handleSortChange = (field) => {
    setSort((prevSort) => ({
      field,
      order: prevSort.field === field ? (prevSort.order === 'ASC' ? 'DESC' : 'ASC') : 'ASC',
    }));
    setPage(1);
  };

  const { adTypes } = useAdType();
  const [activeCampaignPage, setActiveCampaignPage] = React.useState(1);
  const [activeCampaignPageOptions, setActiveCampaignPageOptions] = React.useState([]);
  const { campaigns, pagination: campaignPagination } = useCampaigns({
    page: activeCampaignPage ?? 1,
    pageSize: 10,
    search: campaignSearch,
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

  const handleRowClick = (event, adId, campaignId) => {
    // Prevent navigation if clicking on buttons or interactive elements
    const target = event.target;
    const isInteractiveElement =
      target.closest('button') || target.closest('a') || target.closest('[role="button"]');

    if (!isInteractiveElement) {
      history.push(`campaigns/view/${campaignId}?ad=${adId}`);
    }
  };

  useEffect(() => {
    const pageWrapper = document.querySelector('.page-wrapper');
    const target = pageWrapper?.parentElement?.parentElement;
    const className = 'adgm-dashboard-wrapper';

    if (target) target.classList.add(className);

    return () => {
      if (target) target.classList.remove(className);
    };
  }, []);

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
    <div className="page-wrapper">
      <ExportReportCsvModal
        isOpen={isOpenExportReportCsvModal}
        setIsOpen={setIsOpenExportReportCsvModal}
        onSubmit={handleDownloadCSV}
      />
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Flex direction="column" alignItems="flex-start">
          <Typography variant="alpha" className="h1 font-semibold" textColor="neutral900">
            Ad Management
          </Typography>
          <Typography variant="epsilon" className="text-2xl" textColor="neutral600">
            Abu Dhabi Global Market - Ads
          </Typography>
        </Flex>
        <Button size="L" variant="tertiary" onClick={() => setIsOpenExportReportCsvModal(true)}>
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
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1); // Reset page to 1
                }}
                onClear={() => {
                  setSearch('');
                  setPage(1); // Reset page to 1
                }}
                clearLabel="Clear search"
                placeholder="Search..."
              >
                <></>
              </Searchbar>
              <Combobox
                placeholder="All Campaigns"
                value={campaign}
                onChange={(v) => {
                  setCampaign(v);
                  setPage(1);
                }}
                filterValue={campaignSearch} // Change from filter
                onFilterValueChange={(v) => {
                  setCampaignSearch(v ?? '');
                  setActiveCampaignPage(1);
                }} // Change from setFilter
              >
                <ComboboxOption key={0} value="">
                  All Campaigns
                </ComboboxOption>
                {campaigns?.map(
                  (
                    c // Change from filteredCampaignOptions
                  ) => (
                    <ComboboxOption key={c.id} value={c.id}>
                      {c.campaign_name}
                    </ComboboxOption>
                  )
                )}
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
              <MultiSelect
                value={status}
                onChange={(value) => {
                  setStatus(value);
                  setPage(1); // Reset page to 1
                }}
                customizeContent={(value) =>
                  value
                    .map((v) => AD_STATUS_OPTIONS.find((opt) => opt.value === v)?.label)
                    .join(', ')
                }
              >
                {AD_STATUS_OPTIONS.map((status) => (
                  <MultiSelectOption key={status.value} value={status.value}>
                    {status.label}
                  </MultiSelectOption>
                ))}
              </MultiSelect>
              <SingleSelect
                value={type}
                onChange={(value) => {
                  setType(String(value));
                  setPage(1); // Reset page to 1
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
            </Flex>
          </Flex>
        </div>
        <Table colCount={7} rowCount={ads.length + 1} className="ads-table w-max min-w-full">
          <Thead>
            <Tr className={TrStyles}>
              <Th onClick={() => handleSortChange('ad_name')} style={{ paddingInline: 24 }}>
                <div className="flex gap-2 items-center cursor-pointer">
                  <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                    Ad
                  </Typography>
                  {sort.field === 'ad_name' &&
                    (sort.order === 'ASC' ? (
                      <CarretDown className="size-2" />
                    ) : (
                      <CarretUp className="size-2" />
                    ))}
                </div>
              </Th>
              <Th onClick={() => handleSortChange('ad_start_date')}>
                <div className="flex gap-2 items-center cursor-pointer">
                  <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                    Date
                  </Typography>
                  {sort.field === 'ad_start_date' &&
                    (sort.order === 'ASC' ? (
                      <CarretDown className="size-2" />
                    ) : (
                      <CarretUp className="size-2" />
                    ))}
                </div>
              </Th>
              <Th onClick={() => handleSortChange('ad_status')}>
                <div className="flex gap-2 items-center cursor-pointer">
                  <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                    Status
                  </Typography>

                  {sort.field === 'ad_status' &&
                    (sort.order === 'ASC' ? (
                      <CarretDown className="size-2" />
                    ) : (
                      <CarretUp className="size-2" />
                    ))}
                </div>
              </Th>
              <Th onClick={() => handleSortChange('campaign.campaign_name')}>
                <div className="flex gap-2 items-center cursor-pointer">
                  <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                    Campaign
                  </Typography>
                  {sort.field === 'campaign.campaign_name' &&
                    (sort.order === 'ASC' ? (
                      <CarretDown className="size-2" />
                    ) : (
                      <CarretUp className="size-2" />
                    ))}
                </div>
              </Th>
              <Th>
                <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                  Link
                </Typography>
              </Th>
              <Th onClick={() => handleSortChange('total_impressions')}>
                <div className="flex gap-2 items-center cursor-pointer">
                  <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                    Impressions
                  </Typography>
                  {sort.field === 'total_impressions' &&
                    (sort.order === 'ASC' ? (
                      <CarretDown className="size-2" />
                    ) : (
                      <CarretUp className="size-2" />
                    ))}
                </div>
              </Th>
              <Th onClick={() => handleSortChange('total_clicks')}>
                <div className="flex gap-2 items-center cursor-pointer">
                  <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                    Clicks
                  </Typography>
                  {sort.field === 'total_clicks' &&
                    (sort.order === 'ASC' ? (
                      <CarretDown className="size-2" />
                    ) : (
                      <CarretUp className="size-2" />
                    ))}
                </div>
              </Th>
              <Th>
                <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                  CTR
                </Typography>
              </Th>
              <Th className="sticky right-0 px-6" background="neutral0">
                <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                  Action
                </Typography>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {ads.length > 0 ? (
              ads.map((ad, idx) => (
                <Tr
                  key={idx}
                  onClick={(e) => handleRowClick(e, ad.id, ad.campaign?.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <Td className={TdStyles} style={{ paddingInline: 24 }}>
                    <div
                      className="flex items-center gap-2"
                      style={{
                        padding: '20px 12px',
                      }}
                    >
                      <img
                        src={ad?.ad_image?.url}
                        alt={ad?.ad_name}
                        style={{ width: 44, height: 44, borderRadius: 6 }}
                      />
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-normal leading-5">{truncate(ad?.ad_name, 20)}</p>
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
                    <StatusBadge
                      status={ad?.campaign?.campaign_status === 'draft' ? 'draft' : ad?.ad_status}
                    />
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
                      {ad?.total_impressions ?? 0}
                    </Typography>
                  </Td>
                  <Td className={TdStyles}>
                    <Typography as="span" variant="epsilon">
                      {ad?.total_clicks ?? 0}
                    </Typography>
                  </Td>
                  <Td className={TdStyles}>
                    <Typography as="span" variant="epsilon">
                      {ad?.total_clicks && ad?.total_impressions
                        ? `${((ad?.total_clicks / ad?.total_impressions) * 100).toFixed(2)}%`
                        : '0%'}
                    </Typography>
                  </Td>
                  {/* Action menu for campaign */}
                  <Td
                    className="sticky right-0"
                    background="neutral0"
                    style={{ paddingInline: 24 }}
                  >
                    <Flex justifyContent="right" className="gap-2">
                      {ad?.ad_status !== 'draft' && ad?.campaign?.campaign_status !== 'draft' && (
                        <CustomIconButton
                          onClick={() => history.push(`ads/report/${ad.id}`)}
                          ariaLabel="View Analytics"
                        >
                          <Analytics />
                        </CustomIconButton>
                      )}
                      <AdActionMenu
                        data={ad}
                        onStatusChange={() => mutate()}
                        filters={{
                          page,
                          pageSize,
                          status,
                          type,
                          search,
                          campaign,
                          sort,
                        }}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))
            ) : isLoading ? (
              <></>
            ) : (
              <Tr>
                <Td colSpan={7}>
                  <div
                    style={{ height: '50vh' }}
                    className="flex flex-col gap-4 items-center justify-center"
                  >
                    <div className="text-gray-500 text-lg">No ads found</div>
                  </div>
                </Td>
              </Tr>
            )}
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
