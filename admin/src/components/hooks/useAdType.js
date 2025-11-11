import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';

const useAdType = () => {
  const { get } = useFetchClient();
  const { data, error, isLoading } = useSWR(['ad-types'], () => get(`/${pluginId}/get-ad-types`));

  return {
    adTypes: data?.data || [],
    isLoading,
    isError: error,
  };
};

export default useAdType;
