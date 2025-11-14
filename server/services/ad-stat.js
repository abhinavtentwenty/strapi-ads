'use strict';

/**
 *  service
 */

const { createCoreService } = require('@strapi/strapi').factories;
const modelName = 'plugin::strapi-ads.ad-stat';

const { format } = require('date-fns');

module.exports = createCoreService(modelName, ({ strapi }) => ({
    async increment(ad_id, impressions = 0, clicks = 0) {
        const today = format(new Date(), 'yyyy-MM-dd');

        if(ad_id){
            const adExists = await strapi.db.query('plugin::strapi-ads.ad').findOne({ where: { id: ad_id } });
            if (!adExists) return {ad_id, not_found: true};

            const existing = await strapi.db.query(modelName).findOne({
                where:{ ad_id, stat_date: today},
            });

            if(existing){
                return await strapi.db.query(modelName).update({
                    where:{ id: existing.id },
                    data:{
                        stat_date: today,
                        impressions: Number(existing.impressions) + Number(impressions),
                        clicks: Number(existing.clicks) + Number(clicks),
                    },
                });
            }else{
                return await strapi.db.query(modelName).create({
                    data:{
                        ad_id,
                        stat_date: today,
                        impressions: Number(impressions),
                        clicks: Number(clicks),
                    },
                });
            }
        }
    },
}));
