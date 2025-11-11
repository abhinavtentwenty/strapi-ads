'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi.plugin('custom-ui').service('myService').getWelcomeMessage();
  },
});
