// @ts-nocheck
import { faker } from '@faker-js/faker';
import { Typography } from '@strapi/design-system';
import {
  GanttCreateMarkerTrigger,
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttMarker,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
} from '../../components/ui/shadcn-io/gantt';
import { Badge } from '../../components/elements/badge';

import groupBy from 'lodash.groupby';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '../../components/ui/context-menu';
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const Example = ({ paginatedCampaigns = [] }) => {
  const [features, setFeatures] = useState(() =>
    paginatedCampaigns.map((c) => {
      return {
        id: c.id,
        name: capitalize(c.campaign_name),
        startAt: new Date(c.ads[0]?.ad_start_date),
        endAt: new Date(c.ads[0]?.ad_end_date),
        status: c?.campaign_status?.status_title,
        description: c.campaign_id,
        ads: c.ads.map((ad) => {
          return {
            id: ad.id,
            name: capitalize(ad.ad_headline),
            startAt: new Date(ad.ad_start_date),
            endAt: new Date(ad.ad_end_date),
            img: ad.ad_image[0]?.url,
            status: ad?.ad_status?.status_title,
            description: ad.ad_description,
          };
        }),
      };
    })
  );

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
    console.log(`Move feature: ${id} from ${startAt} to ${endAt}`);
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
                            <Badge $variant={feature.status}>{feature.status}</Badge>
                            <Badge $variant="draft">Native card</Badge>
                            <Badge $variant="grayOutline">Lifestyle listing</Badge>
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
export default Example;
