'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi.plugin('strapi-ads').service('myService').getWelcomeMessage();
  },
});
