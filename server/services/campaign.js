'use strict';

/**
 *  service
 */

const { createCoreService } = require('@strapi/strapi').factories;
const _ = require('lodash');
const { deepOmit } = require('../utils/common');
module.exports = createCoreService('plugin::custom-ui.campaign', ({ strapi }) => ({
  async duplicate(ctx) {
    const { id } = ctx.params;
    const originalCampaign = await strapi.entityService.findOne('plugin::custom-ui.campaign', id, {
      populate: ['ads', 'campaign_status', 'ads.ad_status', 'ads.ad_image'],
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
        contentTypeUID: 'plugin::custom-ui.campaign',
        field: 'campaign_id',
        data: {
          campaign_name: campaignData.campaign_name,
        },
      });
    const duplicatedCampaign = await strapi.entityService.create('plugin::custom-ui.campaign', {
      data: {
        ...campaignData,
        campaign_name: campaignData.campaign_name,
        published: false,
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
          contentTypeUID: 'plugin::custom-ui.ad',
          field: 'ad_id',
          data: {
            ad_name: adData.ad_name,
          },
        });
        await strapi.entityService.create('plugin::custom-ui.ad', {
          data: {
            ...adData,
            campaign: duplicatedCampaign.id,
            ad_image: ad_image ? ad_image.id : null,
            published: false,
          },
        });
      }
    }
    return await strapi.entityService.findOne(
      'plugin::custom-ui.campaign',
      duplicatedCampaign?.id,
      {
        populate: ['ads', 'campaign_status', 'ads.ad_status', 'ads.ad_image'],
      }
    );
  },
}));
