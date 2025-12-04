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
import useUnpublishOrArchiveAd from '../../components/hooks/useUnpublisOrArchiveAd';
const AdActionMenu = ({ data }) => {
  const history = useHistory();
  const [isOpenArchiveAdModal, setIsOpenArchiveAdModal] = React.useState(false);
  const [isOpenUnpublishAdModal, setIsOpenUnpublishAdModal] = React.useState(false);
  const [openPopover, setOpenPopover] = React.useState(false);

  const { get } = useFetchClient();
  const { updateAdStatus } = useUnpublishOrArchiveAd();

  const handleDuplicate = async () => {
    try {
      const response = await get(`/${pluginId}/ad/duplicate/${data.id}`);
      history.push(`campaigns/edit/${response?.data?.campaign?.id}`);

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
  const handleUnpublish = () => {
    updateAdStatus({
      adId: data.id,
      status: 'inactive',
      onComplete: () => setIsOpenUnpublishAdModal(false),
    });
  };

  const handleArchive = () => {
    updateAdStatus({
      adId: data.id,
      status: 'archived',
      onComplete: () => setIsOpenArchiveAdModal(false),
    });
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
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger>
          <IconButton onClick={() => setOpenPopover((v) => !v)}>
            <More />
          </IconButton>
        </PopoverTrigger>
        <PopoverContent>
          <Flex direction="column" style={{ padding: '8px 0px', width: '155px' }}>
            <PopoverItemButton onClick={() => history.push(`ads/report/${data.id}`)}>
              <Typography>View Details</Typography>
              <Eye />
            </PopoverItemButton>
            <PopoverItemButton onClick={() => history.push(`campaigns/edit/${data?.campaign?.id}`)}>
              <Typography> Edit </Typography>
              <Edit />
            </PopoverItemButton>
            <PopoverItemButton onClick={handleDuplicate}>
              <Typography> Duplicate</Typography>
              <Duplicate />
            </PopoverItemButton>
            <PopoverItemButton disabled={data?.ad_status === 'inactive'} onClick={handleUnpublish}>
              <Typography>Unpublished</Typography>
              <Pause />
            </PopoverItemButton>
            <PopoverItemButton disabled={data?.ad_status === 'archived'} onClick={handleArchive}>
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
