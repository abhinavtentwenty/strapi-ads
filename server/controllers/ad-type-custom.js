'use strict';

module.exports = ({ strapi }) => ({
  async find(ctx) {
    const adType = await strapi.entityService.findMany('plugin::strapi-ads.ad-type', {
      filters: { published: true },
      populate: ['ad_spots.ad_screens'],
      limit: 10,
    });
    ctx.body = adType;
  },
  async findOne(ctx) {
    const { id } = ctx.params;
    const adType = await strapi.entityService.findOne('plugin::strapi-ads.ad-type', id, {
      populate: ['ad_spots.ad_screens'],
    });
    ctx.body = adType;
  },
  async duplicate(ctx) {
    try {
      const duplicatedAd = await strapi.plugin('strapi-ads').service('ad').duplicate(ctx);
      ctx.body = duplicatedAd;
    } catch (error) {
      ctx.throw(500, 'Error duplicating campaign');
    }
  },
});
