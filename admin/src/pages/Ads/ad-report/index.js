// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
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
  Popover,
} from '@strapi/design-system';
import { More } from '@strapi/icons';

import CustomBadge from '../../../components/elements/badge';
import DashboardCard from '../../../components/elements/dashboardcard';
import PerformanceAnalytics from '../../Components/performanceAnalytics';
import ClickThroughRateTrend from '../../Components/clickThroughRateTrend';
import Analytics from '../../../components/Icons/Analytics';
import Download from '../../../components/Icons/Download';
import Pause from '../../../components/Icons/Pause';
import Save from '../../../components/Icons/Save';
import Archive from '../../../components/Icons/Archive';
import ConfirmArchiveModal from '../../Components/confirmArchiveModal';
import ConfirmUnpublishModal from '../../Components/confirmUnpublishModal';

import CustomButton from '../../../components/elements/customButton';
import BackButton from '../../../components/elements/backButton';

const DummyData = [
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

const PopoverItem = styled(Flex)`
  padding: 8px 16px;
  gap: 6px;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral100};
  }
`;

const AdReport = () => {
  const [status, setStatus] = React.useState(['all']);
  const [type, setType] = React.useState('all');
  const [dateRange, setDateRange] = React.useState('last_7_days');
  const [openMorePopover, setOpenMorePopover] = React.useState(false);
  const morePopoverRef = React.useRef(null);
  const [isOpenArchiveAdModal, setIsOpenArchiveAdModal] = React.useState(false);
  const [isOpenUnpublishAdModal, setIsOpenUnpublishAdModal] = React.useState(false);
  const history = useHistory();

  return (
    <div>
      <ConfirmArchiveModal
        isOpen={isOpenArchiveAdModal}
        setIsOpen={setIsOpenArchiveAdModal}
        onSubmit={() => {}}
        variant="ads"
      />
      <ConfirmUnpublishModal
        isOpen={isOpenUnpublishAdModal}
        setIsOpen={setIsOpenUnpublishAdModal}
        onSubmit={() => {}}
        variant="ads"
      />
      <BackButton />
      <Flex justifyContent="space-between" alignItems="center" style={{ marginBottom: '2rem' }}>
        <div
          className="flex items-center gap-2"
          style={{
            padding: '20px 12px',
          }}
        >
          <img
            src="/uploads/Image_created_with_a_mobile_phone_de0a0f8e42.png"
            // alt={feature.name}
            style={{ width: 55, height: 55, borderRadius: 6 }}
          />
          <div className="flex flex-col gap-1">
            <Flex alignItems="center" gap={1}>
              <Typography variant="beta">Best Performing Ad</Typography>
              <div className=" flex items-center gap-1">
                <CustomBadge variant="draft">Native card</CustomBadge>
                <CustomBadge variant="grayOutline">Lifestyle listing</CustomBadge>
                <CustomBadge variant="live">Live</CustomBadge>
              </div>
            </Flex>
            <Typography variant="pi" textColor="neutral600">
              {new Date().toDateString()} - {new Date().toDateString()}
            </Typography>
          </div>
        </div>
        <div className="flex gap-4">
          <>
            <Button
              startIcon={<More />}
              variant="tertiary"
              size="L"
              ref={morePopoverRef}
              onClick={() => setOpenMorePopover(!openMorePopover)}
            >
              More
            </Button>

            {openMorePopover && (
              <Popover
                source={morePopoverRef}
                placement="bottom"
                spacing={4}
                onDismiss={() => setOpenMorePopover(false)}
              >
                <Flex direction="column">
                  <PopoverItem
                    role="button"
                    onClick={() => setIsOpenUnpublishAdModal(true)}
                    justifyContent="space-between"
                    gap={6}
                  >
                    <Typography>Unpublish</Typography>
                    <Pause />
                  </PopoverItem>
                  <PopoverItem
                    justifyContent="space-between"
                    role="button"
                    style={{ width: '100%' }}
                    onClick={() => setIsOpenArchiveAdModal(true)}
                  >
                    <Typography>Archive</Typography>
                    <Archive />
                  </PopoverItem>
                </Flex>
              </Popover>
            )}
          </>

          <CustomButton onClick={() => history.push('ad-report')}>
            <Analytics stroke="#32324d" />
            View Report
          </CustomButton>
          <CustomButton onClick={() => history.push('ad-report')}>
            <Save stroke="#32324d" />
            Save
          </CustomButton>

          <CustomButton onClick={(e) => {}}>
            <Download stroke="#32324d" />
            Download PDF
          </CustomButton>
        </div>
      </Flex>
      <Flex
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
            <SingleSelect
              value={dateRange}
              onChange={(value) => setDateRange(String(value))}
              size="S"
            >
              <SingleSelectOption value="last_7_days">Last 7 Days</SingleSelectOption>
              <SingleSelectOption value="last_30_days">Last 30 Days</SingleSelectOption>
            </SingleSelect>
          </Flex>
        </Flex>
        <Grid marginTop={8} gap={4}>
          {DummyData.map((data) => (
            <DashboardCard key={data.id} data={data} />
          ))}
        </Grid>

        <Flex alignItems="flex-start" style={{ width: '100%' }}>
          <Box style={{ width: '65%' }}>
            <Box padding={6} hasRadius background="neutral0" shadow="filterShadow">
              <Flex direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="beta" fontWeight="semi-bold" textColor="neutral900">
                  Overall Performance
                </Typography>
                <Flex direction="row" alignItems="center" gap={5}>
                  <Flex gap={1} alignItems="center">
                    <span
                      style={{
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: '#F93E00',
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
                <PerformanceAnalytics />
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
              <Box padding={4} marginTop={4} className="max-h-96">
                <ClickThroughRateTrend />
              </Box>
            </Box>
          </Box>
          <Box
            style={{ width: '35%' }}
            padding={6}
            hasRadius
            background="neutral0"
            shadow="filterShadow"
          >
            <Typography
              variant="beta"
              fontWeight="semi-bold"
              textColor="neutral900"
              style={{ marginBottom: '1rem' }}
            >
              Ad Details
            </Typography>
            <Flex direction="column" alignItems="start" gap={4} marginTop={8}>
              <Flex justifyContent="space-between" style={{ width: '100%' }}>
                <Typography variant="delta" fontWeight="semi-bold" textColor="neutral900">
                  Campaign
                </Typography>
                <Typography variant="epsilon" textColor="neutral600">
                  Tourism Q1
                </Typography>
              </Flex>
              <Flex justifyContent="space-between" style={{ width: '100%' }}>
                <Typography variant="delta" fontWeight="semi-bold" textColor="neutral900">
                  Ad Name
                </Typography>
                <Typography variant="epsilon" textColor="neutral600">
                  Événement Révélateur
                </Typography>
              </Flex>
              <Flex justifyContent="space-between" style={{ width: '100%' }}>
                <Typography variant="delta" fontWeight="semi-bold" textColor="neutral900">
                  Entity name
                </Typography>
                <Typography variant="epsilon" textColor="neutral600">
                  Célébration Immobilière
                </Typography>
              </Flex>
              <Flex justifyContent="space-between" style={{ width: '100%' }}>
                <Typography variant="delta" fontWeight="semi-bold" textColor="neutral900">
                  Entity Registration
                </Typography>
                <Typography variant="epsilon" textColor="neutral600">
                  8798709EG
                </Typography>
              </Flex>
              <Flex justifyContent="space-between" style={{ width: '100%' }}>
                <Typography variant="delta" fontWeight="semi-bold" textColor="neutral900">
                  License Number
                </Typography>
                <Typography variant="epsilon" textColor="neutral600">
                  LCE090983
                </Typography>
              </Flex>
              <Flex justifyContent="space-between" style={{ width: '100%' }}>
                <Typography variant="delta" fontWeight="semi-bold" textColor="neutral900">
                  Ad Types
                </Typography>
                <Typography variant="epsilon" textColor="neutral600">
                  Display Ad
                </Typography>
              </Flex>
              <Flex justifyContent="space-between" style={{ width: '100%' }}>
                <Typography variant="delta" fontWeight="semi-bold" textColor="neutral900">
                  Format
                </Typography>
                <Typography variant="epsilon" textColor="neutral600">
                  native-large
                </Typography>
              </Flex>
              <Flex justifyContent="space-between" style={{ width: '100%' }}>
                <Typography variant="delta" fontWeight="semi-bold" textColor="neutral900">
                  Size
                </Typography>
                <Typography variant="epsilon" textColor="neutral600">
                  375 x 600
                </Typography>
              </Flex>
              <Flex justifyContent="space-between" style={{ width: '100%' }}>
                <Typography variant="delta" fontWeight="semi-bold" textColor="neutral900">
                  Start date
                </Typography>
                <Typography variant="epsilon" textColor="neutral600">
                  20 Aug 2025
                </Typography>
              </Flex>
              <Flex justifyContent="space-between" style={{ width: '100%' }}>
                <Typography variant="delta" fontWeight="semi-bold" textColor="neutral900">
                  End date
                </Typography>
                <Typography variant="epsilon" textColor="neutral600">
                  29 Aug 2025
                </Typography>
              </Flex>
              <Flex justifyContent="space-between" style={{ width: '100%' }}>
                <Typography variant="delta" fontWeight="semi-bold" textColor="neutral900">
                  Link type
                </Typography>
                <Typography variant="epsilon" textColor="neutral600">
                  External
                </Typography>
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </div>
  );
};

export default AdReport;
