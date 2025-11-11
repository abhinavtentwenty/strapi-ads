'use strict';

/**
 *  service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('plugin::custom-ui.ad-spot');
