'use strict';

/**
 *  controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const modelName = 'plugin::strapi-ads.campaign';
const { parseMultipartData } = require('@strapi/utils');
const { parseISO } = require('date-fns');
const _ = require('lodash');

const hasConflictingDates = async (ads, campaign) => {
  // First check if there is a local conflict within the ads array
  for (let i = 0; i < ads.length; i++) {
    const ad1 = ads[i];
    for (let j = i + 1; j < ads.length; j++) {
      const ad2 = ads[j];

      if (ad1.ad_status !== 'live' || ad2.ad_status !== 'live') {
        continue;
      }

      if (ad1.ad_spot !== ad2.ad_spot) {
        continue;
      }

      const screens1 = Array.isArray(ad1.ad_screens) ? ad1.ad_screens : [];
      const screens2 = Array.isArray(ad2.ad_screens) ? ad2.ad_screens : [];

      const shouldCheckDates =
        screens1.length === 0 ||
        screens2.length === 0 ||
        _.intersection(screens1, screens2).length > 0;

      if (!shouldCheckDates) {
        continue;
      }

      // Check if dates overlap
      const start1 = parseISO(ad1.ad_start_date);
      const end1 = parseISO(ad1.ad_end_date);
      const start2 = parseISO(ad2.ad_start_date);
      const end2 = parseISO(ad2.ad_end_date);

      if (start1 <= end2 && end1 >= start2) {
        return {
          conflict: true,
          adLocal: ad1,
          adRemote: { ...ad2, campaign: campaign, localAd: true },
          message: `Local conflict Ad at index ${i} conflicts with ad at index ${j} (same spot and screen with overlapping dates)`,
        };
      }
    }

    if (ad1.ad_status !== 'live') {
      continue;
    }

    const screens = Array.isArray(ad1.ad_screens) ? ad1.ad_screens : [];

    // Build the query filters
    const filters = {
      ad_status: 'live',
      ad_spot: ad1.ad_spot,
      ...(screens.length === 0
        ? { ad_screens: { $null: true } }
        : { ad_screens: { $in: screens } }),
      ad_start_date: { $lte: ad1.ad_end_date },
      ad_end_date: { $gte: ad1.ad_start_date },

      ...(ad1.id && { id: { $ne: ad1.id } }),
    };

    const conflictingAd = await strapi.db.query('plugin::strapi-ads.ad').findOne({
      where: filters,
      populate: ['campaign'],
    });

    if (conflictingAd) {
      return {
        conflict: true,
        adLocal: ad1,
        adRemote: conflictingAd,
        message: `Remote conflicts with existing ad (same spot and screen with overlapping dates)`,
      };
    }
  }
  return { conflict: false };
};

module.exports = createCoreController(modelName, ({ strapi }) => ({
  // Custom controller logic can be added here
  async create(ctx) {
    try {
      let data, files;
      if (ctx.is('multipart')) {
        const parsed = parseMultipartData(ctx);
        data = parsed.data;
        files = parsed.files;
        // You can also access parsed.files if needed
      } else {
        data = ctx.request.body;
      }

      const campaignData = _.omit(data, ['ads']);
      const checkConflict = await hasConflictingDates(data.ads, campaignData);
      if (checkConflict.conflict) {
        return {
          error: 'Conflict detected',
          message: checkConflict.message,
          details: checkConflict,
        };
      }

      const startDates = data.ads.map((ad) => parseISO(ad.ad_start_date)).filter(Boolean);
      const endDates = data.ads.map((ad) => parseISO(ad.ad_end_date)).filter(Boolean);

      const minStart = startDates.length ? new Date(Math.min(...startDates)) : null;
      const maxEnd = endDates.length ? new Date(Math.max(...endDates)) : null;

      campaignData.min_date = minStart;
      campaignData.max_date = maxEnd;
      let campaign;
      if (data.id) {
        campaign = await strapi.service(modelName).update(data.id, { data: campaignData });
      } else {
        campaign = await strapi.service(modelName).create({ data: campaignData });
      }

      for (let index = 0; index < data.ads.length; index++) {
        const adFiles = files?.[`ads.${index}.ad_image`];
        const ad = data.ads[index];
        if (ad.id) {
          await strapi.service('plugin::strapi-ads.ad').update(ad.id, {
            data: { ...ad },
            files: adFiles ? { ad_image: adFiles } : undefined,
          });
        } else {
          await strapi.service('plugin::strapi-ads.ad').create({
            data: { ...ad, campaign: campaign.id },
            files: adFiles ? { ad_image: adFiles } : undefined,
          });
        }
      }

      return await strapi.service(modelName).findOne(campaign.id, {
        populate: ['ads.ad_spot', 'ads.ad_screens', 'ads.ad_type', 'ads.ad_image'],
      });
    } catch (e) {
      console.log(e);
      return e;
    }
  },

  async fetchStat(ctx){
      try{
          return strapi.plugin('strapi-ads').service('campaign').fetchStat(ctx);
      }catch(e){
          console.error(e);
          return e;
      }
  },

  async fetchStatOverall(ctx){
      try{
          return strapi.plugin('strapi-ads').service('campaign').fetchStatOverall(ctx);
      }catch(e){
          console.error(e);
          return e;
      }
  },

  async generateAdsReport(ctx){
    try{
      return strapi.plugin('strapi-ads').service('campaign').generateAdsReport(ctx);
    }catch(e){
      console.error(e);
      return e;
    }
  },

}));
