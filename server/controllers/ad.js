'use strict';

/**
 *  controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const modelName = 'plugin::strapi-ads.ad';
const { format } = require('date-fns');
const _ = require('lodash');
const { generateButtonObject } = require('../../../../../helpers/dynamic-components');
const {errorResponse}=require("../../../../../helpers/error-handler");
const iconsModel = 'api::icon.icon';
const navigationModel = 'api::navigation-handle.navigation-handle';


module.exports = createCoreController(modelName, ({ strapi }) => ({
    async list(ctx) {
        try{
            const {populate={},filters={},pagination={}}=ctx.request.query;
            const today=format(new Date(),'yyyy-MM-dd');

            // Add default ad_status if not provided
            if(!filters.ad_status){
                filters.ad_status={status_id:'live'};
            }
            // Add default campaign.campaign_status if not provided
            if(!filters.campaign){
                filters.campaign={campaign_status:{status_id:'live'}};
            }else if(!filters.campaign.campaign_status){
                filters.campaign.campaign_status={status_id:'live'};
            }

            const ads=await strapi.service(modelName).find({
                filters:{
                    ...filters,ad_start_date:{$lte:today},$or:[{ad_end_date:null},{ad_end_date:{$gte:today}}],
                },populate:{...populate,ad_image:true,ad_type:true,ad_spot:true},pagination,
            });

            const icon=await strapi.service(iconsModel).getByHandle('arrow-forward');
            const navigations = await strapi.service(navigationModel).findMultiple(['event-details','business-directory','promotion','announcement','academy-course','public-register',]);
            const navigationSet={
                'event': _.find(navigations, { handle: 'event-details' }),
                'business-directory': _.find(navigations, { handle: 'business-directory' }),
                'promotion': _.find(navigations, { handle: 'promotion' }),
                'news': _.find(navigations, { handle: 'announcement' }),
                'academy': _.find(navigations, { handle: 'academy-course' }),
                'public-register': _.find(navigations, { handle: 'public-register' }),
                'partners': null,
                'sitemap': null,
            }

            for(const ad of ads.results){
                if(ad.ad_destination_page || ad.ad_external_url){

                    let navigation = navigationSet[ad.ad_destination_models];
                    let screen_id = ad.ad_destination_page ? parseInt(ad.ad_destination_page) : null

                    // Fetch page from sitemap or partners if needed
                    if (['sitemap', 'partners'].includes(ad.ad_destination_models)) {
                        const model = ad.ad_destination_models === 'sitemap' ? 'api::sitemap.sitemap' : 'api::partner.partner';
                        const page = await strapi.entityService.findOne(model, ad.ad_destination_page, { populate: ['navigation_handle'] });
                        navigation = page.navigation_handle;

                        screen_id = null; // Reset screen_id as it is not applicable on these models
                    }
                    ad.cta= await generateButtonObject({
                        title: ad.ad_cta_name,
                        icon: ad.ad_external_url ? icon : null,
                        url: ad.ad_external_url,
                        screen_id: screen_id,
                        navigation: navigation,
                    });
                }
            }


            return ads;
        }catch(e){
            await errorResponse(ctx,e);
        }
    },
}));
