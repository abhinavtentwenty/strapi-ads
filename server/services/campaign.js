'use strict';

/**
 *  service
 */

const { createCoreService } = require('@strapi/strapi').factories;
const _ = require('lodash');
const { deepOmit } = require('../utils/common');
const { subMonths, subDays, format } = require('date-fns');
const modelName = 'plugin::strapi-ads.campaign';
const adModel = 'plugin::strapi-ads.ad';
const adStatModel = 'plugin::strapi-ads.ad-stat';
const campaignStatModel = 'plugin::strapi-ads.campaign-stat';
const campaignModel = 'plugin::strapi-ads.campaign';


module.exports = createCoreService('plugin::strapi-ads.campaign', ({ strapi }) => ({
  async duplicate(ctx) {
    const { id } = ctx.params;
    const originalCampaign = await strapi.entityService.findOne('plugin::strapi-ads.campaign', id, {
      populate: ['ads', 'ads.ad_image'],
    });
    if (!originalCampaign) {
      ctx.throw(404, 'Campaign not found');
    }
    // @ts-ignore
    let { ads, ...campaignData } = originalCampaign;
    campaignData = deepOmit(campaignData, ['id', 'createdAt', 'updatedAt', 'publishedAt']);
    campaignData.campaign_name = `${campaignData.campaign_name} (Copy)-${originalCampaign?.id + 1}`;
    campaignData.campaign_id = await strapi
      .service('plugin::content-manager.uid')
      .generateUIDField({
        contentTypeUID: 'plugin::strapi-ads.campaign',
        field: 'campaign_id',
        data: {
          campaign_name: campaignData.campaign_name,
        },
      });
    const duplicatedCampaign = await strapi.entityService.create('plugin::strapi-ads.campaign', {
      data: {
        ...campaignData,
        campaign_name: campaignData.campaign_name,
        campaign_status: 'draft',
        published: true,
      },
    });
    // @ts-ignore
    if (ads?.length) {
      // @ts-ignore
      ads = ads?.map((ad) =>
        deepOmit(ad, ['id', 'createdAt', 'updatedAt', 'publishedAt', 'campaign'])
      );
      // @ts-ignore
      for (const ad of ads) {
        let { ad_image, ...adData } = ad;
        adData.ad_name = `${adData.ad_name} (Copy)-${new Date().getTime()}`;
        adData.ad_id = await strapi.service('plugin::content-manager.uid').generateUIDField({
          contentTypeUID: 'plugin::strapi-ads.ad',
          field: 'ad_id',
          data: {
            ad_name: adData.ad_name,
          },
        });
        await strapi.entityService.create('plugin::strapi-ads.ad', {
          data: {
            ...adData,
            campaign: duplicatedCampaign.id,
            ad_image: ad_image ? ad_image.id : null,
            ad_status: 'draft',
            published: true,
          },
        });
      }
    }
    return await strapi.entityService.findOne(
      'plugin::strapi-ads.campaign',
      duplicatedCampaign?.id,
      {
        populate: ['ads', 'campaign_status', 'ads.ad_status', 'ads.ad_image'],
      }
    );
  },

  async addNewCampaign(ctx) {
    const { campaignData, ads } = ctx.request.body;

    // Remove unwanted fields if present
    const cleanCampaignData = deepOmit(campaignData, [
      'id',
      'createdAt',
      'updatedAt',
      'publishedAt',
    ]);

    // Generate unique campaign_id
    cleanCampaignData.campaign_id = await strapi
      .service('plugin::content-manager.uid')
      .generateUIDField({
        contentTypeUID: 'plugin::strapi-ads.campaign',
        field: 'campaign_id',
        data: {
          campaign_name: cleanCampaignData.campaign_name,
        },
      });

    // Create campaign
    const newCampaign = await strapi.entityService.create('plugin::strapi-ads.campaign', {
      data: {
        ...cleanCampaignData,
        published: false,
      },
    });

    // Create ads if provided
    if (ads?.length) {
      for (const ad of ads) {
        let { ad_image, ...adData } = ad;
        adData.ad_id = await strapi.service('plugin::content-manager.uid').generateUIDField({
          contentTypeUID: 'plugin::strapi-ads.ad',
          field: 'ad_id',
          data: {
            ad_name: adData.ad_name,
          },
        });
        await strapi.entityService.create('plugin::strapi-ads.ad', {
          data: {
            ...adData,
            campaign: newCampaign.id,
            ad_image: ad_image ? ad_image.id : null,
            published: false,
          },
        });
      }
    }

    return await strapi.entityService.findOne('plugin::strapi-ads.campaign', newCampaign?.id, {
      populate: ['ads', 'campaign_status', 'ads.ad_status', 'ads.ad_image'],
    });
  },


  async aggregateDailyStats(date) {
    const statDate = date || format(subDays(new Date(), 1), 'yyyy-MM-dd');
    const dayBefore = format(subDays(new Date(statDate), 1), 'yyyy-MM-dd');

    const limit = 1;
    let offset = 0;
    let hasMore = true;
    const campaignAgg = {};

    do {
      const stats = await strapi.db
      .query(adStatModel)
      .findMany({
        where: { stat_date: statDate },
        fields: ["ad_id", "impressions", "clicks"],
        limit,
        offset,
      });
      console.log("loop" + offset);

      if (!stats.length) {
        hasMore = false;
        break;
      }

      const adIds = [...new Set(stats.map(s => s.ad_id))];
      const ads = await strapi.db.query(adModel).findMany({
        where: { id: { $in: adIds } },
        populate: { campaign: { fields: ["id"] } },
        fields: ["id"],
      });

      const adToCampaignMap = {};
      for (const ad of ads) {
        if (ad?.campaign?.id) {
          adToCampaignMap[ad.id] = ad.campaign.id;
        }
      }

      for (const stat of stats) {
        const campaignId = adToCampaignMap[stat.ad_id];
        if (!campaignId) continue;

        if (!campaignAgg[campaignId]) {
          campaignAgg[campaignId] = { impressions: 0, clicks: 0 };
        }

        campaignAgg[campaignId].impressions += parseInt(stat.impressions || 0, 10);
        campaignAgg[campaignId].clicks += parseInt(stat.clicks || 0, 10);
      }

      offset += limit;
      hasMore = stats.length === limit;
    } while (hasMore);

    const entries = Object.entries(campaignAgg);
    for (const [campaignId, data] of entries) {

      const previousDayStats = await strapi.db.query(campaignStatModel).findOne({
        where: { campaign_id: campaignId, stat_date: dayBefore },
        fields: ['total_impressions', 'total_clicks']
      });

      const previousTotalImpressions = previousDayStats?.total_impressions || 0;
      const previousTotalClicks = previousDayStats?.total_clicks || 0;

      const totalImpressions = parseInt(previousTotalImpressions, 10) + parseInt(data.impressions, 10);
      const totalClicks = parseInt(previousTotalClicks, 10) + parseInt(data.clicks, 10);

      const existing = await strapi.db.query(campaignStatModel).findOne({
        where: { campaign_id: campaignId, stat_date: statDate },
      });

      if (existing) {
        await strapi.db.query(campaignStatModel).update({
          where: { id: existing.id },
          data: {
            impressions: data.impressions,
            clicks: data.clicks,
            total_impressions: totalImpressions,
            total_clicks: totalClicks,
          },
        });
      } else {
        await strapi.db.query(campaignStatModel).create({
          data: {
            campaign_id: campaignId,
            stat_date: statDate,
            impressions: data.impressions,
            clicks: data.clicks,
            total_impressions: totalImpressions,
            total_clicks: totalClicks,
          },
        });
      }


      await strapi.db.query(campaignModel).update({
        where: { id: campaignId },
        data: {
          total_impressions: totalImpressions,
          total_clicks: totalClicks
        }
      });

    }

    strapi.log.info(
        `[Cron] Campaign stats aggregated for ${statDate} — ${entries.length} campaigns`
    );
  },

  async generateDailyStats(date) {
    const statDate = date || format(subDays(new Date(), 1), 'yyyy-MM-dd');

    const activeCampaigns = await strapi.db.query(modelName).count({
        where: {
          campaign_status: 'active',
          $or:[{ ads: {ad_end_date:null} },{ ads: {ad_end_date:{$gte:statDate}} } ],
          ads: {
            ad_status: "live",
            ad_start_date:{$lte:statDate},
          }
        },
    });

    const activeAds = await strapi.db.query(adModel).count({
      where: {
        campaign: { campaign_status: 'active' },
        ad_status: "live",
        ad_start_date:{$lte:statDate},
        $or:[{ad_end_date:null},{ad_end_date:{$gte:statDate}} ]
      }
    });


    const campaignStats = await strapi.db.connection
    .select(
        strapi.db.connection.sum('impressions').as('daily_impressions'),
        strapi.db.connection.sum('clicks').as('daily_clicks')
    )
    .from('campaign_stats')
    .where('stat_date', statDate)
    .first();

    const dailyImpressions = parseInt(campaignStats?.daily_impressions || 0, 10);
    const dailyClicks = parseInt(campaignStats?.daily_clicks || 0, 10);

    const dayBefore = format(subDays(new Date(statDate), 1), 'yyyy-MM-dd');
    const previousDayStats = await strapi.db.query("plugin::strapi-ads.daily-system-stat").findOne({
      where: { stat_date: dayBefore },
      fields: ['total_impressions', 'total_clicks']
    });

    const previousTotalImpressions = previousDayStats?.total_impressions || 0;
    const previousTotalClicks = previousDayStats?.total_clicks || 0;

    const totalImpressions = previousTotalImpressions + dailyImpressions;
    const totalClicks = previousTotalClicks + dailyClicks;


    console.log(
        {
            stat_date: statDate,
            active_campaigns: activeCampaigns,
            active_ads: activeAds,
            impressions: dailyImpressions,
            clicks: dailyClicks,
            total_impressions: totalImpressions,
            total_clicks: totalClicks,

          }
    )


    const existing = await strapi.db.query("plugin::strapi-ads.daily-system-stat").findOne({
      where: { stat_date: statDate },
    });

    if (existing) {
      await strapi.db.query("plugin::strapi-ads.daily-system-stat").update({
        where: { id: existing.id },
        data: {
          stat_date: statDate,
          impressions: dailyImpressions,
          clicks: dailyClicks,
          active_campaigns: activeCampaigns,
          active_ads: activeAds,
          total_impressions: totalImpressions,
          total_clicks: totalClicks,
        },
      });
    } else {
      await strapi.db.query("plugin::strapi-ads.daily-system-stat").create({
        data: {
          stat_date: statDate,
          impressions: dailyImpressions,
          clicks: dailyClicks,
          active_campaigns: activeCampaigns,
          active_ads: activeAds,
          total_impressions: totalImpressions,
          total_clicks: totalClicks,
        },
      });
    }

    strapi.log.info(`Daily stats generated for ${statDate}`);
  },


  async fetchStat(ctx){
    const { id } = ctx.request.params;

    const today = format(new Date(), 'yyyy-MM-dd');
    const totalActiveAds = await strapi.db.query(adModel).count({
      where: {
        ad_status: 'live',
        campaign: { id, campaign_status: 'active' },
        ad_start_date: { $lte: today },
        $or: [{ ad_end_date: null }, { ad_end_date: { $gte: today } }],
      },
    });

    const latestStats = await strapi.db.query('plugin::strapi-ads.campaign-stat').findMany({
      where: { campaign_id: id },
      fields: ['stat_date', 'total_impressions', 'total_clicks'],
      orderBy: { stat_date: 'desc' },
      limit: 2
    });

    if (latestStats.length === 0) {
      return {
        data:{
          stats:[{
            label:'Active Ads',type:'ads',total: totalActiveAds, delta:0,
          }, {
            label:'Total Impressions',type:'impressions',total:0,delta:0,
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
            label:'Active Ads',type:'ads',total: totalActiveAds, delta:0,
          },
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

  async fetchStatOverall(ctx){

    const totalCampaigns = await strapi.db.query('plugin::strapi-ads.campaign').count();

    const lastMonthDate = format(subMonths(new Date(), 1), 'yyyy-MM-dd');
    const campaignsSinceLastMonth = await strapi.db.query('plugin::strapi-ads.campaign').count({
      where: {
        createdAt: { $gte: lastMonthDate }
      }
    });

    const latestStats = await strapi.db.query('plugin::strapi-ads.daily-system-stat').findMany({
      fields: ['stat_date', 'total_impressions', 'total_clicks'],
      orderBy: { stat_date: 'desc' },
      limit: 2
    });

    if (latestStats.length === 0) {
      return {
        data:{
          stats:[
            {
              label:'Total Campaigns',
              type:'ads',
              total: totalCampaigns,
              delta: totalCampaigns-campaignsSinceLastMonth,
              text: 'this month',
            }, {
            label:'Active Ads',type:'ads',total: 0, delta:0,
          }, {
            label:'Total Impressions',type:'impressions',total:0,delta:0,
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
    const timeDifferenceTextTotalAds = previousWeek == lastWeek ? 'since last week' : 'since previous week';


    // Calculate current values
    const currentTotalImpressions = parseInt(currentStats?.total_impressions || 0, 10);
    const currentTotalClicks = parseInt(currentStats?.total_clicks || 0, 10);
    const totalActiveAds = parseInt(currentStats?.active_ads || 0, 10);

    // Calculate previous day values
    const previousTotalImpressions = parseInt(previousStats?.total_impressions || 0, 10);
    const previousTotalClicks = parseInt(previousStats?.total_clicks || 0, 10);


    // Calculate previous week values
    const previousWeekStats = await strapi.db.query('plugin::strapi-ads.daily-system-stat').findOne({
      where: { stat_date: previousWeek },
      fields: ['total_impressions', 'total_clicks', 'active_ads']
    });
    const previousWeekTotalImpressions = parseInt(previousWeekStats?.total_impressions || 0, 10);
    const previousWeekTotalClicks = parseInt(previousWeekStats?.total_clicks || 0, 10);
    const previousWeekActiveAds = parseInt(previousWeekStats?.active_ads || 0, 10);

    // Calculate CTR
    const currentCTR = currentTotalImpressions > 0 ? ((currentTotalClicks / currentTotalImpressions) * 100).toFixed(2) : 0;
    const previousWeekCTR = previousWeekTotalImpressions > 0 ? ((previousWeekTotalClicks / previousWeekTotalImpressions) * 100).toFixed(2) : 0;






    // Calculate deltas
    const impressionsDelta = currentTotalImpressions - previousTotalImpressions;
    const clicksDelta = currentTotalClicks - previousTotalClicks;
    const ctrDelta = parseFloat(currentCTR) - parseFloat(previousWeekCTR);

    const activeAdsDelta = totalActiveAds - previousWeekActiveAds;

    return {
      data: {
        stats: [
          {
            label:'Total Campaigns',
            type:'ads',
            total: totalCampaigns,
            delta: totalCampaigns-campaignsSinceLastMonth,
            text: 'this month',
          },{
            label:'Active Ads',
            type:'ads',
            total: totalActiveAds,
            delta: activeAdsDelta,
            text: timeDifferenceTextTotalAds,
          },
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
  }
}));
