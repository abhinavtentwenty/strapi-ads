'use strict';

/**
 *  service
 */

const { createCoreService } = require('@strapi/strapi').factories;
const { deepOmit } = require('../utils/common');
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
        published: false,
      },
    });
    return await strapi.entityService.findOne('plugin::strapi-ads.ad', duplicatedAd?.id, {
      populate: ['ad_status', 'ad_image', 'campaign'],
    });
  },
}));
