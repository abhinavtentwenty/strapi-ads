import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';
import qs from 'qs';
import getTimeframeDate from '../../utils/getTimeframeDate';

const useCampaigns = ({
  page = 1,
  pageSize = 10,
  status,
  type,
  time,
  search,
  paginated = true,
}) => {
  const { get } = useFetchClient();
  const cleanStatus = status?.filter(Boolean);

  const timeframeDate = getTimeframeDate(time);

  const query = qs.stringify(
    {
      pagination: paginated ? { page, pageSize } : undefined,
      filters: {
        ...(type !== '' && { ads: { ad_type: type } }),
        ...(cleanStatus?.length > 0 && { campaign_status: cleanStatus }),
        ...(search && { campaign_name: { $containsi: search } }),
        ...(timeframeDate && {
          createdAt: { $gte: timeframeDate.toISOString() },
        }),
      },
      populate: {
        campaign_status: true,
        ads: {
          populate: {
            ad_spot: { populate: '*' },
            ad_type: { populate: '*' },
            ad_screens: { populate: '*' },
            ad_image: { populate: '*' },
          },
        },
      },
    },
    { encodeValuesOnly: true }
  );

  const { data, error, isLoading, mutate } = useSWR(
    ['campaigns', paginated, page, pageSize, status, type, time, search],
    () => get(`/${pluginId}/get-campaigns?${query}`)
  );

  return {
    campaigns: data?.data?.results || [],
    pagination: paginated
      ? {
          page: data?.data?.pagination?.page || 1,
          pageCount: data?.data?.pagination?.pageCount || 1,
          pageSize: data?.data?.pagination?.pageSize || pageSize,
          total: data?.data?.pagination?.total || 0,
        }
      : undefined,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};

export default useCampaigns;
