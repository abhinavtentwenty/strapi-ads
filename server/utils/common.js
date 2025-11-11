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

module.exports = { deepOmit };
