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

  const { data, error, isLoading, mutate } = useSWR(['ad', id], () =>
    get(`/${pluginId}/ad/get/${id}?${query}`)
  );

  return {
    ad: data?.data || {},
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};

export default useAd;
