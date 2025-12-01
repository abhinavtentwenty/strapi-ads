// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';
import qs from 'qs';

const useCampaignGraph = ({ id, page = 1, pageSize = 7 }) => {
  const { get } = useFetchClient();

  console.log('Fetching campaign graph for campaign ID:', id);
  const query = qs.stringify(
    {
      pagination: { page, pageSize },
      sort: { id: 'DESC' },
      filters: {
        campaign_id: id,
      },
    },
    { encodeValuesOnly: true }
  );

  const { data, error, isLoading, mutate } = useSWR(['campaign-graph', id], () =>
    get(`/${pluginId}/campaign/graph?${query}`)
  );

  return {
    campaignGraph: data?.data?.data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};

export default useCampaignGraph;
