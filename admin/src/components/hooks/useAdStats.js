// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';
import qs from 'qs';

const useAdStats = (id) => {
  const { get } = useFetchClient();

  const { data, error, isLoading, mutate } = useSWR(['ad-stats', id], () =>
    get(`/${pluginId}/ad/stat/${id}`)
  );

  return {
    stats: data?.data?.data?.stats || [],
  };
};

export default useAdStats;
