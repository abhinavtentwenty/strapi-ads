'use strict';

/**
 *  controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const modelName = 'plugin::strapi-ads.ad-stat';

const yup = require('yup');

const bulkIncrementSchema = yup.array().of(
    yup.object({
        ad_id: yup.string().required(),
        impressions: yup.number().required(),
        clicks: yup.number().required(),
    })
);

module.exports = createCoreController(modelName, ({ strapi }) => ({
    async increment(ctx) {
        try{
            const { impressions = 0, clicks = 0 } = ctx.request.body;
            const { id: ad_id } = ctx.request.params;
            return await strapi.service(modelName).increment(ad_id, impressions, clicks);
        } catch (error) {
            return error;
        }
    },
    async bulkIncrement(ctx) {
        try {
            const items = await bulkIncrementSchema.validate(ctx.request.body);
            const results = await Promise.all(
                items.map(({ ad_id, impressions = 0, clicks = 0 }) =>
                    strapi.service(modelName).increment(ad_id, impressions, clicks)
                )
            );
            return { results };
        } catch (error) {
            console.log(error);
            return error;
        }
    },
}));
