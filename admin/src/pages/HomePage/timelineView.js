// @ts-nocheck
import { Typography } from '@strapi/design-system';
import {
  GanttCreateMarkerTrigger,
  GanttFeatureItem,
  GanttFeatureList,
  GanttHeader,
  GanttProvider,
  GanttSidebar,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
} from '../../components/ui/shadcn-io/gantt';
import CustomBadge from '../../components/elements/badge';

import { useState, useEffect } from 'react';
import { ContextMenu, ContextMenuTrigger } from '../../components/ui/context-menu';
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const TimelineView = ({ paginatedCampaigns = [] }) => {
  const [features, setFeatures] = useState(
    () =>
      paginatedCampaigns?.map((c) => {
        const adsArray = Array.isArray(c.ads) ? c.ads : [];
        return {
          id: c.id,
          name: capitalize(c.campaign_name),
          startAt: adsArray[0]?.ad_start_date ? new Date(adsArray[0].ad_start_date) : null,
          endAt: adsArray[0]?.ad_end_date ? new Date(adsArray[0].ad_end_date) : null,
          status: c?.campaign_status?.status_title,
          description: c.campaign_id,
          ads: adsArray.map((ad) => ({
            id: ad.id,
            name: capitalize(ad.ad_headline),
            startAt: ad.ad_start_date ? new Date(ad.ad_start_date) : null,
            endAt: ad.ad_end_date ? new Date(ad.ad_end_date) : null,
            img: ad.ad_image?.[0]?.url,
            status: ad?.ad_status?.status_title,
            description: ad.ad_description,
          })),
        };
      }) || []
  );

  // TODO: Fix this temporary style injection hack
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      div:has(section + div) {
        width: calc(100% - 3.5rem) !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const flatFeatures = features.flatMap((feature) => [...(feature.ads || [])]);

  const handleViewFeature = (id) => console.log(`Feature selected: ${id}`);
  const handleCopyLink = (id) => console.log(`Copy link: ${id}`);
  const handleRemoveFeature = (id) =>
    setFeatures((prev) => prev.filter((feature) => feature.id !== id));
  const handleRemoveMarker = (id) => console.log(`Remove marker: ${id}`);
  const handleCreateMarker = (date) => console.log(`Create marker: ${date.toISOString()}`);
  const handleMoveFeature = (id, startAt, endAt) => {
    if (!endAt) {
      return;
    }
    setFeatures((prev) =>
      prev.map((feature) => (feature.id === id ? { ...feature, startAt, endAt } : feature))
    );
  };
  const handleAddFeature = (date) => console.log(`Add feature: ${date.toISOString()}`);
  return (
    <GanttProvider
      className="border"
      //  onAddItem={handleAddFeature}
      range="daily"
      zoom={100}
    >
      <GanttSidebar>
        {features.map((feature) => (
          <GanttSidebarItem
            adLength={feature.ads.length}
            feature={feature}
            key={feature.id}
            onSelectItem={handleViewFeature}
          />
        ))}
      </GanttSidebar>
      <GanttTimeline>
        <GanttHeader />
        <GanttFeatureList>
          {flatFeatures.map((feature) => (
            <div className="flex" key={feature.id}>
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <button onClick={() => handleViewFeature(feature.id)} type="button">
                    <GanttFeatureItem onMove={handleMoveFeature} {...feature}>
                      <div
                        className="flex items-center gap-2"
                        style={{
                          padding: '20px 12px',
                        }}
                      >
                        <img
                          src={feature.img || ''}
                          alt={feature.name}
                          style={{ width: 44, height: 44, borderRadius: 6 }}
                        />
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-normal leading-5">{feature.name}</p>
                          <div className=" flex items-center gap-1">
                            <CustomBadge variant={feature.status}>{feature.status}</CustomBadge>
                            <CustomBadge variant="draft">Native card</CustomBadge>
                            <CustomBadge variant="grayOutline">Lifestyle listing</CustomBadge>
                          </div>
                          <Typography type="pi" textColor="neutral600">
                            {feature.startAt.toDateString()} - {feature.endAt.toDateString()}
                          </Typography>
                        </div>
                      </div>
                    </GanttFeatureItem>
                  </button>
                </ContextMenuTrigger>
              </ContextMenu>
            </div>
          ))}
        </GanttFeatureList>
        <GanttToday />
        <GanttCreateMarkerTrigger onCreateMarker={handleCreateMarker} />
      </GanttTimeline>
    </GanttProvider>
  );
};
export default TimelineView;
