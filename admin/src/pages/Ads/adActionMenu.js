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
const AdActionMenu = ({ data, onStatusChange, filters }) => {
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

      await mutate(
        [
          'ads',
          true,
          filters?.page || 1,
          filters?.pageSize || 10,
          filters?.status || [''],
          filters?.type || '',
          filters?.search || '',
          filters?.campaign || '',
          filters?.sort || { field: 'ad_name', order: 'ASC' },
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
    updateAdStatus({
      adId: data.id,
      status: 'inactive',
      onComplete: async () => {
        setIsOpenUnpublishAdModal(false);
        setOpenPopover(false);

        // Mutate with current filters
        await mutate(
          [
            'ads',
            true,
            filters?.page || 1,
            filters?.pageSize || 10,
            filters?.status || [''],
            filters?.type || '',
            filters?.search || '',
            filters?.campaign || '',
            filters?.sort || { field: 'ad_name', order: 'ASC' },
          ],
          undefined,
          { revalidate: true }
        );
      },
    });
  };

  const handleArchive = async () => {
    updateAdStatus({
      adId: data.id,
      status: 'archived',
      onComplete: async () => {
        setIsOpenArchiveAdModal(false);
        setOpenPopover(false);

        // Mutate with current filters
        await mutate(
          [
            'ads',
            true,
            filters?.page || 1,
            filters?.pageSize || 10,
            filters?.status || [''],
            filters?.type || '',
            filters?.search || '',
            filters?.campaign || '',
            filters?.sort || { field: 'ad_name', order: 'ASC' },
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
        isOpen={isOpenArchiveAdModal}
        setIsOpen={setIsOpenArchiveAdModal}
        onSubmit={handleArchive}
        variant="ads"
      />
      <ConfirmUnpublishModal
        isOpen={isOpenUnpublishAdModal}
        setIsOpen={setIsOpenUnpublishAdModal}
        onSubmit={handleUnpublish}
        variant="ads"
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
            <PopoverItemButton onClick={() => history.push(`campaigns/view/${data?.campaign?.id}?ad=${data.id}`)}>
              <Typography textColor="neutral800">View Details</Typography>
              <Eye />
            </PopoverItemButton>
            <PopoverItemButton onClick={() => history.push(`campaigns/edit/${data?.campaign?.id}?ad=${data.id}`)}>
              <Typography textColor="neutral800"> Edit </Typography>
              <Edit />
            </PopoverItemButton>
            <PopoverItemButton onClick={handleDuplicate}>
              <Typography textColor="neutral800"> Duplicate</Typography>
              <Duplicate />
            </PopoverItemButton>
            <PopoverItemButton
              disabled={data?.ad_status !== 'live'}
              onClick={() => setIsOpenUnpublishAdModal(true)}
            >
              <Typography textColor="neutral800">Unpublished</Typography>
              <Pause />
            </PopoverItemButton>
            <PopoverItemButton
              disabled={data?.ad_status === 'archived'}
              onClick={() => setIsOpenArchiveAdModal(true)}
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

export default AdActionMenu;
