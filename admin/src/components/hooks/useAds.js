// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';

const useAds = ({ page = 1, pageSize = 10, status, type, search, campaign, paginated = true }) => {
  const { get } = useFetchClient();

  const params = [
    paginated ? `pagination[page]=${page}` : '',
    paginated ? `pagination[pageSize]=${pageSize}` : '',
    // status ? `filters[status]=${status}` : '',
    type ? `filters[ad-type]=${type}` : '',
    campaign ? `filters[campaign]=${campaign}` : '',
    // search ? `filters[search]=${encodeURIComponent(search)}` : '',
    // `publicationState=preview`,
  ]
    .filter(Boolean)
    .join('&');

  const { data, error, isLoading, mutate } = useSWR(
    ['ads', paginated, page, pageSize, status, type, search],
    () => get(`/${pluginId}/ad/get?populate[campaign]=true&${params}`)
  );

  return {
    ads: data?.data?.data || [],
    pagination: paginated ? data?.data?.meta?.pagination : undefined,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};

export default useAds;
