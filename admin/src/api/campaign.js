import { request } from '@strapi/helper-plugin';

const customUIRequests = {
  getArticles: async () => {
    return await request('/custom-ui/articles', { method: 'GET' });
  },
};

export default customUIRequests;
