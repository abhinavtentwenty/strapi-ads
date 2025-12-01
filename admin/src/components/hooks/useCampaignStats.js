// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';
import qs from 'qs';

const useCampaignStats = (id) => {
  const { get } = useFetchClient();

  const { data, error, isLoading, mutate } = useSWR(['campaign-stats', id], () =>
    get(`/${pluginId}/campaign/stat/${id}`)
  );

  return {
    stats: data?.data?.data?.stats || [],
  };
};

export default useCampaignStats;
