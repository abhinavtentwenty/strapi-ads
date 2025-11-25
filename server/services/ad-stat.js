'use strict';

/**
 *  service
 */

const { createCoreService } = require('@strapi/strapi').factories;
const modelName = 'plugin::strapi-ads.ad-stat';

const { format,subDays } = require('date-fns');

module.exports = createCoreService(modelName, ({ strapi }) => ({
    async increment(ad_id, impressions = 0, clicks = 0) {
        const today = format(new Date(), 'yyyy-MM-dd');

        if(ad_id){
            const adExists = await strapi.db.query('plugin::strapi-ads.ad').findOne({ where: { id: ad_id } });
            if (!adExists) return {ad_id, not_found: true};

            const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
            const previousDayStats = await strapi.db.query(modelName).findOne({
                where: { ad_id, stat_date: yesterday },
                fields: ['total_impressions', 'total_clicks']
            });

            const previousTotalImpressions = Number(previousDayStats?.total_impressions || 0);
            const previousTotalClicks = Number(previousDayStats?.total_clicks || 0);


            const existing = await strapi.db.query(modelName).findOne({
                where:{ ad_id, stat_date: today},
            });

            let result, newDailyImpressions, newDailyClicks, totalImpressions, totalClicks;

            if(existing){
                newDailyImpressions = Number(existing.impressions) + Number(impressions);
                newDailyClicks = Number(existing.clicks) + Number(clicks);
                totalImpressions = previousTotalImpressions + newDailyImpressions;
                totalClicks = previousTotalClicks + newDailyClicks;

                result = await strapi.db.query(modelName).update({
                    where:{ id: existing.id },
                    data:{
                        stat_date: today,
                        impressions: newDailyImpressions,
                        clicks: newDailyClicks,
                        total_impressions: totalImpressions,
                        total_clicks: totalClicks,
                    },
                });
            }else{

                newDailyImpressions = Number(impressions);
                newDailyClicks = Number(clicks);
                totalImpressions = previousTotalImpressions + newDailyImpressions;
                totalClicks = previousTotalClicks + newDailyClicks;

                result = await strapi.db.query(modelName).create({
                    data:{
                        ad_id,
                        stat_date: today,
                        impressions: newDailyImpressions,
                        clicks: newDailyClicks,
                        total_impressions: totalImpressions,
                        total_clicks: totalClicks,
                    },
                });
            }

            await strapi.db.query('plugin::strapi-ads.ad').update({
                where: { id: ad_id },
                data: {
                    total_impressions: totalImpressions,
                    total_clicks: totalClicks
                }
            });


            return result;
        }
    },
}));
