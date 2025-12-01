// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';
import qs from 'qs';

const useAdModuleStats = () => {
  const { get } = useFetchClient();

  const { data, error, isLoading, mutate } = useSWR(['overall-stats'], () =>
    get(`/${pluginId}/campaign/stat-overall`)
  );

  return {
    stats: data?.data?.data?.stats || [],
  };
};

export default useAdModuleStats;
