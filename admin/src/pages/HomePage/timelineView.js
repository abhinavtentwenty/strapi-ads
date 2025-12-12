// @ts-nocheck
import { Box, Flex, Typography } from '@strapi/design-system';
import CustomBadge from '../../components/elements/badge';
import {
  GanttCreateMarkerTrigger,
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
} from '../../components/ui/shadcn-io/gantt';
import { truncate } from '../../utils/utils';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import StatusBadge from '../../components/elements/statusBadge';
import { ContextMenu, ContextMenuTrigger } from '../../components/ui/context-menu';
import CustomIconButton from '../../components/elements/customIconButton';
import Analytics from '../../components/Icons/Analytics';
import ActionMenu from './actionMenu';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const TimelineView = ({ filters, isLoading, paginatedCampaigns = [] }) => {
  const history = useHistory();
  const [groupedFeatures, setGroupedFeatures] = useState({});

  // Update features when paginatedCampaigns changes
  useEffect(() => {
    const grouped = {};

    paginatedCampaigns?.forEach((c) => {
      const adsArray = Array.isArray(c.ads) ? c.ads : [];

      // Use campaign_name as the group key
      const groupKey = c.campaign_name;

      grouped[groupKey] = {
        id: c.id,
        name: capitalize(c.campaign_name),
        startAt: c.min_date ? new Date(c.min_date) : null,
        endAt: c.max_date ? new Date(c.max_date) : null,
        campaign_status: c?.campaign_status,
        description: c.campaign_id,
        // Map ads as features for this group
        ads: adsArray.map((ad) => ({
          id: ad.id,
          campaignId: c.id,
          name: capitalize(ad.ad_name),
          startAt: ad.ad_start_date ? new Date(ad.ad_start_date) : null,
          endAt: ad.ad_end_date ? new Date(ad.ad_end_date) : null,
          img: ad.ad_image?.url ?? '',
          adType: ad?.ad_type?.title ?? null,
          adSpot: ad?.ad_spot?.ad_spot_title ?? null,
          status: c?.campaign_status === 'draft' ? 'draft' : ad?.ad_status,
          description: ad.ad_description,
        })),
      };
    });

    setGroupedFeatures(grouped);
  }, [paginatedCampaigns]);

  console.log('Grouped Features:', groupedFeatures);

  const handleViewFeature = (id) => {
    // This is for sidebar - just logs, scrolling is handled by GanttSidebarItem
    console.log(`Feature selected: ${id}`);
  };

  const handleViewAd = (adId, campaignId) => {
    history.push(`campaigns/view/${campaignId}?ad=${adId}`);
  };

  const handleCreateMarker = (date) => console.log(`Create marker: ${date.toISOString()}`);

  const handleMoveFeature = (id, startAt, endAt) => {
    if (!endAt) {
      return;
    }

    setGroupedFeatures((prev) => {
      const updated = { ...prev };

      // Update the ad with matching id across all groups
      Object.keys(updated).forEach((groupName) => {
        updated[groupName].ads = updated[groupName].ads.map((ad) =>
          ad.id === id ? { ...ad, startAt, endAt } : ad
        );
      });

      return updated;
    });

    console.log(`Move feature: ${id} from ${startAt} to ${endAt}`);
  };

  const handleAddFeature = (date) => console.log(`Add feature: ${date.toISOString()}`);

  if (isLoading) {
    return <div></div>;
  }

  if (Object.keys(groupedFeatures).length === 0) {
    return (
      <div
        style={{ height: '50vh', width: '100%' }}
        className="flex flex-col gap-4 items-center justify-center"
      >
        <div className="text-gray-500 text-lg">No content found</div>
      </div>
    );
  }

  return (
    <div style={{ width: 'calc(100vw - 284px)', height: '68vh' }}>
      <GanttProvider className="border" range="daily" zoom={100}>
        <GanttSidebar>
          {Object.entries(groupedFeatures).map(([campaignName, campaignData]) => (
            <GanttSidebarGroup
              key={campaignData.id}
              header={
                <Box width="100%" paddingTop={2}>
                  <StatusBadge status={campaignData.campaign_status} />
                  <Flex
                    className="gap-2"
                    style={{ justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Flex direction="column" alignItems="flex-start">
                      <Typography
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: '16px',
                          lineHeight: '20px',
                          fontWeight: '500',
                          maxWidth: '180px',
                        }}
                        title={campaignData.name}
                      >
                        {campaignData.name}
                      </Typography>
                      <Typography
                        style={{
                          fontWeight: 400,
                          fontSize: '10px',
                          lineHeight: '20px',
                          color: '#62627B',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          maxWidth: '180px',
                        }}
                        title={campaignData.description}
                      >
                        {campaignData.description}
                      </Typography>
                    </Flex>
                    <Flex className="gap-2">
                      {campaignData?.campaign_status !== 'draft' && (
                        <CustomIconButton
                          onClick={() => history.push(`campaigns/report/${campaignData.id}`)}
                          ariaLabel="View Analytics"
                        >
                          <Analytics />
                        </CustomIconButton>
                      )}
                      <ActionMenu data={campaignData} filters={filters} />
                    </Flex>
                  </Flex>
                </Box>
              }
            >
              {campaignData.ads.map((ad) => (
                <GanttSidebarItem feature={ad} key={ad.id} onSelectItem={handleViewFeature} />
              ))}
            </GanttSidebarGroup>
          ))}
        </GanttSidebar>

        <GanttTimeline>
          <GanttHeader />
          <GanttFeatureList>
            {Object.entries(groupedFeatures).map(([campaignName, campaignData]) => (
              <GanttFeatureListGroup key={campaignData.id}>
                {campaignData.ads.map((ad) => (
                  <div className="flex" key={ad.id}>
                    <ContextMenu>
                      <ContextMenuTrigger asChild>
                        <button
                          onClick={() => handleViewAd(ad.id, ad.campaignId)}
                          type="button"
                          style={{ width: '100%' }}
                        >
                          <GanttFeatureItem onMove={handleMoveFeature} {...ad}>
                            <Flex
                              background="neutral0"
                              gap={2}
                              alignItems="center"
                              paddingLeft={4}
                              width="100%"
                              paddingTop={1}
                              paddingBottom={1}
                            >
                              <Box
                                as="img"
                                src={ad.img || ''}
                                alt={ad.name}
                                style={{
                                  width: '44px',
                                  height: '44px',
                                  borderRadius: '6px',
                                  objectFit: 'cover',
                                }}
                              />
                              <Flex direction="column" gap={1} alignItems="flex-start">
                                <Typography
                                  variant="omega"
                                  fontWeight="regular"
                                  textColor="neutral800"
                                  style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    lineHeight: '20px',
                                  }}
                                  title={ad.name}
                                >
                                  {ad.name}
                                </Typography>
                                <Flex gap={1} alignItems="center">
                                  <StatusBadge status={ad.status} />
                                  {ad.adType && (
                                    <CustomBadge variant="draft">{ad.adType}</CustomBadge>
                                  )}
                                  {ad.adSpot && (
                                    <CustomBadge variant="grayOutline">{ad.adSpot}</CustomBadge>
                                  )}
                                </Flex>
                                <Typography variant="pi" textColor="neutral600">
                                  {ad.startAt && !isNaN(ad.startAt)
                                    ? ad.startAt.toDateString()
                                    : ''}
                                  {' - '}
                                  {ad.endAt && !isNaN(ad.endAt) ? ad.endAt.toDateString() : ''}
                                </Typography>
                              </Flex>
                            </Flex>
                          </GanttFeatureItem>
                        </button>
                      </ContextMenuTrigger>
                    </ContextMenu>
                  </div>
                ))}
              </GanttFeatureListGroup>
            ))}
          </GanttFeatureList>
          <GanttToday />
          <GanttCreateMarkerTrigger onCreateMarker={handleCreateMarker} />
        </GanttTimeline>
      </GanttProvider>
    </div>
  );
};

export default TimelineView;
