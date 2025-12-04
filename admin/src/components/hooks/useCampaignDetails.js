import { useFetchClient } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';
import qs from 'qs';

const useCampaignDetails = (id) => {
  if (!id) return { campaign: null, isLoading: false, isError: null };

  const { get } = useFetchClient();

  // const query = qs.stringify(
  //   {
  //     populate: {
  //       campaign_status: true,
  //       ads: {
  //         populate: {
  //           ad_spot: { populate: '*' },
  //           ad_type: { populate: '*' },
  //           ad_screens: { populate: '*' },
  //           ad_image: { populate: '*' },
  //         },
  //       },
  //     },
  //   },
  //   { encodeValuesOnly: true }
  // );

  const { data, error, isLoading, mutate } = useSWR(['campaign', id], () =>
    get(`/${pluginId}/get-campaigns/${id}`)
  );

  return {
    campaign: data?.data || {},
    isLoading,
    isError: error,
    mutate,
  };
};

export default useCampaignDetails;
