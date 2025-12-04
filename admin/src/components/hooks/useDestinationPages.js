// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';
import qs from 'qs';
import React from 'react';

const useDestinationPages = ({ destinationModel, page = 1, pageSize = 10, paginated = true }) => {
  const { get } = useFetchClient();

  // console.log('useDestinationPages called with', { destinationModel, page, pageSize, paginated });

  const query = qs.stringify(
    {
      pagination: paginated ? { page, pageSize } : undefined,
    },
    { encodeValuesOnly: true }
  );

  const shouldFetch = !!destinationModel;

  const swrKey = shouldFetch ? ['get-destination-pages', page, pageSize, destinationModel] : null;

  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    shouldFetch
      ? () => get(`/${pluginId}/get-destination-pages/${destinationModel}?${query}`)
      : null
  );

  // console.log('useDestinationPages data', data);
  return {
    destinationPages: data?.data?.results || [],
    totalPages: data?.data?.pagination?.total || 0,
    isLoading: !!(isLoading && shouldFetch),
    isError: !!error,
    error,
    mutate,
  };
};

export default useDestinationPages;
