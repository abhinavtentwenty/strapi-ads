import { useFetchClient, useStrapiApp } from '@strapi/helper-plugin';
import useSWR from 'swr';
import pluginId from '../../pluginId';
// import { useAuth } from '@strapi/permissions';

const useCampaigns = () => {
  const { get } = useFetchClient(); // fetchClient automatically adds Authorization header with Bearer token from storage
  // const {} = useAuth();
  // const { data, error, isLoading } = useSWR(['campaigns'], () =>
  //   get('/content-manager/collection-types/api::campaign.campaign')
  // );
  // console.log('Campaigns data:', data);
  // const { data, error, isLoading } = useSWR(['campaigns'], () => get('/custom-ui/campaign'));
  const { data, error, isLoading } = useSWR(['campaigns'], () => get(`/${pluginId}/get-campaigns`));

  return {
    campaigns: data?.data || [],
    isLoading,
    isError: error,
  };
};

export default useCampaigns;
