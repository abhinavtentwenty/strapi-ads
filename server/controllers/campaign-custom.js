'use strict';

const _ = require('lodash');

module.exports = ({ strapi }) => ({
  async find(ctx) {

    const { filters = {}, pagination = {}, populate = {}, } = ctx.query;

    const campaigns = await strapi.service('plugin::custom-ui.campaign').find({
      filters: { ...filters, published: true },
      populate,
      pagination,
    });

    const campaignIds = _.map(campaigns.results, 'id');

    const knex = strapi.db.connection;

    const minStartDates = await knex('ads as a')
      .innerJoin('ads_campaign_links as acl', 'acl.ad_id', 'a.id')
      .whereIn('acl.campaign_id', campaignIds)
      .select('acl.campaign_id as camp_id')
      .min('a.ad_start_date as min_date')
      .groupBy('acl.campaign_id')
      .orderBy('acl.campaign_id', 'asc');


    const maxEndDates = await knex('ads as a')
      .innerJoin('ads_campaign_links as acl', 'acl.ad_id', 'a.id')
      .whereIn('acl.campaign_id', campaignIds)
      .select('acl.campaign_id as camp_id')
      .max('a.ad_end_date as max_date')
      .groupBy('acl.campaign_id')
      .orderBy('acl.campaign_id', 'asc');


    const campaignsWithDates = _.map(campaigns.results, campaign => {
      const min = _.find(minStartDates, { camp_id: campaign.id });
      const max = _.find(maxEndDates, { camp_id: campaign.id });
      return {
        ...campaign,
        min_date: min ? min.min_date : null,
        max_date: max ? max.max_date : null,
      };
    });

    return { ...campaigns, results: campaignsWithDates };
  },
  async findOne(ctx) {
    const { id } = ctx.params;
    const campaign = await strapi.entityService.findOne('plugin::custom-ui.campaign', id, {
      populate: ['ads', 'campaign_status', 'ads.ad_status', 'ads.ad_image'],
    });
    ctx.body = campaign;
  },
  async duplicate(ctx) {
    try {
      const duplicatedCampaign = await strapi.plugin('custom-ui').service('campaign').duplicate(ctx);
      ctx.body = duplicatedCampaign;
    } catch (error) {
      ctx.throw(500, 'Error duplicating campaign');
    }
  },
});
