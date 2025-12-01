// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';
import qs from 'qs';

const useAds = ({ page = 1, pageSize = 10, status, type, search, campaign, paginated = true }) => {
  const { get } = useFetchClient();

  const cleanStatus = status.filter(Boolean);

  const query = qs.stringify(
    {
      pagination: paginated ? { page, pageSize } : undefined,
      filters: {
        ...(type !== '' && { ad_type: type }),
        ...(campaign !== '' && {
          campaign,
        }),
        ...(cleanStatus.length > 0 && { ad_status: cleanStatus }),
        ...(search && { ad_name: { $containsi: search } }),
      },
      populate: {
        ad_spot: { populate: '*' },
        ad_type: { populate: '*' },
        ad_image: { populate: '*' },
        campaign: { populate: '*' },
      },
    },
    { encodeValuesOnly: true }
  );

  const { data, error, isLoading, mutate } = useSWR(
    ['ads', paginated, page, pageSize, status, type, search, campaign],
    () => get(`/${pluginId}/ad/get?${query}`)
  );

  return {
    ads: data?.data?.results || [],
    pagination: paginated ? data?.data?.pagination : undefined,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};

export default useAds;
