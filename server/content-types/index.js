'use strict';

const ad = require('./ad');
const adScreen = require('./ad-screen');
const adStat = require('./ad-stat');
const adSpot = require('./ad-spot');
const adType = require('./ad-type');
const campaign = require('./campaign');

module.exports = {
  ad,
  'ad-screen': adScreen,
  'ad-spot': adSpot,
  'ad-type': adType,
  'ad-stat': adStat,
  campaign,
};
