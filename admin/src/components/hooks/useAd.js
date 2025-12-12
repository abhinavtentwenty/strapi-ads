// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';
import qs from 'qs';

const useAd = (id) => {
  const { get } = useFetchClient();
  const query = qs.stringify(
    {
      populate: {
        ad_type: { populate: '*' },
        ad_spot: { populate: '*' },
        ad_image: { populate: '*' },
        campaign: { populate: '*' },
      },
    },
    { encodeValuesOnly: true }
  );

  const { data, error, isLoading, mutate } = useSWR(
    id ? ['ad', id] : null, // Only fetch if id exists
    () => get(`/${pluginId}/ad/get/${id}?${query}`),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
    }
  );

  return {
    ad: data?.data || null,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};

export default useAd;
