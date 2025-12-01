// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';
import qs from 'qs';

const useAdGraph = ({ page = 1, pageSize = 7, id }) => {
  const { get } = useFetchClient();
  const query = qs.stringify(
    {
      pagination: { page, pageSize },
      sort: { id: 'DESC' },
      filters: {
        ad_id: { $eq: id },
      },
    },
    { encodeValuesOnly: true }
  );

  const { data, error, isLoading, mutate } = useSWR(['ad-graph', id], () =>
    get(`/${pluginId}/ad/graph?${query}`)
  );

  return {
    adGraph: data?.data?.data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};

export default useAdGraph;
