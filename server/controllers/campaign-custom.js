'use strict';

const _ = require('lodash');

module.exports = ({ strapi }) => ({
  async find(ctx) {
    const { filters = {}, pagination = {}, populate = {}, sort = {} } = ctx.request.query;

    if (!filters.campaign_status) {
      filters.campaign_status = { $ne: 'archived' };
    }

    const campaigns = await strapi.service('plugin::strapi-ads.campaign').find({
      filters: { ...filters },
      populate,
      pagination,
      sort,
    });

    return campaigns;
  },
  async findOne(ctx) {
    const { populate = {} } = ctx.request.query;
    const { id } = ctx.params;
    const campaign = await strapi.db.query('plugin::strapi-ads.campaign').findOne({
      where: { id: id },
      populate: {
        ads: { populate: { ad_type: true, ad_screens: true, ad_spot: true, ad_image: true } },
        ...populate,
      },
    });

    if (Array.isArray(campaign.ads) && campaign.ads.length > 0){
      const statusOrder=['live','draft','inactive','expired','archived'];
      campaign.ads.sort((a,b)=>{
        const orderA=statusOrder.indexOf(a.ad_status);
        const orderB=statusOrder.indexOf(b.ad_status);

        // If status not found, put it at the end
        const finalOrderA=orderA=== -1?statusOrder.length:orderA;
        const finalOrderB=orderB=== -1?statusOrder.length:orderB;

        return finalOrderA!==finalOrderB?finalOrderA-finalOrderB:a.id-b.id;
      });
    }

    ctx.body = campaign;
  },
  async duplicate(ctx) {
    try {
      const duplicatedCampaign = await strapi
        .plugin('strapi-ads')
        .service('campaign')
        .duplicate(ctx);
      ctx.body = duplicatedCampaign;
    } catch (error) {
      ctx.throw(500, 'Error duplicating campaign');
    }
  },
});
