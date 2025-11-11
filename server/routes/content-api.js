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
  ],
};
