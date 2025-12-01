// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';
import qs from 'qs';

const useOverallGraph = ({ page = 1, pageSize = 7 } = {}) => {
  const { get } = useFetchClient();
  const query = qs.stringify(
    {
      pagination: { page, pageSize },
      sort: { id: 'DESC' },
    },
    { encodeValuesOnly: true }
  );

  const { data, error, isLoading, mutate } = useSWR(['overall-graph'], () =>
    get(`/${pluginId}/overall/graph?${query}`)
  );

  return {
    overallGraph: data?.data?.data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};

export default useOverallGraph;
