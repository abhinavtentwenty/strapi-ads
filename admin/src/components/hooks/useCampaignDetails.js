import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';

const useCampaignDetails = (id) => {
  if (!id) return { campaign: null, isLoading: false, isError: null };

  const { get } = useFetchClient();
  const { data, error, isLoading } = useSWR(['campaign', id], () =>
    get(`/${pluginId}/get-campaigns/${id}`)
  );

  return {
    campaign: data?.data || {},
    isLoading,
    isError: error,
  };
};

export default useCampaignDetails;
