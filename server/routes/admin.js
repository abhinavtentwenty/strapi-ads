module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/get-campaigns',
      handler: 'campaign-custom.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/ad/admin-find',
      handler: 'ad.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/get-ad-types',
      handler: 'ad-type-custom.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/get-campaigns/:id',
      handler: 'campaign-custom.findOne',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/get-ad-types/:id',
      handler: 'ad-type-custom.findOne',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/get-campaigns/duplicate/:id',
      handler: 'campaign-custom.duplicate',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/ad/duplicate/:id',
      handler: 'ad-type-custom.duplicate',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/ad/get',
      handler: 'ad.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/ad/get/:id',
      handler: 'ad.findOne',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/ad/generate-report',
      handler: 'ad.generateAdsReport',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/campaign/generate-report',
      handler: 'campaign.generateCampaignReport',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/ad',
      handler: 'ad.create',
      config: {
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/ad/:id',
      handler: 'ad.update',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/campaign',
      handler: 'campaign.create',
      config: {
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/campaign/:id',
      handler: 'campaign.update',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/ad/stat/:id',
      handler: 'ad.fetchStat',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/ad/graph',
      handler: 'ad-stat.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/campaign/graph',
      handler: 'campaign-stat.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/overall/graph',
      handler: 'daily-system-stat.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/campaign/stat/:id',
      handler: 'campaign.fetchStat',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/campaign/stat-overall',
      handler: 'campaign.fetchStatOverall',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/get-destination-pages/:ad_destination_model',
      handler: 'ad.getDestinationPage',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/get-destination-model',
      handler: 'ad.getDestinationModel',
      config: {
        policies: [],
      },
    },
  ],
};
