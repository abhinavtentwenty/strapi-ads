'use strict';

const myService = require('./my-service');
const ad = require('./ad');
const adScreen = require('./ad-screen');
const adSpot = require('./ad-spot');
const adStat = require('./ad-stat');
const adStatus = require('./ad-status');
const adType = require('./ad-type');
const campaign = require('./campaign');

module.exports = {
  myService,
  campaign,
  ad,
  'ad-type': adType,
  'ad-screen': adScreen,
  'ad-spot': adSpot,
  'ad-stat': adStat,
  'ad-status': adStatus,
};
