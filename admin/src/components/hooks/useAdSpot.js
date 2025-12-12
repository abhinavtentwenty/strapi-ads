import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';

const useAdSpot = () => {
  const { get } = useFetchClient();
  const { data, error, isLoading } = useSWR(['ad-spots'], () => get(`/${pluginId}/get-ad-spots`));

  return { adSpots: data?.data || [], isLoading, isError: error };
};

export default useAdSpot;
