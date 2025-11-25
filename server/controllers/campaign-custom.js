'use strict';

const _ = require('lodash');

module.exports = ({ strapi }) => ({
  async find(ctx) {

    const { filters = {}, pagination = {}, populate = {}, } = ctx.request.query;

    const campaigns = await strapi.service('plugin::strapi-ads.campaign').find({
      filters: { ...filters },
      populate,
      pagination,
    });

    return campaigns;
  },
  async findOne(ctx) {
    const { populate = {} } = ctx.request.query;
    const { id } = ctx.params;
    const campaign = await strapi.db.query('plugin::strapi-ads.campaign').findOne({
      where: { id: id },
      populate: { ads:{ populate: { ad_type: true, ad_screens: true, ad_spot: true } }, ...populate },
    });

    ctx.body = campaign;
  },
  async duplicate(ctx) {
    try {
      const duplicatedCampaign = await strapi.plugin('strapi-ads').service('campaign').duplicate(ctx);
      ctx.body = duplicatedCampaign;
    } catch (error) {
      ctx.throw(500, 'Error duplicating campaign');
    }
  },
});
