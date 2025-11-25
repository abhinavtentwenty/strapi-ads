'use strict';

const myController = require('./my-controller');
const campaignCustom = require('./campaign-custom');
const adTypesCustom = require('./ad-type-custom');
const ad = require('./ad');
const adScreen = require('./ad-screen');
const adSpot = require('./ad-spot');
const adStat = require('./ad-stat');
const campaignStat = require('./campaign-stat');
const dailySystemStat = require('./daily-system-stat');
const adType = require('./ad-type');
const campaign = require('./campaign');

module.exports = {
  myController,
  campaign,
  'campaign-custom': campaignCustom,
  ad,
  'ad-type': adType,
  'ad-type-custom': adTypesCustom,
  'ad-screen': adScreen,
  'ad-spot': adSpot,
  'ad-stat': adStat,
  'campaign-stat': campaignStat,
  'daily-system-stat': dailySystemStat,
};
