// @ts-nocheck
import React from 'react';
import { TabGroup, Tabs, Tab, TabPanels, TabPanel } from '@strapi/design-system';
// 👆 import from the files where you pasted the v1 code

export default function AttributeTabsV1() {
  return (
    <TabGroup label="Manage your attribute">
      <Tabs>
        <Tab>Base</Tab>
        <Tab>Advanced</Tab>
        <Tab disabled>Expert</Tab>
      </Tabs>

      <TabPanels>
        <TabPanel>
          <p>The default settings for your attribute</p>
        </TabPanel>
        <TabPanel>
          <p>The advanced settings for your attribute</p>
        </TabPanel>
        <TabPanel>
          <p>Expert settings (currently disabled)</p>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
