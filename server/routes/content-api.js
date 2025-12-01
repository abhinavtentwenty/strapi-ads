module.exports = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/',
      handler: 'myController.index',
      config: {
        policies: [],
      },
    },{
      method: 'GET',
      path: '/ads/list',
      handler: 'ad.list',
    },
    {
      method: 'POST',
      path: '/ad-stat/increment/:id',
      handler: 'ad-stat.increment',
    },
    {
      method: 'POST',
      path: '/ad-stat/increment',
      handler: 'ad-stat.bulkIncrement',
    },
    {
      method: 'GET',
      path: '/download-csv/:id/:title',
      handler: 'ad.downloadAdsReport',
      config: {
        policies: [],
      },
    }
  ],
};
