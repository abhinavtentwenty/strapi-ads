import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';

const useCampaignDetails = (id) => {
  const { get } = useFetchClient();

  const { data, error, isLoading, mutate } = useSWR(
    id ? ['campaign', id] : null, // Only fetch if id exists
    () => get(`/${pluginId}/get-campaigns/${id}`),
    {
      revalidateOnFocus: false, // Don't refetch on window focus
      revalidateOnReconnect: false, // Don't refetch on reconnect
      dedupingInterval: 2000, // Prevent duplicate requests within 2 seconds
    }
  );

  return {
    campaign: data?.data || null,
    isLoading,
    isError: error,
    mutate,
  };
};

export default useCampaignDetails;
