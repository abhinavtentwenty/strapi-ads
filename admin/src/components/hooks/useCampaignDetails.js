import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';

const useCampaignDetails = (id) => {
  const { get } = useFetchClient();
  const { data, error, isLoading } = useSWR(['campaign', id], () =>
    get(`/${pluginId}/campaign/${id}`)
  );

  return {
    campaign: data?.data || {},
    isLoading,
    isError: error,
  };
};

export default useCampaignDetails;
