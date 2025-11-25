'use strict';

/**
 *  service
 */

const { createCoreService } = require('@strapi/strapi').factories;
const { deepOmit } = require('../utils/common');
const {format,subDays}=require("date-fns");
module.exports = createCoreService('plugin::strapi-ads.ad', ({ strapi }) => ({
  async duplicate(ctx) {
    const { id } = ctx.params;
    const originalAd = await strapi.entityService.findOne('plugin::strapi-ads.ad', id, {
      populate: ['ad_status', 'ad_image', 'campaign'],
    });
    if (!originalAd) {
      ctx.throw(404, 'Ad not found');
    }
    let { ad_image, campaign, ...adData } = originalAd;
    adData = deepOmit(adData, ['id', 'createdAt', 'updatedAt', 'publishedAt']);
    adData.ad_name = `${adData.ad_name} (Copy)-${new Date().getTime()}`;
    adData.ad_id = await strapi.service('plugin::content-manager.uid').generateUIDField({
      contentTypeUID: 'plugin::strapi-ads.ad',
      field: 'ad_id',
      data: {
        ad_name: adData.ad_name,
      },
    });
    const duplicatedAd = await strapi.entityService.create('plugin::strapi-ads.ad', {
      data: {
        ...adData,
        campaign: campaign ? campaign?.id : null,
        ad_image: ad_image ? ad_image?.id : null,
        ad_status: 'draft',
        published: true,
      },
    });
    return await strapi.entityService.findOne('plugin::strapi-ads.ad', duplicatedAd?.id, {
      populate: ['ad_status', 'ad_image', 'campaign'],
    });
  },

  async fetchStat(ctx){
    const { id } = ctx.request.params;
    const latestStats = await strapi.db.query('plugin::strapi-ads.ad-stat').findMany({
      where: { ad_id: id },
      fields: ['stat_date', 'total_impressions', 'total_clicks'],
      orderBy: { stat_date: 'desc' },
      limit: 2
    });

    if (latestStats.length === 0) {
      return {
        data:{
          stats:[{
            label:'Total Impressions',type:'impressions',total_impressions:0,delta:0,
          },{
            label:'Total CLicks',type:'clicks',total:0,delta:0,
          },{
            label:'CTR',type:'ctr',total:0,delta:0,
          }]
        }
      };
    }

    const currentStats = latestStats[0] || {};
    const previousStats = latestStats[1] || {};

    const previousDate = previousStats?.stat_date;
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    const timeDifferenceText = previousDate == yesterday ? 'since yesterday' : 'since previous day';

    const currentDate = currentStats?.stat_date;
    const previousWeek = format(subDays(new Date(currentDate), 7), 'yyyy-MM-dd');
    const lastWeek = format(subDays(new Date(), 7), 'yyyy-MM-dd');
    const timeDifferenceTextCtr = previousWeek == lastWeek ? 'vs last week' : 'vs previous week';

    const previousWeekStats = await strapi.db.query('plugin::strapi-ads.ad-stat').findOne({
      where: { ad_id: id, stat_date: previousWeek },
      fields: ['total_impressions', 'total_clicks']
    });

    const currentTotalImpressions = parseInt(currentStats?.total_impressions || 0, 10);
    const currentTotalClicks = parseInt(currentStats?.total_clicks || 0, 10);

    const previousTotalImpressions = parseInt(previousStats?.total_impressions || 0, 10);
    const previousTotalClicks = parseInt(previousStats?.total_clicks || 0, 10);

    const previousWeekTotalImpressions = parseInt(previousWeekStats?.total_impressions || 0, 10);
    const previousWeekTotalClicks = parseInt(previousWeekStats?.total_clicks || 0, 10);

    // Calculate CTR
    const currentCTR = currentTotalImpressions > 0 ? ((currentTotalClicks / currentTotalImpressions) * 100).toFixed(2) : 0;
    const previousWeekCTR = previousWeekTotalImpressions > 0 ? ((previousWeekTotalClicks / previousWeekTotalImpressions) * 100).toFixed(2) : 0;

    // Calculate deltas
    const impressionsDelta = currentTotalImpressions - previousTotalImpressions;
    const clicksDelta = currentTotalClicks - previousTotalClicks;
    const ctrDelta = parseFloat(currentCTR) - parseFloat(previousWeekCTR);

    return {
      data: {
        stats: [
          {
            label: 'Total Impressions',
            type: 'impressions',
            total: currentTotalImpressions,
            delta: impressionsDelta,
            text: timeDifferenceText,
          },
          {
              label: 'Total CLicks',
              type: 'clicks',
              total: currentTotalClicks,
              delta: clicksDelta,
              text: timeDifferenceText,
          },
          {
            label: 'CTR',
              type: 'ctr',
              total: parseFloat(currentCTR),
              delta: parseFloat(ctrDelta.toFixed(2)),
              text: timeDifferenceTextCtr,
          }
        ]
      }
  };
  },

  async getDestinationPage(ctx){
    const { ad_destination_model } = ctx.request.params;
    const { pagination = {}, filters = {} } = ctx.request.query;

    const destinationModels = strapi.plugin('strapi-ads').config('destinationModelConfig');

    const destination = destinationModels[ad_destination_model];

    if(!destination){
      ctx.throw(400, 'Invalid destination model');
    }

    const pages = await strapi.service(destination.model).find({
      filters: { ...destination.filters, ...filters },
      fields: destination.fields ? destination.fields : undefined,
      pagination: {pageSize: 10, ...pagination },
      sort: { ...destination.sort },
    });

    return pages;
  }
}));
