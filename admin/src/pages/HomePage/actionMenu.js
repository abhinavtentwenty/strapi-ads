// @ts-nocheck
import React from 'react';

import {
  Button,
  Dots,
  IconButton,
  MenuItem,
  NextLink,
  PageLink,
  Pagination,
  PreviousLink,
  Searchbar,
  SimpleMenu,
  SingleSelect,
  SingleSelectOption,
  MultiSelect,
  MultiSelectOption,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Badge,
  Box,
  Flex,
  Typography,
  Grid,
  GridItem,
  TabGroup,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
} from '@strapi/design-system';
import Pause from '../../components/Icons/Pause';
import Archive from '../../components/Icons/Archive';
import Edit from '../../components/Icons/Edit';
import Duplicate from '../../components/Icons/Duplicate';
import Eye from '../../components/Icons/Eye';
import {
  CarretDown,
  ChevronDown,
  CrossCircle,
  More,
  Play,
  Plus,
  Bell,
  List,
  Calendar,
} from '@strapi/icons';
import ConfirmUnpublishModal from '../Components/confirmUnpublishModal';
import ConfirmArchiveModal from '../Components/confirmArchiveModal';
import { useHistory } from 'react-router-dom';
import PopoverItemButton from '../../components/elements/PopoverItemButton';

import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';

const ActionMenu = ({ data }) => {
  const history = useHistory();
  const [isOpenArchiveCampaignModal, setIsOpenArchiveCampaignModal] = React.useState(false);
  const [isOpenUnpublishCampaignModal, setIsOpenUnpublishCampaignModal] = React.useState(false);

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

      <Popover>
        <PopoverTrigger>
          <IconButton>
            <More />
          </IconButton>
        </PopoverTrigger>
        <PopoverContent>
          <Flex direction="column" style={{ padding: '8px 0px', width: '155px' }}>
            <PopoverItemButton onClick={() => history.push('custom-ui/view-campaign')}>
              <Typography>View Details</Typography>
              <Eye />
            </PopoverItemButton>
            <PopoverItemButton onClick={() => history.push(`custom-ui/edit-campaign`)}>
              <Typography> Edit Campaign</Typography>
              <Edit />
            </PopoverItemButton>
            <PopoverItemButton onClick={() => history.push('custom-ui/view-campaign')}>
              <Typography> Duplicate</Typography>
              <Duplicate />
            </PopoverItemButton>
            <PopoverItemButton onClick={() => setIsOpenUnpublishCampaignModal(true)}>
              <Typography>Unpublished</Typography>
              <Pause />
            </PopoverItemButton>
            <PopoverItemButton onClick={() => setIsOpenArchiveCampaignModal(true)}>
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
