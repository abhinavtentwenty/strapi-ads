const _ = require('lodash');

const deepOmit = (obj, keys) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepOmit(item, keys));
  } else if (obj !== null && typeof obj === 'object') {
    return _.omit(
      Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, deepOmit(v, keys)])),
      keys
    );
  }
  return obj;
};

const formatStat = (num) => {
  if (num === null || num === undefined) return "";

  const abs = Math.abs(num);

  if (abs >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (abs >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (abs >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }

  return num.toString();
}


module.exports = { deepOmit, formatStat };
