'use strict';

/**
 *  controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const modelName = 'plugin::strapi-ads.ad';
const { format } = require('date-fns');
const _ = require('lodash');


module.exports = createCoreController(modelName, ({ strapi }) => ({
    async list(ctx) {
        try{
            const {populate={},filters={},pagination={}}=ctx.request.query;
            const today=format(new Date(),'yyyy-MM-dd');

            // Add default ad_status if not provided
            if(!filters.ad_status){
                filters.ad_status='live';
            }
            // Add default campaign.campaign_status if not provided
            if(!filters.campaign){
                filters.campaign={campaign_status:'active'};
            }else if(!filters.campaign.campaign_status){
                filters.campaign.campaign_status='active';
            }

            const ads=await strapi.service(modelName).find({
                filters:{
                    ...filters, ad_start_date:{$lte:today}, $or:[{ad_end_date:null},{ad_end_date:{$gte:today}}],
                },
                populate:{ ...populate, ad_image:true, ad_type:true, ad_spot:true },
                pagination,
            });

            return ads;
        }catch(e){
            return e;
        }
    },
}));
