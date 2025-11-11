/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AnErrorOccurred, useFetchClient } from '@strapi/helper-plugin';
import pluginId from '../../pluginId';
import HomePage from '../HomePage';
import CreateCampaign from '../Campaign/create-campaign';
import EditCampaign from '../Campaign/edit-campaign';
import ViewCampaign from '../Campaign/view-campaign';
import CampaignReport from '../Campaign/campaign-report';
import CampaignAnalyticsReport from '../Campaign/campaign-analytics-reports';
import AdReport from '../Ads/ad-report';
import AdList from '../Ads/ad-list';
import '../../global.tailwind.css';
import { Box } from '@strapi/design-system';
import { SWRConfig } from 'swr';
import { Toaster } from '../../components/ui/sonner';

const App = () => {
  const { get } = useFetchClient();
  return (
    <SWRConfig
      value={{
        fetcher: (url) => get(url),
      }}
    >
      <Toaster />
      <Box padding="30px">
        <Switch>
          <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
          <Route path={`/plugins/${pluginId}/create-campaign`} component={CreateCampaign} />
          <Route path={`/plugins/${pluginId}/edit-campaign`} component={EditCampaign} />
          <Route path={`/plugins/${pluginId}/view-campaign`} component={ViewCampaign} />
          <Route path={`/plugins/${pluginId}/campaign-report`} component={CampaignReport} />
          <Route
            path={`/plugins/${pluginId}/campaign-analytics`}
            component={CampaignAnalyticsReport}
          />
          <Route path={`/plugins/${pluginId}/ad-report`} component={AdReport} />
          <Route path={`/plugins/${pluginId}/ad-list`} component={AdList} />
          <Route component={AnErrorOccurred} />
        </Switch>
      </Box>
    </SWRConfig>
  );
};

export default App;
