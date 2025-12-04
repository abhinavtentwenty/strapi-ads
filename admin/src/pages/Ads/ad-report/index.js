// @ts-nocheck
import React, { useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
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

import useUnpublishOrArchiveAd from '../../../components/hooks/useUnpublisOrArchiveAd';
import useAd from '../../../components/hooks/useAd';
import StatusBadge from '../../../components/elements/statusBadge';
import { AD_STATUS_OPTIONS, TIMEFRAME_OPTIONS } from '../../../utils/constants';
import useAdType from '../../../components/hooks/useAdType';
import emptyImage from '../../../assets/emptyImage.png';
import useAdStats from '../../../components/hooks/useAdStats';
import useAdGraph from '../../../components/hooks/useAdGraph';
import useDownloadPdf from '../../../components/hooks/useDownloadPdf';

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
  const { id } = useParams();
  const pdfRef = useRef();
  const downloadPdf = useDownloadPdf();
  const { adGraph } = useAdGraph({ id });

  const { adTypes } = useAdType();
  const { stats } = useAdStats(id);
  const [status, setStatus] = React.useState(['']);
  const [type, setType] = React.useState('');
  const [dateRange, setDateRange] = React.useState('');
  const [openMorePopover, setOpenMorePopover] = React.useState(false);
  const morePopoverRef = React.useRef(null);
  const [isOpenArchiveAdModal, setIsOpenArchiveAdModal] = React.useState(false);
  const [isOpenUnpublishAdModal, setIsOpenUnpublishAdModal] = React.useState(false);
  const history = useHistory();
  const { ad } = useAd(id);
  const { updateAdStatus } = useUnpublishOrArchiveAd();

  const handleUnpublish = () => {
    updateAdStatus({
      adId: ad.id,
      status: 'inactive',
      onComplete: () => setIsOpenUnpublishAdModal(false),
    });
  };

  const handleArchive = () => {
    updateAdStatus({
      adId: ad.id,
      status: 'archived',
      onComplete: () => setIsOpenArchiveAdModal(false),
    });
  };

  return (
    <div>
      <ConfirmArchiveModal
        isOpen={isOpenArchiveAdModal}
        setIsOpen={setIsOpenArchiveAdModal}
        onSubmit={handleArchive}
        variant="ads"
      />
      <ConfirmUnpublishModal
        isOpen={isOpenUnpublishAdModal}
        setIsOpen={setIsOpenUnpublishAdModal}
        onSubmit={handleUnpublish}
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
            src={
              Array.isArray(ad?.ad_image?.data) && ad.ad_image.data[0]?.url
                ? ad.ad_image.data[0].url
                : emptyImage
            }
            alt={ad?.ad_name || ''}
            style={{ width: 55, height: 55, borderRadius: 6 }}
          />
          <div className="flex flex-col gap-1">
            <Flex alignItems="center" gap={1}>
              <Typography variant="beta">{ad?.ad_name}</Typography>
              <div className=" flex items-center gap-1">
                {ad?.ad_type && <CustomBadge variant="draft">{ad?.ad_type?.title}</CustomBadge>}
                {ad?.ad_spot && (
                  <CustomBadge variant="grayOutline">{ad?.ad_spot?.ad_spot_title}</CustomBadge>
                )}
                <StatusBadge status={ad?.ad_status} />
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

          {/* <CustomButton onClick={() => {}}>
            <Analytics stroke="#32324d" />
            View Report
          </CustomButton> */}
          {/* <CustomButton onClick={() => history.push('ad-report')}>
            <Save stroke="#32324d" />
            Save
          </CustomButton> */}

          <CustomButton onClick={() => downloadPdf(pdfRef, `${ad?.ad_name}-report.pdf`)}>
            <Download stroke="#32324d" />
            Download PDF
          </CustomButton>
        </div>
      </Flex>
      <Flex
        ref={pdfRef}
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
            {/* <MultiSelect value={status} onChange={(value) => setStatus(value)} size="S">
              {AD_STATUS_OPTIONS.map((status) => (
                <MultiSelectOption key={status.value} value={status.value}>
                  {status.label}
                </MultiSelectOption>
              ))}
            </MultiSelect> */}
            {/* <SingleSelect value={type} onChange={(value) => setType(String(value))} size="S">
              <SingleSelectOption key={0} value="">
                All Types
              </SingleSelectOption>
              {adTypes.map((type) => (
                <SingleSelectOption key={type?.id} value={type?.id}>
                  {type?.title}
                </SingleSelectOption>
              ))}
            </SingleSelect> */}
            <SingleSelect
              value={dateRange}
              onChange={(value) => setDateRange(String(value))}
              size="S"
            >
              {TIMEFRAME_OPTIONS.map((timeframe) => (
                <SingleSelectOption key={timeframe?.value} value={timeframe?.value}>
                  {timeframe?.label}
                </SingleSelectOption>
              ))}
            </SingleSelect>
          </Flex>
        </Flex>
        <Grid marginTop={8} gap={4}>
          {stats?.length > 0 && stats?.map((stat) => <DashboardCard key={stat.type} data={stat} />)}
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
                <PerformanceAnalytics data={adGraph} />
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
                <ClickThroughRateTrend data={adGraph} />
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
                  {ad?.campaign?.campaign_name || ''}
                </Typography>
              </Flex>
              <Flex justifyContent="space-between" style={{ width: '100%' }}>
                <Typography variant="delta" fontWeight="semi-bold" textColor="neutral900">
                  Ad Name
                </Typography>
                <Typography variant="epsilon" textColor="neutral600">
                  {ad?.ad_name || ''}
                </Typography>
              </Flex>
              <Flex justifyContent="space-between" style={{ width: '100%' }}>
                <Typography variant="delta" fontWeight="semi-bold" textColor="neutral900">
                  Entity name
                </Typography>
                <Typography variant="epsilon" textColor="neutral600">
                  {ad?.campaign?.campaign_entity_name || ''}
                </Typography>
              </Flex>
              <Flex justifyContent="space-between" style={{ width: '100%' }}>
                <Typography variant="delta" fontWeight="semi-bold" textColor="neutral900">
                  Entity Registration
                </Typography>
                <Typography variant="epsilon" textColor="neutral600">
                  {ad?.campaign?.campaign_entity_type || ''}
                </Typography>
              </Flex>
              <Flex justifyContent="space-between" style={{ width: '100%' }}>
                <Typography variant="delta" fontWeight="semi-bold" textColor="neutral900">
                  License Number
                </Typography>
                <Typography variant="epsilon" textColor="neutral600">
                  {ad?.campaign?.campaign_entity_license_number || ''}
                </Typography>
              </Flex>
              <Flex justifyContent="space-between" style={{ width: '100%' }}>
                <Typography variant="delta" fontWeight="semi-bold" textColor="neutral900">
                  Ad Types
                </Typography>
                <Typography variant="epsilon" textColor="neutral600">
                  {ad?.ad_type?.title || ''}
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
                  {ad?.ad_start_date || ''}
                </Typography>
              </Flex>
              <Flex justifyContent="space-between" style={{ width: '100%' }}>
                <Typography variant="delta" fontWeight="semi-bold" textColor="neutral900">
                  End date
                </Typography>
                <Typography variant="epsilon" textColor="neutral600">
                  {ad?.ad_end_date || ''}
                </Typography>
              </Flex>
              <Flex justifyContent="space-between" style={{ width: '100%' }}>
                <Typography variant="delta" fontWeight="semi-bold" textColor="neutral900">
                  Link type
                </Typography>
                <Typography variant="epsilon" textColor="neutral600">
                  {ad?.ad_external_url ? 'External' : 'Internal'}
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
