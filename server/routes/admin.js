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
  ],
};
