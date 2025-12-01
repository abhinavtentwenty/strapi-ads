'use strict';
const qs = require('qs');
const _ = require('lodash');

module.exports = (config, { strapi }) => {
    return async (ctx, next) =>{
        await next();
        const configurations=strapi.plugin('strapi-ads').config('apiRules');
        const path=ctx.request.path.replace(/^\//,'');
        const query=ctx.request.query;
        const filters=query.filters||[];
        const pathConfigs=configurations.filter(config=>config.apis.some(api=>api.split('?')[0]===path));

        const matchedConfigs = [];
        for (const config of pathConfigs) {
            for (const api of config.apis) {
                const [apiBase, apiQuery] = api.split('?');
                if (apiBase !== path) continue;

                let allMatch=true;
                if(apiQuery){
                    const params=qs.parse(apiQuery);
                    for(const [key,value] of Object.entries(params)){
                        // Only check filters for parameters present in api
                        let queryValue=filters[key];
                        if(queryValue&& typeof queryValue==='object'){
                            if(Array.isArray(queryValue.$in)&&Array.isArray(value)){
                                if(!_.isEqual(_.sortBy(queryValue.$in),_.sortBy(value))){
                                    allMatch=false;
                                    break;
                                }
                                continue;
                            }
                            if(queryValue.$eq!==undefined){
                                queryValue=queryValue.$eq;
                            }
                            else if(_.isEqual(queryValue, value)){
                                continue;
                            }
                        }
                        if(Array.isArray(queryValue)&&Array.isArray(value)){
                            if(!_.isEqual(_.sortBy(queryValue),_.sortBy(value))){
                                allMatch=false;
                                break;
                            }
                            continue;
                        }
                        if(queryValue==null&&value!=='null'){
                            allMatch=false;
                            break;
                        }
                        if(queryValue!=null&&String(queryValue)!==value){
                            allMatch=false;
                            break;
                        }
                        if(queryValue==null&&value==='null'){
                            continue;
                        }
                    }
                }
                if(allMatch){
                    matchedConfigs.push({
                        ad_type:{ad_type_id:config.ad_type},
                        ad_spot:{ad_spot_id:config.ad_spot},
                        ad_screen:{ad_screen_id:config.ad_screen}
                    });
                }
            }
        }

        if(matchedConfigs.length){
            ctx.body.meta={
                ...ctx.body.meta,ad_configs:matchedConfigs
            };
        }

    }
}