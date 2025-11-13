import { request } from '@strapi/helper-plugin';

const strapiAdsRequests = {
  getArticles: async () => {
    return await request('/strapi-ads/articles', { method: 'GET' });
  },
};

export default strapiAdsRequests;
