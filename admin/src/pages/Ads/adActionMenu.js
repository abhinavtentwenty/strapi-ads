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
import Eye from '../../components/Icons/Eye';
import Duplicate from '../../components/Icons/Duplicate';
import Edit from '../../components/Icons/Edit';
import {
  CarretDown,
  ChevronDown,
  CrossCircle,
  More,
  Pencil,
  Play,
  Plus,
  Bell,
  List,
  Calendar,
} from '@strapi/icons';
import ConfirmUnpublishModal from '../Components/confirmUnpublishModal';
import ConfirmArchiveModal from '../Components/confirmArchiveModal';
import { useHistory } from 'react-router-dom';

const AdActionMenu = ({ data }) => {
  const history = useHistory();

  const [isOpenArchiveAdModal, setIsOpenArchiveAdModal] = React.useState(false);
  const [isOpenUnpublishAdModal, setIsOpenUnpublishAdModal] = React.useState(false);
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
      <SimpleMenu as={IconButton} label={<More />}>
        <MenuItem className="px-6 py-3" onClick={() => history.push(`ad-report`)}>
          <Flex justifyContent="space-between" alignItems="center" gap={2} className="w-full">
            <Typography>View Details</Typography>
            <Eye />
          </Flex>
        </MenuItem>
        <MenuItem className="px-6 py-3" onClick={() => history.push(`edit-ad`)}>
          <Flex justifyContent="space-between" alignItems="center" gap={2} className="w-full">
            <Typography> Edit </Typography>
            <Edit />
          </Flex>
        </MenuItem>

        <MenuItem className="px-6 py-3" onClick={() => console.log('edit ad')}>
          <Flex justifyContent="space-between" alignItems="center" gap={2} className="w-full">
            <Typography> Duplicate</Typography>
            <Duplicate />
          </Flex>
        </MenuItem>
        <MenuItem className="px-6 py-3" onClick={() => setIsOpenUnpublishAdModal(true)}>
          <Flex justifyContent="space-between" alignItems="center" gap={2} className="w-full">
            <Typography>Unpublished</Typography>
            <Pause />
          </Flex>
        </MenuItem>
        <MenuItem className="px-6 py-3" onClick={() => setIsOpenArchiveAdModal(true)}>
          <Flex justifyContent="space-between" alignItems="center" gap={2} className="w-full">
            <Typography>Archive</Typography>
            <Archive fill="neutral500" />
          </Flex>
        </MenuItem>
      </SimpleMenu>
    </>
  );
};

export default AdActionMenu;
