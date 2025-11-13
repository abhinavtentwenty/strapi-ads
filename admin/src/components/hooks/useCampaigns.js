import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';

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

  const params = [
    paginated ? `pagination[page]=${page}` : '',
    paginated ? `pagination[pageSize]=${pageSize}` : '',
    `populate[campaign_status]=true`,
    status ? `filters[status]=${status}` : '',
    type ? `filters[type]=${type}` : '',
    time ? `filters[time]=${time}` : '',
    search ? `filters[search]=${encodeURIComponent(search)}` : '',
  ]
    .filter(Boolean)
    .join('&');

  const { data, error, isLoading, mutate } = useSWR(
    ['campaigns', paginated, page, pageSize, status, type, time, search],
    () => get(`/${pluginId}/get-campaigns?${params}`)
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
