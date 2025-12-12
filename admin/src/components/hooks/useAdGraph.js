// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';
import qs from 'qs';
import getTimeframeDate from '../../utils/getTimeframeDate';
import { startOfToday } from 'date-fns';

const useAdGraph = ({ page = 1, pageSize = 7, id, dateRange }) => {
  const { get } = useFetchClient();

  const filters = {
    ad_id: id,
    ...(dateRange && dateRange !== ''
      ? {
          createdAt: {
            $gte: getTimeframeDate(dateRange),
            $lte: startOfToday(),
          },
        }
      : {}),
  };

  const query = qs.stringify(
    {
      pagination: { page, pageSize },
      sort: { id: 'ASC' },
      filters,
    },
    { encodeValuesOnly: true }
  );

  const { data, error, isLoading, mutate } = useSWR(
    ['ad-graph', id, page, pageSize, dateRange],
    () => get(`/${pluginId}/ad/graph?${query}`)
  );

  console.log('useAdGraph data', data);

  return {
    adGraph: data?.data?.data || [],
    pagination: data?.data?.meta?.pagination,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};

export default useAdGraph;
