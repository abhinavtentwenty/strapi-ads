// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';
import qs from 'qs';
import React from 'react';

const useDestinationModels = () => {
  const { get } = useFetchClient();

  const { data, error, isLoading, mutate } = useSWR(['get-destination-model'], () =>
    get(`/${pluginId}/get-destination-model`)
  );

  console.log('useDestinationModels data', data);
  return {
    destinationModels: data?.data || [],
    isLoading: isLoading,
    isError: !!error,
    error,
    mutate,
  };
};

export default useDestinationModels;
