import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';

const useAdStatus = () => {
  const { get } = useFetchClient();
  const { data, error, isLoading } = useSWR(['ad-status'], () => get(`/${pluginId}/ad-status`));

  return {
    adStatus: data?.data || [],
    isLoading,
    isError: error,
  };
};

export default useAdStatus;
