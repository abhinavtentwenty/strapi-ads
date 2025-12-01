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
const ActionMenu = ({ data }) => {
  const history = useHistory();
  const [isOpenArchiveCampaignModal, setIsOpenArchiveCampaignModal] = React.useState(false);
  const [isOpenUnpublishCampaignModal, setIsOpenUnpublishCampaignModal] = React.useState(false);
  const [openPopover, setOpenPopover] = React.useState(false);
  const { get, put } = useFetchClient();
  const { updateCampaignStatus } = useUnpublishOrArchiveCampaign();

  const handleDuplicate = async () => {
    try {
      await get(`/${pluginId}/get-campaigns/duplicate/${data.id}`);

      mutate(['campaigns']);
      toast.success('Campaign Successfully Duplicated!', {
        icon: <CheckCircle color="success500" />,
        position: 'top-center',
        style: {
          background: '#eafbe7',
        },
      });
      setOpenPopover(false);
    } catch (error) {
      toast.error('Failed to Duplicate Campaign!', {
        icon: <CheckCircle color="danger500" />,
        position: 'top-center',
        style: {
          background: '#fbeaf7',
        },
      });
    }
  };

  const handleUnpublish = () => {
    updateCampaignStatus({
      campaignId: data.id,
      status: 'inactive',
      onComplete: () => setOpenPopover(false),
    });
  };

  const handleArchive = () => {
    updateCampaignStatus({
      campaignId: data.id,
      status: 'archived',
      onComplete: () => setOpenPopover(false),
    });
  };

  return (
    <>
      <ConfirmArchiveModal
        isOpen={isOpenArchiveCampaignModal}
        setIsOpen={setIsOpenArchiveCampaignModal}
        onSubmit={() => {}}
      />
      <ConfirmUnpublishModal
        isOpen={isOpenUnpublishCampaignModal}
        setIsOpen={setIsOpenUnpublishCampaignModal}
        onSubmit={() => {}}
      />

      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger>
          <IconButton onClick={() => setOpenPopover((v) => !v)}>
            <More />
          </IconButton>
        </PopoverTrigger>
        <PopoverContent>
          <Flex direction="column" style={{ padding: '8px 0px', width: '155px' }}>
            <PopoverItemButton onClick={() => history.push(`campaigns/view/${data.id}`)}>
              <Typography>View Details</Typography>
              <Eye />
            </PopoverItemButton>
            <PopoverItemButton onClick={() => history.push(`campaigns/edit/${data.id}`)}>
              <Typography> Edit Campaign</Typography>
              <Edit />
            </PopoverItemButton>
            <PopoverItemButton onClick={handleDuplicate}>
              <Typography> Duplicate</Typography>
              <Duplicate />
            </PopoverItemButton>
            <PopoverItemButton onClick={handleUnpublish}>
              <Typography>Unpublished</Typography>
              <Pause />
            </PopoverItemButton>
            <PopoverItemButton onClick={handleArchive}>
              <Typography>Archive</Typography>
              <Archive />
            </PopoverItemButton>
          </Flex>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default ActionMenu;
