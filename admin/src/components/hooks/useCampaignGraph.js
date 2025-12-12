// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';
import qs from 'qs';
import getTimeframeDate from '../../utils/getTimeframeDate';
import { startOfToday } from 'date-fns';

const useCampaignGraph = ({ id, page = 1, pageSize = 10, dateRange }) => {
  const { get } = useFetchClient();

  const filters = {
    campaign_id: id,
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
    ['campaign-graph', id, page, pageSize, dateRange],
    () => get(`/${pluginId}/campaign/graph?${query}`)
  );

  return {
    campaignGraph: data?.data?.data || [],
    pagination: data?.data?.meta?.pagination,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};

export default useCampaignGraph;
