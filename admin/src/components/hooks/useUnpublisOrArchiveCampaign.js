// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import { CheckCircle } from '@strapi/icons';
import pluginId from '../../pluginId';
import { toast } from 'sonner';
import { mutate } from 'swr';

const SUCCESS_MESSAGES = {
  inactive: 'Campaign Successfully Unpublished!',
  archived: 'Campaign Successfully Archived!',
};

const useUnpublishOrArchiveCampaign = () => {
  const { put } = useFetchClient();

  const updateCampaignStatus = async ({
    campaignId,
    status, // 'inactive' | 'archived'
    onComplete,
  }) => {
    try {
      const result = await put(`/${pluginId}/campaign/${campaignId}`, {
        data: { campaign_status: status },
      });

      mutate(['campaigns']);
      mutate(['campaign', campaignId]);

      toast.success(SUCCESS_MESSAGES[status], {
        icon: <CheckCircle color="success500" />,
        position: 'top-center',
        style: { background: '#eafbe7' },
      });
    } catch (error) {
      toast.error('Failed to Update Campaign!', {
        icon: <CheckCircle color="danger500" />,
        position: 'top-center',
        style: { background: '#fbeaf7' },
      });
    } finally {
      onComplete?.();
    }
  };

  return { updateCampaignStatus };
};

export default useUnpublishOrArchiveCampaign;
