const adminRoutes = require('./admin');
const contentApiRoutes = require('./content-api');
const ad = require('./ad');
const adScreen = require('./ad-screen');
const adSpot = require('./ad-spot');
const adStat = require('./ad-stat');
const adStatus = require('./ad-status');
const adTypes = require('./ad-type');
const campaign = require('./campaign');

module.exports = {
  adminRoutes,
  export: contentApiRoutes,
  ad,
  'ad-type': adTypes,
  'ad-screen': adScreen,
  'ad-spot': adSpot,
  'ad-stat': adStat,
  'ad-status': adStatus,
  campaign,
};
