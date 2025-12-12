// @ts-nocheck
import React from 'react';
import { useFetchClient } from '@strapi/helper-plugin';

import useSWRMutation from 'swr/mutation';
import { mutate } from 'swr';
import pluginId from '../../pluginId';
import { IconButton, Flex, Typography } from '@strapi/design-system';
import Pause from '../../components/Icons/Pause';
import Archive from '../../components/Icons/Archive';
import Edit from '../../components/Icons/Edit';
import Duplicate from '../../components/Icons/Duplicate';
import Eye from '../../components/Icons/Eye';
import { More } from '@strapi/icons';
import ConfirmUnpublishModal from '../Components/confirmUnpublishModal';
import ConfirmArchiveModal from '../Components/confirmArchiveModal';
import { useHistory } from 'react-router-dom';
import { toast } from 'sonner';
import { CheckCircle } from '@strapi/icons';

import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import PopoverItemButton from '../../components/elements/popoverItemButton';
import useUnpublishOrArchiveCampaign from '../../components/hooks/useUnpublisOrArchiveCampaign';
const ActionMenu = ({ data, filters }) => {
  const history = useHistory();
  const [isOpenArchiveCampaignModal, setIsOpenArchiveCampaignModal] = React.useState(false);
  const [isOpenUnpublishCampaignModal, setIsOpenUnpublishCampaignModal] = React.useState(false);
  const [openPopover, setOpenPopover] = React.useState(false);
  const { get, put } = useFetchClient();
  const { updateCampaignStatus } = useUnpublishOrArchiveCampaign();

  const handleDuplicate = async () => {
    try {
      const response = await get(`/${pluginId}/get-campaigns/duplicate/${data.id}`);
      history.push(`campaigns/edit/${response?.data?.id}`);
      await mutate(
        [
          'campaigns',
          true,
          filters?.page || 1,
          filters?.pageSize || 10,
          filters?.status || [''],
          filters?.type || '',
          filters?.time || '',
          filters?.search || '',
          filters?.sort || { field: 'campaign_name', order: 'ASC' },
        ],
        undefined,
        { revalidate: true }
      );
      toast.success('Campaign Successfully Duplicated!', {
        icon: <CheckCircle color="success500" />,
        position: 'top-center',
      });
      setOpenPopover(false);
    } catch (error) {
      toast.error('Failed to Duplicate Campaign!', {
        icon: <CheckCircle color="danger500" />,
        position: 'top-center',
      });
    }
  };
  const handleUnpublish = async () => {
    updateCampaignStatus({
      campaignId: data.id,
      status: 'inactive',
      onComplete: async () => {
        setIsOpenUnpublishCampaignModal(false);
        setOpenPopover(false);

        // Mutate with current filters
        await mutate(
          [
            'campaigns',
            true,
            filters?.page || 1,
            filters?.pageSize || 10,
            filters?.status || [''],
            filters?.type || '',
            filters?.time || '',
            filters?.search || '',
            filters?.sort || { field: 'campaign_name', order: 'ASC' },
          ],
          undefined,
          { revalidate: true }
        );
      },
    });
  };

  const handleArchive = async () => {
    updateCampaignStatus({
      campaignId: data.id,
      status: 'archived',
      onComplete: async () => {
        setIsOpenArchiveCampaignModal(false);
        setOpenPopover(false);

        // Mutate with current filters
        await mutate(
          [
            'campaigns',
            true,
            filters?.page || 1,
            filters?.pageSize || 10,
            filters?.status || [''],
            filters?.type || '',
            filters?.time || '',
            filters?.search || '',
            filters?.sort || { field: 'campaign_name', order: 'ASC' },
          ],
          undefined,
          { revalidate: true }
        );
      },
    });
  };

  return (
    <>
      <ConfirmArchiveModal
        isOpen={isOpenArchiveCampaignModal}
        setIsOpen={setIsOpenArchiveCampaignModal}
        onSubmit={handleArchive}
      />
      <ConfirmUnpublishModal
        isOpen={isOpenUnpublishCampaignModal}
        setIsOpen={setIsOpenUnpublishCampaignModal}
        onSubmit={handleUnpublish}
      />

      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger>
          <IconButton onClick={() => setOpenPopover((v) => !v)}>
            <More />
          </IconButton>
        </PopoverTrigger>
        <PopoverContent>
          <Flex
            background="neutral0"
            direction="column"
            style={{ padding: '8px 0px', width: '155px' }}
          >
            <PopoverItemButton onClick={() => history.push(`campaigns/view/${data.id}`)}>
              <Typography textColor="neutral800">View Details</Typography>
              <Eye />
            </PopoverItemButton>
            <PopoverItemButton onClick={() => history.push(`campaigns/edit/${data.id}`)}>
              <Typography textColor="neutral800"> Edit Campaign</Typography>
              <Edit />
            </PopoverItemButton>
            <PopoverItemButton onClick={handleDuplicate}>
              <Typography textColor="neutral800"> Duplicate</Typography>
              <Duplicate />
            </PopoverItemButton>
            <PopoverItemButton
              disabled={data?.campaign_status !== 'active'}
              onClick={() => setIsOpenUnpublishCampaignModal(true)}
            >
              <Typography textColor="neutral800">Unpublished</Typography>
              <Pause />
            </PopoverItemButton>
            <PopoverItemButton
              disabled={data?.campaign_status === 'archived'}
              onClick={() => setIsOpenArchiveCampaignModal(true)}
            >
              <Typography textColor="neutral800">Archive</Typography>
              <Archive />
            </PopoverItemButton>
          </Flex>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default ActionMenu;
