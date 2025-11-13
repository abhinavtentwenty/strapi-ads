import './output.css';
import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import React from 'react';
import { CampaignIcon, AdManagementIcon, AnalyticsIcon } from './components/Icons/Sidebar';

const name = pluginPkg.strapi.name;

const CustomPluginIcon = () => (
  <span style={{ position: 'relative', display: 'inline-block' }}>
    <CampaignIcon />
    <span
      style={{
        position: 'absolute',
        top: -10,
        right: -13,
        background: '#4945ff',
        color: '#fff',
        borderRadius: '50%',
        fontSize: '10px',
        padding: '2px 5px',
        minWidth: '16px',
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: 1,
      }}
    >
      {5}
    </span>
  </span>
);

const CustomAdManagementIcon = () => (
  <span style={{ position: 'relative', display: 'inline-block' }}>
    <AdManagementIcon />
    <span
      style={{
        position: 'absolute',
        top: -10,
        right: -13,
        background: '#4945ff',
        color: '#fff',
        borderRadius: '50%',
        fontSize: '10px',
        padding: '2px 5px',
        minWidth: '16px',
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: 1,
      }}
    >
      {5}
    </span>
  </span>
);

const CustomAnalyticsIcon = () => (
  <span style={{ position: 'relative', display: 'inline-block' }}>
    <AnalyticsIcon />
    <span
      style={{
        position: 'absolute',
        top: -10,
        right: -13,
        background: '#4945ff',
        color: '#fff',
        borderRadius: '50%',
        fontSize: '10px',
        padding: '2px 5px',
        minWidth: '16px',
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: 1,
      }}
    >
      3
    </span>
  </span>
);

export default {
  async register(app) {
    // const data = await fetch(`/api/sitemaps`);
    // const json = await data.json();
    // console.log(json);
    // Inline custom icon with badge

    app.addMenuLink({
      to: `/plugins/${pluginId}/campaigns`,
      icon: CustomPluginIcon,
      intlLabel: { id: `${pluginId}.plugin.campaigns`, defaultMessage: 'Campaigns' },
      Component: async () => {
        const component = await import('./pages/App/index.js');
        return component;
      },
    });

    app.addMenuLink({
      to: `/plugins/${pluginId}/ads`,
      icon: CustomAdManagementIcon, // <-- Use a unique icon
      intlLabel: { id: `${pluginId}.plugin.adManagement`, defaultMessage: 'Ad Management' },
      Component: async () => {
        const component = await import('./pages/App/index.js');
        return component;
      },
    });

    app.addMenuLink({
      to: `/plugins/${pluginId}/campaign-analytics`,
      icon: CustomAnalyticsIcon, // <-- Use a unique icon
      intlLabel: {
        id: `${pluginId}.plugin.analyticsReports`,
        defaultMessage: 'Analytics & Reports',
      },
      Component: async () => {
        const component = await import('./pages/App/index.js');
        return component;
      },
    });

    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },

  bootstrap(app) {},
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
