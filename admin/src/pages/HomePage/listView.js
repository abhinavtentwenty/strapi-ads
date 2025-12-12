// @ts-nocheck
import { Button, Flex, Table, Tbody, Td, Th, Thead, Tr, Typography } from '@strapi/design-system';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { CarretDown, CarretUp, Plus } from '@strapi/icons';
// import { EmptyDocuments } from "@strapi/icons/symbols";
import { format } from 'date-fns';

import Analytics from '../../components/Icons/Analytics';
import CustomIconButton from '../../components/elements/customIconButton';
import DashboardCard from '../../components/elements/dashboardcard';
import StatusBadge from '../../components/elements/statusBadge';
import useAdModuleStats from '../../components/hooks/useAdModuleStats';
import { formatNumber } from '../../utils/utils';
import ActionMenu from './actionMenu';
const TrStyles = 'text-xl uppercase font-bold';
const TdStyles = 'text-2xl';

const ListView = ({ paginatedCampaigns, handleSortChange, sort, isLoading, filters }) => {
  const history = useHistory();
  const { stats } = useAdModuleStats();

  const handleRowClick = (event, campaignId) => {
    // Prevent navigation if clicking on buttons or interactive elements
    const target = event.target;
    const isInteractiveElement =
      target.closest('button') || target.closest('a') || target.closest('[role="button"]');

    if (!isInteractiveElement) {
      history.push(`campaigns/view/${campaignId}`);
    }
  };

  return (
    <>
      <div className="!p-6 ">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          {stats?.length > 0 && stats?.map((stat) => <DashboardCard key={stat.type} data={stat} />)}
        </div>
      </div>

      <Table
        className="ads-table w-max min-w-full"
        colCount={7}
        rowCount={paginatedCampaigns?.length}
      >
        <Thead>
          <Tr className={TrStyles}>
            <Th onClick={() => handleSortChange('campaign_name')} style={{ paddingInline: 24 }}>
              <div className="flex gap-2 items-center cursor-pointer">
                <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                  Campaign
                </Typography>
                {sort.field === 'campaign_name' &&
                  (sort.order === 'ASC' ? (
                    <CarretDown className="size-2" />
                  ) : (
                    <CarretUp className="size-2" />
                  ))}
              </div>
            </Th>
            <Th onClick={() => handleSortChange('min_date')}>
              <div className="flex gap-2 items-center cursor-pointer">
                <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                  Date
                </Typography>
                {sort.field === 'min_date' &&
                  (sort.order === 'ASC' ? (
                    <CarretDown className="size-2" />
                  ) : (
                    <CarretUp className="size-2" />
                  ))}
              </div>
            </Th>
            <Th onClick={() => handleSortChange('campaign_status')}>
              <div className="flex gap-2 items-center cursor-pointer">
                <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                  Status
                </Typography>
                {sort.field === 'campaign_status' &&
                  (sort.order === 'ASC' ? (
                    <CarretDown className="size-2" />
                  ) : (
                    <CarretUp className="size-2" />
                  ))}
              </div>
            </Th>
            <Th>
              <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                Ads
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
                Avg. CTR
              </Typography>
            </Th>
            <Th onClick={() => handleSortChange('campaign_entity_name')}>
              <div className="flex gap-2 items-center cursor-pointer">
                <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                  Entity Name
                </Typography>
                {sort.field === 'campaign_entity_name' &&
                  (sort.order === 'ASC' ? (
                    <CarretDown className="size-2" />
                  ) : (
                    <CarretUp className="size-2" />
                  ))}
              </div>
            </Th>

            <Th className="sticky right-0 px-6" background="neutral0">
              <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                Action
              </Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedCampaigns?.length > 0 ? (
            paginatedCampaigns?.map((c, idx) => (
              <Tr key={idx} onClick={(e) => handleRowClick(e, c.id)} style={{ cursor: 'pointer' }}>
                {/* Campaign name and ID */}
                <Td className={TdStyles} style={{ paddingInline: 24 }}>
                  <div className="flex flex-col">
                    <Typography as="span" variant="epsilon">
                      {c.campaign_name}
                    </Typography>
                    <Typography as="span" variant="pi">
                      {c.campaign_id}
                    </Typography>
                  </div>
                </Td>
                {/* Campaign date range (static for now) */}
                <Td className={TdStyles}>
                  {c?.min_date ? format(new Date(c?.min_date), 'dd/MM/yyyy') : ''} -{' '}
                  {c?.max_date ? format(new Date(c?.max_date), 'dd/MM/yyyy') : ''}
                </Td>
                {/* Campaign status */}
                <Td className={TdStyles}>
                  <StatusBadge status={c?.campaign_status} />
                </Td>
                <Td className={TdStyles}>
                  <div className="flex flex-col">
                    <Typography as="span" variant="epsilon">
                      {formatNumber(c?.ads?.length < 10 ? `0${c?.ads?.length}` : c?.ads?.length)}
                    </Typography>
                    <Typography as="span" variant="pi">
                      Advertisments
                    </Typography>
                  </div>
                </Td>
                <Td className={TdStyles}>
                  <Typography as="span" variant="epsilon">
                    {formatNumber(c?.total_impressions) ?? 0}
                  </Typography>
                </Td>
                <Td className={TdStyles}>
                  <Typography as="span" variant="epsilon">
                    {formatNumber(c?.total_clicks) ?? 0}
                  </Typography>
                </Td>

                <Td className={TdStyles}>
                  <Typography as="span" variant="epsilon">
                    {c?.total_clicks && c?.total_impressions
                      ? `${((c?.total_clicks / c?.total_impressions) * 100).toFixed(2)}%`
                      : '0%'}
                  </Typography>
                </Td>
                <Td className={TdStyles}>
                  <Typography as="span" variant="epsilon">
                    {c.campaign_entity_name}
                  </Typography>
                </Td>
                {/* Action menu for campaign */}
                <Td className="sticky right-0 " background="neutral0" style={{ paddingInline: 24 }}>
                  <Flex justifyContent="right" className="gap-2">
                    {c?.campaign_status !== 'draft' && (
                      <CustomIconButton
                        onClick={() => history.push(`campaigns/report/${c.id}`)}
                        ariaLabel="View Analytics"
                      >
                        <Analytics />
                      </CustomIconButton>
                    )}

                    <ActionMenu data={c} filters={filters} />
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
                  {/* <EmptyDocuments className="size-40" /> */}
                  <div className="text-gray-500 text-lg">No content found</div>
                  <Button
                    variant="secondary"
                    startIcon={<Plus />}
                    onClick={() => history.push('campaigns/create')}
                  >
                    Create New Campaign
                  </Button>
                </div>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </>
  );
};

export default ListView;
