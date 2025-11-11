import './output.css';
import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import React from 'react';
import { Earth, Puzzle } from '@strapi/icons';
import { CampaignIcon } from './components/Icons/Sidebar';

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
const AnalyticsIcon = () => (
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
      {/* {json?.data?.length} */}
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
      to: `/plugins/${pluginId}`,
      icon: CustomPluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        // defaultMessage: name,
        defaultMessage: 'Campaigns',
      },
      Component: async () => {
        const component = await import('./pages/App/index.js');
        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });
    // app.addMenuLink({
    //   to: `/plugins/${pluginId}/campaign-analytics`,
    //   icon: CustomPluginIcon,
    //   intlLabel: {
    //     id: `${pluginId}.plugin.name`,
    //     defaultMessage: 'Doslyy',
    //   },
    //   Component: async () => {
    //     const component = await import('./pages/Analytics/campaign-analytics.js');
    //     return component;
    //   },
    //   permissions: [
    //     // Uncomment to set the permissions of the plugin here
    //     // {
    //     //   action: '', // the action name should be plugin::plugin-name.actionType
    //     //   subject: null,
    //     // },
    //   ],
    // });
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
