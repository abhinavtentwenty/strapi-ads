import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';

const useCampaignStatus = () => {
  const { get } = useFetchClient();
  const { data, error, isLoading } = useSWR(['campaign-status'], () =>
    get(`/${pluginId}/campaign-status`)
  );

  return {
    campaignStatus: data?.data || [],
    isLoading,
    isError: error,
  };
};

export default useCampaignStatus;
