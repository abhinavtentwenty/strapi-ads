// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Badge,
  Flex,
  Typography,
  Grid,
} from '@strapi/design-system';

import { CarretDown, Plus, CarretUp } from '@strapi/icons';
// import { EmptyDocuments } from "@strapi/icons/symbols";

import Analytics from '../../components/Icons/Analytics';
import DashboardCard from '../../components/elements/dashboardcard';
import ActionMenu from './actionMenu';
import CustomIconButton from '../../components/elements/customIconButton';
const TrStyles = 'text-xl text-[#62627B] uppercase font-bold';
const TdStyles = 'text-2xl';
import CustomBadge from '../../components/elements/badge';
import StatusBadge from '../../components/elements/statusBadge';
import useAdModuleStats from '../../components/hooks/useAdModuleStats';

const ListView = ({ paginatedCampaigns, handleSortChange, sort }) => {
  const history = useHistory();
  const { stats } = useAdModuleStats();

  return (
    <>
      <div className="!p-6 ">
        <Flex marginTop={8} gap={4}>
          {stats?.length > 0 && stats?.map((stat) => <DashboardCard key={stat.type} data={stat} />)}
        </Flex>
      </div>
      <Table colCount={7} rowCount={paginatedCampaigns?.length}>
        <Thead>
          <Tr className={TrStyles}>
            <Th onClick={() => handleSortChange('campaign_name')}>
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

            <Th>
              <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                Action
              </Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedCampaigns?.length > 0 ? (
            paginatedCampaigns?.map((c, idx) => (
              <Tr key={idx}>
                {/* Campaign name and ID */}
                <Td className={TdStyles}>
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
                <Td className={TdStyles}>12/01/25 - 13/02/25</Td>
                {/* Campaign status */}
                <Td className={TdStyles}>
                  <StatusBadge status={c?.campaign_status} />
                </Td>
                <Td className={TdStyles}>
                  <div className="flex flex-col">
                    <Typography as="span" variant="epsilon">
                      {c?.ads?.length < 10 ? `0${c?.ads?.length}` : c?.ads?.length}
                    </Typography>
                    <Typography as="span" variant="pi">
                      Advertisments
                    </Typography>
                  </div>
                </Td>
                <Td className={TdStyles}>
                  <Typography as="span" variant="epsilon">
                    {c?.total_impressions ?? ''}
                  </Typography>
                </Td>
                <Td className={TdStyles}>
                  <Typography as="span" variant="epsilon">
                    {c?.total_clicks ?? ''}
                  </Typography>
                </Td>

                <Td className={TdStyles}>
                  <Typography as="span" variant="epsilon">
                    {c?.total_clicks && c?.total_impressions
                      ? `${(c?.total_clicks / c?.total_impressions) * 100}%`
                      : '0%'}
                  </Typography>
                </Td>
                <Td className={TdStyles}>
                  <Typography as="span" variant="epsilon">
                    {c.campaign_entity_name}
                  </Typography>
                </Td>
                {/* Action menu for campaign */}
                <Td>
                  <Flex className="gap-2">
                    <CustomIconButton
                      onClick={() => history.push(`campaigns/report/${c.id}`)}
                      ariaLabel="View Analytics"
                    >
                      <Analytics />
                    </CustomIconButton>
                    <ActionMenu data={c} />
                  </Flex>
                </Td>
              </Tr>
            ))
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
                    onClick={() => history.push('campaign/create')}
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
