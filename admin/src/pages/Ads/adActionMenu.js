// @ts-nocheck
import React from 'react';
import { IconButton, Flex, Typography } from '@strapi/design-system';
import Pause from '../../components/Icons/Pause';
import Archive from '../../components/Icons/Archive';
import Eye from '../../components/Icons/Eye';
import Duplicate from '../../components/Icons/Duplicate';
import Edit from '../../components/Icons/Edit';
import { More } from '@strapi/icons';
import ConfirmUnpublishModal from '../Components/confirmUnpublishModal';
import ConfirmArchiveModal from '../Components/confirmArchiveModal';
import { useHistory } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import PopoverItemButton from '../../components/elements/popoverItemButton';
import { useFetchClient } from '@strapi/helper-plugin';
import useSWRMutation from 'swr/mutation';
import { mutate } from 'swr';
import { toast } from 'sonner';
import { CheckCircle } from '@strapi/icons';
import pluginId from '../../pluginId';
const AdActionMenu = ({ data }) => {
  const history = useHistory();

  const [isOpenArchiveAdModal, setIsOpenArchiveAdModal] = React.useState(false);
  const [isOpenUnpublishAdModal, setIsOpenUnpublishAdModal] = React.useState(false);

  // TODO: Handle this Duplicate afterwards

  const { get } = useFetchClient();

  const { trigger: duplicateCampaign, isMutating } = useSWRMutation(
    ['duplicateCampaign', data.id],
    async () => {
      return get(`/${pluginId}/get-ad/duplicate/${data.id}`);
    }
  );

  const handleDuplicate = async () => {
    try {
      await duplicateCampaign();
      mutate(['ads']);
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
  return (
    <>
      <ConfirmArchiveModal
        isOpen={isOpenArchiveAdModal}
        setIsOpen={setIsOpenArchiveAdModal}
        onSubmit={() => {}}
        variant="ads"
      />
      <ConfirmUnpublishModal
        isOpen={isOpenUnpublishAdModal}
        setIsOpen={setIsOpenUnpublishAdModal}
        onSubmit={() => {}}
        variant="ads"
      />
      <Popover>
        <PopoverTrigger>
          <IconButton>
            <More />
          </IconButton>
        </PopoverTrigger>
        <PopoverContent>
          <Flex direction="column" style={{ padding: '8px 0px', width: '155px' }}>
            <PopoverItemButton onClick={() => history.push(`ads/report/${data.id}`)}>
              <Typography>View Details</Typography>
              <Eye />
            </PopoverItemButton>
            <PopoverItemButton onClick={() => history.push(`ads/edit/${data.id}`)}>
              <Typography> Edit </Typography>
              <Edit />
            </PopoverItemButton>
            <PopoverItemButton onClick={handleDuplicate}>
              <Typography> Duplicate</Typography>
              <Duplicate />
            </PopoverItemButton>
            <PopoverItemButton onClick={() => setIsOpenUnpublishAdModal(true)}>
              <Typography>Unpublished</Typography>
              <Pause />
            </PopoverItemButton>
            <PopoverItemButton onClick={() => setIsOpenArchiveAdModal(true)}>
              <Typography>Archive</Typography>
              <Archive />
            </PopoverItemButton>
          </Flex>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default AdActionMenu;
