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

import { CarretDown, Plus } from '@strapi/icons';
// import { EmptyDocuments } from "@strapi/icons/symbols";

import Analytics from '../../components/Icons/Analytics';
import DashboardCard from '../../components/elements/dashboardcard';
import ActionMenu from './actionMenu';
import CustomIconButton from '../../components/elements/customIconButton';
const TrStyles = 'text-xl text-[#62627B] uppercase font-bold';
const TdStyles = 'text-2xl';
import CustomBadge from '../../components/elements/badge';

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

const ListView = ({ paginatedCampaigns }) => {
  const history = useHistory();
  return (
    <>
      <div className="!p-6 ">
        <Grid marginTop={8} gap={4}>
          {DummyData.map((data) => (
            <DashboardCard key={data.id} data={data} />
          ))}
        </Grid>
      </div>
      <Table colCount={7} rowCount={paginatedCampaigns?.length}>
        <Thead>
          <Tr className={TrStyles}>
            <Th>
              <div className="flex gap-2">
                <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                  Campaign
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
                Ads
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
                Avg. CTR
              </Typography>
            </Th>
            <Th>
              <Typography variant="pi" fontWeight="bold" textColor="neutral700">
                Entity Name
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
                  <CustomBadge variant={c?.campaign_status?.status_title}>
                    {c?.campaign_status?.status_title}
                  </CustomBadge>
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
                  className="flex flex-col items-center justify-center"
                >
                  {/* <EmptyDocuments className="size-40" /> */}
                  <div className="text-gray-500 mb-4 text-lg">No content found</div>
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
