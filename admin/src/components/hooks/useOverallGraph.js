// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';
import qs from 'qs';
import getTimeframeDate from '../../utils/getTimeframeDate';
import { startOfToday } from 'date-fns';

const useOverallGraph = ({ page = 1, pageSize = 10, dateRange } = {}) => {
  const { get } = useFetchClient();
  const filters =
    dateRange && dateRange !== ''
      ? {
          createdAt: {
            $gte: getTimeframeDate(dateRange),
            $lte: startOfToday(),
          },
        }
      : {};

  const query = qs.stringify(
    {
      pagination: { page, pageSize },
      sort: { id: 'ASC' },
      ...(Object.keys(filters).length > 0 && { filters }),
    },
    { encodeValuesOnly: true }
  );

  const { data, error, isLoading, mutate } = useSWR(
    ['overall-graph', page, pageSize, dateRange],
    () => get(`/${pluginId}/overall/graph?${query}`)
  );

  return {
    overallGraph: data?.data?.data || [],
    pagination: data?.data?.meta?.pagination,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};

export default useOverallGraph;
