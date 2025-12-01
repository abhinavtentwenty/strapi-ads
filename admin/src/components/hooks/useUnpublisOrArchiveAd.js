// @ts-nocheck
import { useFetchClient } from '@strapi/helper-plugin';
import { CheckCircle } from '@strapi/icons';
import pluginId from '../../pluginId';
import { toast } from 'sonner';
import { mutate } from 'swr';

const SUCCESS_MESSAGES = {
  inactive: 'Ad Successfully Unpublished!',
  archived: 'Ad Successfully Archived!',
};

const useUnpublishOrArchiveAd = () => {
  const { put } = useFetchClient();

  const updateAdStatus = async ({
    adId,
    status, // 'inactive' | 'archived'
    onComplete,
  }) => {
    try {
      const result = await put(`/${pluginId}/ad/${adId}`, {
        data: { ad_status: status },
      });

      mutate(['ads']);
      mutate(['ad', adId]);

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

  return { updateAdStatus };
};

export default useUnpublishOrArchiveAd;
