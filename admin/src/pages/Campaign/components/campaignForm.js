// @ts-nocheck
import {
  Accordion,
  AccordionContent,
  AccordionToggle,
  Box,
  Button,
  Checkbox,
  Flex,
  Loader,
  Popover,
  Radio,
  SingleSelect,
  SingleSelectOption,
  Tab,
  TabGroup,
  TabPanel,
  TabPanels,
  Tabs,
  Typography,
} from '@strapi/design-system';
import {
  getAdValidationRules,
  getTitleMaxLength,
  getDescMaxLength,
  isVideoAllowed,
} from '../../../config/adValidationRules';
import { auth } from '@strapi/helper-plugin';
import { CheckCircle, Cross, More, Plus, Rocket } from '@strapi/icons';
import axios from 'axios';
import { format, isValid } from 'date-fns';
import React, { useCallback, useRef } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { toast } from 'sonner';
import styled from 'styled-components';
import Analytics from '../../../components/Icons/Analytics';
import Archive from '../../../components/Icons/Archive';
import Download from '../../../components/Icons/Download';
import Edit from '../../../components/Icons/Edit';
import Pause from '../../../components/Icons/Pause';

import CustomButton from '../../../components/elements/customButton';
import FileUpload from '../../../components/elements/form/fileinput';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../../../components/ui/breadcrumb';
import { truncate } from '../../../utils/utils';
import CreateCampaignModal from './createCampaignModal';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFetchClient } from '@strapi/helper-plugin';
import { toPng } from 'dom-to-image-more';
import qs from 'qs';
import { useLocation } from 'react-router-dom';
import homeCarousel from '../../../assets/homeCarousel.png';
import listingBanner from '../../../assets/listingBanner.png';
import iphoneFrame from '../../../assets/phoneFrame.png';
import previewImage from '../../../assets/previewImage.jpg';
import stickyAd from '../../../assets/stickyAd.png';
import widgetBanner from '../../../assets/widgetBanner.png';
import BackButton from '../../../components/elements/backButton';
import CustomIconButton from '../../../components/elements/customIconButton';
import FormDatePicker from '../../../components/elements/form/datepicker';
import FormInput from '../../../components/elements/form/input';
import FormTextArea from '../../../components/elements/form/textarea';
import StatusBadge from '../../../components/elements/statusBadge';
import useAdType from '../../../components/hooks/useAdType';
import useCampaignDetails from '../../../components/hooks/useCampaignDetails';

import useDestinationModels from '../../../components/hooks/useDestinationModels';
import useUnpublishOrArchiveAd from '../../../components/hooks/useUnpublisOrArchiveAd';
import useUnpublishOrArchiveCampaign from '../../../components/hooks/useUnpublisOrArchiveCampaign';
import Arrow from '../../../components/Icons/Arrow';
import Save from '../../../components/Icons/Save';
import pluginId from '../../../pluginId';
import { buildCampaignSchema } from '../../../schemas/campaign';
import ConfirmArchiveModal from '../../Components/confirmArchiveModal';
import ConfirmUnpublishModal from '../../Components/confirmUnpublishModal';
import AdDurationOverlapModal from './adDurationOverlapModal';
import EditCampaignModal from './editCampaignModal';

// Default values for a new ad
export const defaultAdValues = {
  ad_name: '',
  ad_start_date: null,
  ad_end_date: null,
  ad_type: null,
  ad_spot: null,
  ad_status: 'draft',
  ad_screens: [],
  ad_headline: '',
  ad_cta_name: '',
  ad_external_url: '',
  ad_destination_models: undefined,
  ad_description: '',
  ad_image: null,
  is_external: 'yes',
  ad_video_url: undefined,
  selected: false,
};

const PopoverItem = styled(Flex)`
  padding: 8px 16px;
  gap: 6px;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s ease;
  &:hover {
    background: ${({ theme }) => theme.colors.neutral100};
  }
  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }
`;

const TabButton = styled(Tab)`
  padding: 0; /* remove Tab's default padding */
  border: none;
  background: ${({ theme }) => theme.colors.neutral150};

  > div {
    padding: 0 !important;
    background: transparent !important;
  }

  &[aria-selected='true'] {
    /* styles for active tab */
    button {
      background: ${({ theme }) => theme.colors.primary600} !important; /* active bg */
      color: ${({ theme }) => theme.colors.neutral0} !important; /* white text */
    }

    /* ensure ALL text + icon parts become white */
    svg,
    svg path,
    span,
    p,
    div {
      color: ${({ theme }) => theme.colors.neutral0} !important;
      fill: ${({ theme }) => theme.colors.neutral0} !important;
    }
  }

  &[aria-disabled='true'] {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const toUTCDate = (value) => {
  if (!value) return null;

  if (value instanceof Date) return value;

  const [y, m, d] = value.split('-').map(Number);

  return new Date(Date.UTC(y, m - 1, d));
};

const CampaignForm = ({
  mode, // 'create' | 'edit' | 'view'
  campaignId = null,
  onSubmit = () => {},
}) => {
  const { adTypes } = useAdType();
  const { destinationModels } = useDestinationModels();

  console.log('Destination Models in CampaignForm:', destinationModels);

  const imgRef = useRef();
  const CampaignSchema = React.useMemo(() => buildCampaignSchema(adTypes), [adTypes]);
  const resolver = zodResolver(CampaignSchema);
  const { campaign, mutate } = useCampaignDetails(Number(campaignId));

  const addDefaultValues = (mode === 'edit' || mode === 'view') && campaign;
  const methods = useForm({
    resolver: zodResolver(CampaignSchema),
    mode: 'onChange',
    defaultValues: {
      campaign_name: '',
      campaign_entity_type: 'adgm_entity',
      campaign_entity_name: '',
      campaign_entity_license_number: '',
      ads: [],
    },
    shouldUnregister: false,
  });

  const { get, post, put } = useFetchClient();
  const { updateCampaignStatus } = useUnpublishOrArchiveCampaign();
  const { updateAdStatus } = useUnpublishOrArchiveAd();
  const token = auth.getToken();
  const history = useHistory();
  const location = useLocation();
  const [isSubmittingCampaignForm, setIsSubmittingCampaignForm] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const [isOpenCreateCampaignModal, setIsOpenCreateCampaignModal] = React.useState(false);
  const [isOpenEditCampaignModal, setIsOpenEditCampaignModal] = React.useState(false);
  const morePopoverRef = React.useRef(null);
  const [openMorePopover, setOpenMorePopover] = React.useState(false);
  const [openAdDurationOverlapModal, setOpenAdDurationOverlapModal] = React.useState(false);
  const [AdDurationOverlapData, setAdDurationOverlapData] = React.useState(null);

  const [isOpenArchiveCampaignModal, setIsOpenArchiveCampaignModal] = React.useState(false);
  const [isOpenUnpublishCampaignModal, setIsOpenUnpublishCampaignModal] = React.useState(false);

  const [activeDestinationPageOptionsDefault, setActiveDestinationPageOptionsDefault] =
    React.useState([]);
  const [activeAdIdx, setActiveAdIdx] = React.useState(null);

  const downloadImage = useCallback(() => {
    console.log('here');

    if (imgRef.current === null) {
      return;
    }

    toPng(imgRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${methods.getValues(`ads.${activeAdIdx}.ad_name`)}_Format.jpg`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [imgRef, activeAdIdx]);

  React.useEffect(() => {
    if ((mode === 'edit' || mode === 'view') && campaign && Object.keys(campaign).length > 0) {
      methods.reset({
        id: campaign?.id || null,
        campaign_name: campaign?.campaign_name || '',
        campaign_entity_type: campaign?.campaign_entity_type || '',
        campaign_entity_name: campaign?.campaign_entity_name || '',
        campaign_entity_license_number: campaign?.campaign_entity_license_number || '',
        ads:
          campaign?.ads?.map((ad) => ({
            id: ad?.id,
            ad_name: ad?.ad_name,
            ad_start_date: toUTCDate(ad.ad_start_date),
            ad_end_date: toUTCDate(ad.ad_end_date),
            ad_type: ad?.ad_type?.id,
            ad_cta_name: ad?.ad_cta_name || '',
            ad_spot: ad?.ad_spot?.id,
            ad_destination_models: ad?.ad_destination_models ?? undefined,
            ad_destination_page: ad?.ad_destination_page,
            ad_external_url: ad?.ad_external_url,
            ad_status: ad?.ad_status,
            ad_screens: ad?.ad_screens.map((screen) => screen.id) || [],
            ad_headline: ad?.ad_headline,
            ad_description: ad?.ad_description,
            is_external: ad?.ad_external_url ? 'yes' : 'no',
            ad_image: null,
            ad_image_url: ad.ad_image ? ad.ad_image.url : '',
            ad_video_url: ad?.ad_video_url,
            selected: ad?.ad_status === 'live' ? true : false,
          })) || [],
      });
    }
  }, [campaign, mode]);

  React.useEffect(() => {
    if (!campaign?.ads?.length) return;

    const adIdFromUrl = new URLSearchParams(location.search).get('ad');
    if (!adIdFromUrl) return;

    const index = campaign.ads.findIndex((ad) => ad.id === Number(adIdFromUrl));
    if (index !== -1) setActiveAdIdx(index);
  }, [campaign, location.search]);

  React.useEffect(() => {
    if (activeAdIdx == null) return;

    const attemptScroll = (tries = 0) => {
      const max = 10;
      const el = document.getElementById(`ad-accordion-${activeAdIdx}`);

      if (el) {
        setTimeout(() => {
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - 150;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }, 50);
      } else if (tries < max) {
        setTimeout(() => attemptScroll(tries + 1), 100);
      }
    };

    attemptScroll();
  }, [activeAdIdx]);

  const errors = methods.formState.errors;
  const campaign_name = useWatch({
    control: methods.control,
    name: 'campaign_name',
    defaultValue: '',
  });
  const formAds = useWatch({ control: methods.control, name: 'ads', defaultValue: [] });

  const [activeAdType, setActiveAdType] = React.useState(null);
  const adTypeWatch = useWatch({ control: methods.control, name: `ads.${activeAdIdx}.ad_type` });

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.getElementById('strapi');
    if (!root) return;
    const className = 'has-campaign-form';
    root.classList.add(className);
    return () => root.classList.remove(className);
  }, []);

  React.useEffect(() => {
    if (!activeAdIdx && activeAdIdx !== 0) return;

    const model = methods.getValues(`ads.${activeAdIdx}.ad_destination_models`);
    const page = methods.getValues(`ads.${activeAdIdx}.ad_destination_page`);

    if (
      (mode === 'edit' || mode === 'view') &&
      activeAdIdx !== undefined &&
      model !== undefined &&
      model !== null &&
      page !== undefined &&
      page !== null
    ) {
      const fetchDestinationPages = async () => {
        const query = qs.stringify(
          {
            pagination: { page: 1, pageSize: 10 },
          },
          { encodeValuesOnly: true }
        );

        const { data } = await get(
          `/${pluginId}/get-destination-pages/${model}?filters[id]=${page}`
        );

        const response = await get(`/${pluginId}/get-destination-pages/${model}?${query}`);

        setActiveDestinationPageOptionsDefault(
          [...response?.data?.results, ...data?.results] || []
        );
      };

      fetchDestinationPages();
    }
  }, [activeAdIdx]);

  const watchCurrentDestinationModel = useWatch({
    control: methods.control,
    name: activeAdIdx !== null ? `ads.${activeAdIdx}.ad_destination_models` : '',
    defaultValue: undefined,
  });
  const [activeDestinationPage, setActiveDestinationPage] = React.useState(1);
  const [activeDestinationPageOptions, setActiveDestinationPageOptions] = React.useState([]);
  const [totalDestinationPageOptions, setTotalDestinationPageOptions] = React.useState(1);

  React.useEffect(() => {
    if (!watchCurrentDestinationModel && activeAdIdx !== null) return;

    const fetchDestinationPages = async () => {
      try {
        const query = qs.stringify(
          {
            pagination: { page: activeDestinationPage, pageSize: 10 },
          },
          { encodeValuesOnly: true }
        );

        const response = await get(
          `/${pluginId}/get-destination-pages/${methods.getValues(`ads.${activeAdIdx}.ad_destination_models`)}?${query}`
        );

        console.log('Fetched destination pages:', response?.data?.results);

        setActiveDestinationPageOptions((prev) => [...prev, ...(response?.data?.results || [])]);
        setTotalDestinationPageOptions(response?.data?.pagination?.total || 0);
      } catch (err) {
        console.error('Failed to fetch destination pages:', err);
      }
    };

    fetchDestinationPages();
  }, [watchCurrentDestinationModel, activeDestinationPage]);

  React.useEffect(() => {
    const adType = getCurrentAdType();
    setActiveAdType(adType);
  }, [adTypeWatch, activeAdIdx]);

  const getCurrentAdType = () => {
    return (
      adTypes.find((type) => type.id === methods.getValues(`ads.${activeAdIdx}.ad_type`)) || null
    );
  };

  // Checkbox change handler for ad selection
  const handleAdCheckboxChange = async (checked, idx) => {
    if (checked) {
      const isValid = await methods.trigger(`ads.${idx}`);

      if (!isValid) {
        toast.error('Please complete all required fields for this ad', {
          position: 'top-center',
        });
        return;
      }
    }

    const isChecked = typeof checked === 'boolean' ? checked : checked === 'true';
    methods.setValue(`ads.${idx}.selected`, isChecked);
  };

  const handleSelectAllChange = async (checked) => {
    const ads = methods.getValues('ads') || [];

    if (checked) {
      const validationResults = await Promise.all(
        ads.map((_, idx) => methods.trigger(`ads.${idx}`))
      );

      ads.forEach((_, idx) => {
        if (validationResults[idx]) {
          methods.setValue(`ads.${idx}.selected`, true);
        }
      });

      const invalidCount = validationResults.filter((valid) => !valid).length;
      if (invalidCount > 0) {
        toast.warning(`${invalidCount} ad(s) skipped due to incomplete information`, {
          position: 'top-center',
        });
      }
    } else {
      ads.forEach((_, idx) => {
        methods.setValue(`ads.${idx}.selected`, false);
      });
    }
  };

  const getSelectedAds = (ads) => ads.filter((ad) => ad.selected);

  const getSelectedAdsToPublish = (ads) =>
    ads.filter((ad) => ad.selected && (ad.ad_status === 'inactive' || ad.ad_status === 'draft'));

  const getSelectedAdsToUnpublish = (ads) =>
    ads.filter((ad) => ad.selected && ad.ad_status === 'live');

  const StopToggle = ({ children }) => (
    <Box
      role="presentation"
      // capture phase so we intercept before Accordion's handler
      onPointerDownCapture={(e) => e.stopPropagation()}
      onMouseDownCapture={(e) => e.stopPropagation()}
      onClickCapture={(e) => e.stopPropagation()}
      onKeyDownCapture={(e) => {
        if (e.key === ' ' || e.key === 'Enter') e.stopPropagation();
      }}
    >
      {children}
    </Box>
  );

  const getCurrentAdTitle = () => {
    return methods.getValues(`ads.${activeAdIdx}.ad_headline`) || 'Title';
  };

  const getCurrentAdDescription = () => {
    return methods.getValues(`ads.${activeAdIdx}.ad_description`) || 'Description goes here...';
  };

  const getCurrentValidationRules = (idx) => {
    const adTypeId = methods.watch(`ads.${idx}.ad_type`);
    const adSpotId = methods.watch(`ads.${idx}.ad_spot`);
    const adScreenIds = methods.watch(`ads.${idx}.ad_screens`) || [];

    const adType = adTypes.find((type) => type.id === adTypeId);
    const adSpot = adType?.ad_spots?.find((spot) => spot.id === adSpotId);
    const allScreens = adSpot?.ad_screens || [];

    if (!adType || !adSpot) {
      return { titleMax: 60, descMax: 150, videoAllowed: false };
    }

    return getAdValidationRules(
      adType.ad_type_id,
      adType.image_size,
      adSpot.ad_spot_id,
      adScreenIds,
      allScreens
    );
  };

  const adTypeCardImages = {
    'home-carousel': homeCarousel,
    'widget-banner': widgetBanner,
    'sticky-ad': stickyAd,
    'listing-banner': listingBanner,
  };

  const handleUnpublish = async () => {
    updateCampaignStatus({
      campaignId: campaign?.id,
      status: 'inactive',
      onComplete: async () => {
        setIsOpenUnpublishCampaignModal(false);
        // Force refetch with revalidation
        await mutate(['campaign', Number(campaignId)], undefined, {
          revalidate: true,
        });
      },
    });
  };

  const handleArchive = async () => {
    updateCampaignStatus({
      campaignId: campaign.id,
      status: 'archived',
      onComplete: async () => {
        setIsOpenArchiveCampaignModal(false);
        // Force refetch with revalidation
        await mutate(['campaign', Number(campaignId)], undefined, {
          revalidate: true,
        });
      },
    });
  };

  const handleUnpublishAd = async (adId) => {
    updateAdStatus({
      adId: adId,
      status: 'inactive',
      onComplete: async () => {
        // Force refetch with revalidation
        await mutate(['campaign', Number(campaignId)], undefined, {
          revalidate: true,
        });
      },
    });
  };

  const handleRemoveAd = (idx) => {
    const currentAds = methods.getValues('ads') || [];
    const updatedAds = currentAds.filter((_, index) => index !== idx);
    methods.setValue('ads', updatedAds);
    // Reset active ad index if needed
    if (activeAdIdx === idx) {
      setActiveAdIdx(null);
    } else if (activeAdIdx > idx) {
      setActiveAdIdx(activeAdIdx - 1);
    }
  };

  const formatDate = (dateObj) => {
    if (!dateObj || !isValid(dateObj)) return null;
    return format(new Date(dateObj), 'yyyy-MM-dd');
  };

  const validateForm = async () => {
    const data = methods.getValues();
    const result = await resolver(data, {}, {});
    let valid = true;

    console.log('Validation result:', result);

    // Set errors if any
    if (result.errors && Object.keys(result.errors).length > 0) {
      valid = false;
      Object.entries(result.errors).forEach(([key, value]) => {
        if (key === 'ads') return;
        if (value?.message) {
          methods.setError(key, {
            type: 'manual',
            message: value.message,
          });
        }
      });

      if (Array.isArray(result.errors.ads)) {
        result.errors.ads.forEach((adErrorObj, index) => {
          Object.entries(adErrorObj).forEach(([field, errorInfo]) => {
            const fieldPath = `ads.${index}.${field}`;
            methods.setError(fieldPath, {
              type: 'manual',
              message: errorInfo.message,
            });
          });
        });
      }
    }

    return valid;
  };

  const handleCampaignSubmit = async (type) => {
    // type: 'publish' | 'save'
    try {
      methods.clearErrors();
      const isValid = await validateForm();
      if (!isValid) return;

      setIsSubmittingCampaignForm(true);
      if (type === 'save') {
        setIsSaving(true);
      }
      const data = methods.getValues();
      const adImages = (data.ads || []).map((ad) => (ad.ad_image ? ad.ad_image : null));

      const formattedAds = data.ads.map((ad) => {
        const formatted = {
          ...ad,
          ad_start_date: formatDate(ad.ad_start_date),
          ad_end_date: formatDate(ad.ad_end_date),
          ad_status:
            ad.selected && type === 'unpublish'
              ? ad.ad_status === 'archived'
                ? 'archived'
                : 'inactive'
              : ad.selected
                ? 'live'
                : ad.ad_status === 'live'
                  ? 'inactive'
                  : ad.ad_status,
          ad_external_url: ad.is_external === 'yes' ? ad.ad_external_url : null,
          ad_destination_page: ad.is_external === 'no' ? ad.ad_destination_page : null,
          ad_destination_models: ad.is_external === 'no' ? ad.ad_destination_models : null,
        };

        // Always remove ad_image for internal ads
        const { ad_image, ad_image_url, ...rest } = formatted;
        return rest;
      });

      const payload = {
        ...data,
        campaign_status:
          type === 'publish'
            ? 'active'
            : type === 'unpublish'
              ? 'inactive'
              : data.id === null
                ? 'draft'
                : data.campaign_status,
        ads: formattedAds,
      };

      const formData = new FormData();
      formData.append('data', JSON.stringify(payload));
      adImages.forEach((img, idx) => {
        if (img) {
          formData.append(`files[ads][${idx}][ad_image]`, img);
        }
      });

      const response = await axios.post(`/${pluginId}/campaign`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response?.data?.details?.conflict) {
        setIsOpenCreateCampaignModal(false);
        setIsOpenEditCampaignModal(false);
        setOpenAdDurationOverlapModal(true);
        setAdDurationOverlapData(response?.data?.details?.adRemote);
        return;
      }

      if (mode === 'create')
        history.push(`/plugins/${pluginId}/campaigns/edit/${response.data.id}`);

      if (mode === 'edit') {
        await mutate(['campaign', Number(campaignId)], undefined, {
          revalidate: true,
        });
      }

      let toastMsg = 'Campaign updated!';
      if (mode === 'create') {
        if (type === 'publish') toastMsg = 'Campaign published!';
        else if (type === 'save') toastMsg = 'Campaign saved as draft!';
      } else {
        if (type === 'publish') toastMsg = 'Campaign published!';
        else if (type === 'save') toastMsg = 'Campaign changes saved!';
        else if (type === 'unpublish') toastMsg = 'Campaign unpublished!';
      }

      toast.success(toastMsg, {
        icon: <CheckCircle color="success500" />,
        position: 'top-center',
      });
      setIsOpenEditCampaignModal(false);
      setIsOpenCreateCampaignModal(false);
      setOpenAdDurationOverlapModal(false);
    } catch (error) {
      console.error('Error creating campaign:', error);
    } finally {
      setIsSubmittingCampaignForm(false);
      setIsSaving(false);
    }
  };

  return (
    <FormProvider {...methods}>
      {openAdDurationOverlapModal && (
        <AdDurationOverlapModal
          isOpen={openAdDurationOverlapModal}
          data={AdDurationOverlapData}
          setIsOpen={setOpenAdDurationOverlapModal}
          disabled={isSubmittingCampaignForm}
          onSubmit={() => {
            setOpenAdDurationOverlapModal(false);
          }}
        />
      )}
      <CreateCampaignModal
        isOpen={isOpenCreateCampaignModal}
        disabled={isSubmittingCampaignForm}
        setIsOpen={setIsOpenCreateCampaignModal}
        onSubmit={() => handleCampaignSubmit('publish')}
        adsCount={getSelectedAdsToPublish(formAds).length}
      />
      <EditCampaignModal
        isOpen={isOpenEditCampaignModal}
        setIsOpen={setIsOpenEditCampaignModal}
        disabled={isSubmittingCampaignForm}
        isPublish={campaign?.campaign_status !== 'active'}
        onSubmit={() =>
          handleCampaignSubmit(campaign?.campaign_status === 'active' ? 'unpublish' : 'publish')
        }
        adsCount={
          campaign?.campaign_status === 'active'
            ? getSelectedAdsToUnpublish(formAds).length
            : getSelectedAdsToPublish(formAds).length
        }
      />
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
      <form
        className="py-16"
        // onSubmit={methods.handleSubmit(handleCampaignSubmit)}
      >
        {/*
         =============================================
         HEADER SECTION
         Campaign title and action buttons
         =============================================
        */}
        <Box padding={4} position="sticky" top={0} zIndex={100} background="neutral0">
          {(mode === 'edit' || mode === 'view') && <BackButton />}

          <div className="flex justify-between items-center">
            {mode === 'create' && <Typography variant="alpha">Create Campaign</Typography>}
            {(mode === 'edit' || mode === 'view') && (
              <Flex direction="column" alignItems="flex-start">
                <Flex gap={2}>
                  <Typography variant="pi" textColor="neutral600">
                    {format(new Date(campaign?.min_date ?? '2025-12-01'), 'MM/dd/yy')} -{' '}
                    {format(new Date(campaign?.max_date ?? '2024-12-31'), 'MM/dd/yy')}
                  </Typography>
                  <StatusBadge status={campaign?.campaign_status ?? 'draft'} />
                </Flex>
                <Typography variant="alpha">{methods.getValues('campaign_name')}</Typography>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink>ADGM</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                          history.push(`/plugins/${pluginId}/campaigns`);
                        }}
                      >
                        Campaign Management{' '}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink>{methods.getValues('campaign_name')}</BreadcrumbLink>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </Flex>
            )}
            <div className="flex gap-4">
              {mode === 'edit' && (
                <CustomButton
                  disabled={mode === 'view'}
                  onClick={() => history.push(`/plugins/${pluginId}/campaigns/view/${campaignId}`)}
                >
                  Exit Edit Mode
                </CustomButton>
              )}
              {mode === 'edit' && (
                <>
                  <Button
                    startIcon={<More />}
                    variant="tertiary"
                    size="L"
                    ref={morePopoverRef}
                    onClick={() => setOpenMorePopover(!openMorePopover)}
                  >
                    More
                  </Button>

                  {openMorePopover && (
                    <Popover
                      source={morePopoverRef}
                      placement="bottom"
                      spacing={4}
                      onDismiss={() => setOpenMorePopover(false)}
                    >
                      <Flex direction="column">
                        <PopoverItem
                          role="button"
                          onClick={
                            campaign?.campaign_status === 'inactive'
                              ? undefined
                              : () => setIsOpenUnpublishCampaignModal(true)
                          }
                          justifyContent="space-between"
                          gap={6}
                          className={campaign?.campaign_status !== 'active' ? 'disabled' : ''}
                        >
                          <Typography>Unpublish</Typography>
                          <Pause />
                        </PopoverItem>
                        <PopoverItem
                          justifyContent="space-between"
                          role="button"
                          style={{ width: '100%' }}
                          className={campaign?.campaign_status === 'archived' ? 'disabled' : ''}
                          onClick={() => setIsOpenArchiveCampaignModal(true)}
                        >
                          <Typography>Archive</Typography>
                          <Archive />
                        </PopoverItem>
                      </Flex>
                    </Popover>
                  )}
                </>
              )}
              {mode === 'edit' && campaign?.campaign_status !== 'draft' && (
                <CustomButton
                  disabled={mode === 'view'}
                  onClick={() =>
                    history.push(`/plugins/${pluginId}/campaigns/report/${campaignId}`)
                  }
                >
                  <Analytics stroke="#32324d" />
                  View Report
                </CustomButton>
              )}
              {mode !== 'view' && (
                <CustomButton
                  onClick={() => handleCampaignSubmit('save')}
                  disabled={mode === 'view' || isSubmittingCampaignForm}
                >
                  {isSaving ? <Loader small /> : <Save stroke="#32324d" />}
                  Save
                </CustomButton>
              )}
              {mode === 'create' && (
                <Button
                  startIcon={<Rocket />}
                  onClick={async () => {
                    const isValid = await validateForm();
                    if (!isValid) return;
                    setIsOpenCreateCampaignModal(true);
                  }}
                  variant="default"
                  size="L"
                  disabled={getSelectedAds(formAds).length === 0 || isSubmittingCampaignForm}
                >
                  {getSelectedAds(formAds).length === 0
                    ? 'Publish'
                    : `Publish with ${getSelectedAds(formAds).length} Ads`}
                </Button>
              )}

              {mode === 'edit' && (
                <Button
                  startIcon={<Rocket />}
                  onClick={async () => {
                    const isValid = await validateForm();
                    if (!isValid) return;
                    setIsOpenEditCampaignModal(true);
                  }}
                  variant="default"
                  size="L"
                  disabled={getSelectedAds(formAds).length === 0 || isSubmittingCampaignForm}
                >
                  {campaign?.campaign_status === 'active' ? 'Unpublish' : 'Publish'}
                </Button>
              )}
            </div>
          </div>
        </Box>

        {/*
         =============================================
         MAIN FORM CONTAINER
         =============================================
        */}
        <Flex
          marginTop={10}
          background="neutral0"
          padding={'20px'}
          gap={5}
          hasRadius
          alignItems="flex-start"
          className="max-md:!flex-col z-99 relative"
        >
          {/*
           =============================================
           LEFT COLUMN: FORM SECTIONS
           Campaign details and advertisements
           =============================================
          */}
          <div className="flex flex-col gap-11 md:w-2/3 ">
            {/* ********** CAMPAIGN DETAILS SECTION ********** */}
            <Flex
              background="neutral100"
              padding={'20px'}
              direction="column"
              hasRadius
              gap={4}
              alignItems="unset"
            >
              <Typography variant="beta">Campaign Details</Typography>

              <FormInput
                name="campaign_name"
                label="Campaign Name*"
                placeholder="Enter campaign name"
                error={errors.campaign_name?.message}
                disabled={mode === 'view'}
              />
              <Flex alignItems="flex-start" direction="column" gap={3}>
                <Typography style={{ fontWeight: 600, fontSize: '12px' }}>
                  Company registered as *
                </Typography>
                <Controller
                  name="campaign_entity_type"
                  control={methods.control}
                  defaultValue="adgm_entity"
                  render={({ field }) => (
                    <Flex gap={5}>
                      <Radio
                        name={field.name}
                        value="adgm_entity"
                        checked={field.value === 'adgm_entity'}
                        onChange={() => field.onChange('adgm_entity')}
                        disabled={mode === 'view'}
                      >
                        ADGM Entity
                      </Radio>
                      <Radio
                        name={field.name}
                        value="external_entity"
                        checked={field.value === 'external_entity'}
                        onChange={() => field.onChange('external_entity')}
                        disabled={mode === 'view'}
                      >
                        External Entity
                      </Radio>
                    </Flex>
                  )}
                />
              </Flex>

              <FormInput
                name="campaign_entity_name"
                label="Entity Name *"
                placeholder="Enter entity name*"
                error={errors.campaign_entity_name?.message}
                disabled={mode === 'view'}
              />
              {methods.watch('campaign_entity_type') === 'adgm_entity' && (
                <FormInput
                  name="campaign_entity_license_number"
                  label="License Number"
                  placeholder="Enter license number"
                  error={errors.campaign_entity_license_number?.message}
                  disabled={mode === 'view'}
                />
              )}
            </Flex>
            {/* ********** ADVERTISEMENTS SECTION ********** */}
            <Box
              background="neutral100"
              padding={'20px'}
              hasRadius
              // borderColor="neutral150"
              // borderStyle="solid"
              // borderWidth="1px"
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Typography as="h3" variant="beta">
                  Advertisements
                </Typography>
                {formAds.length > 0 && (
                  <Flex alignItems="center" justifyContent="center">
                    <Checkbox
                      className="relative z-50"
                      name="selectAll"
                      checked={formAds.every((ad) => ad.selected)}
                      onChange={(e) => handleSelectAllChange(e.target.checked)}
                      disabled={mode === 'view'}
                    />
                    <Typography variant="omega">Select All</Typography>
                  </Flex>
                )}
              </Flex>
              {formAds.length === 0 ? (
                <>
                  {/*
                   ********** EMPTY ADS CONTAINER **********
                   */}
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg h-[300px]">
                    <Button
                      variant="tertiary"
                      onClick={(e) => {
                        e.preventDefault();
                        const currentAds = methods.getValues('ads') || [];
                        methods.setValue('ads', [...currentAds, defaultAdValues]);
                        setActiveAdIdx(currentAds.length); // focus new ad
                      }}
                      startIcon={<Plus />}
                    >
                      Create New Ad
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/*
                   ********** ADS ACCORDION **********
                   */}
                  <Flex alignItems="unset" direction="column" gap={6} marginTop={5}>
                    {formAds.map((ad, idx) => (
                      <div key={idx} class="accordion-header" id={`ad-accordion-${idx}`}>
                        <Accordion
                          expanded={activeAdIdx === idx}
                          // toggle={() => {
                          //   if (mode !== 'edit') {
                          //     setActiveAdIdx(activeAdIdx === idx ? null : idx);
                          //   }
                          // }}

                          toggle={() => {
                            setActiveAdIdx(activeAdIdx === idx ? null : idx);
                          }}
                          onToggle={() => setActiveAdIdx(activeAdIdx === idx ? null : idx)}
                          hasRadius
                          shadow={false}
                          error={null}
                        >
                          <AccordionToggle
                            style={{ width: '100%' }}
                            action={
                              <Flex gap={2}>
                                {mode === 'edit' && (
                                  <>
                                    {ad?.ad_status === 'live' && (
                                      <CustomButton
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          e.preventDefault();
                                          handleUnpublishAd(ad.id);
                                        }}
                                      >
                                        <Pause stroke="#32324d" className="accordion-svg" />
                                        Unpublish
                                      </CustomButton>
                                    )}
                                    {ad?.id &&
                                      campaign?.campaign_status !== 'draft' &&
                                      ad?.ad_status !== 'draft' && (
                                        <CustomButton
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            history.push(
                                              `/plugins/${pluginId}/ads/report/${ad.id}`
                                            );
                                          }}
                                        >
                                          <Analytics stroke="#32324d" className="accordion-svg" />
                                          Report
                                        </CustomButton>
                                      )}
                                  </>
                                )}
                                {mode === 'view' && (
                                  <CustomButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      history.push(
                                        `/plugins/${pluginId}/campaigns/edit/${campaign?.id}?ad=${ad?.id}`
                                      );
                                    }}
                                  >
                                    <Edit stroke="#32324d" />
                                    Edit
                                  </CustomButton>
                                )}
                                {!ad?.id && mode !== 'view' && (
                                  <Button
                                    variant="tertiary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      handleRemoveAd(idx);
                                    }}
                                    startIcon={<Cross />}
                                  >
                                    Close
                                  </Button>
                                )}
                              </Flex>
                            }
                            title={
                              <Flex
                                style={{ width: 'auto' }}
                                direction="row"
                                alignItems="center"
                                gap={1}
                              >
                                <Checkbox
                                  className="relative z-50"
                                  name={`ads.${idx}.selected`}
                                  checked={!!formAds[idx]?.selected}
                                  onChange={(e) => handleAdCheckboxChange(e.target.checked, idx)}
                                  onClick={(e) => e.stopPropagation()}
                                  disabled={mode === 'view' || !!errors?.ads?.[idx]}
                                />
                                <Flex direction="column" alignItems="flexStart" gap={1}>
                                  <Flex gap={2} alignItems="center">
                                    <Typography>{`Ad ${idx + 1}`}</Typography>
                                    <StatusBadge
                                      status={
                                        campaign?.campaign_status === 'draft'
                                          ? 'draft'
                                          : ad?.ad_status
                                      }
                                    />
                                  </Flex>

                                  <Typography>
                                    {formAds[idx]?.ad_name || 'Ad Title Preview'}
                                  </Typography>

                                  <Typography textColor="neutral600" variant="pi">
                                    {formAds[idx]?.ad_type
                                      ? adTypes.find((t) => t.id === formAds[idx]?.ad_type)?.title
                                      : 'Ad Type Preview - '}

                                    {formAds[idx]?.ad_spot ? ' - ' : ''}

                                    {formAds[idx]?.ad_spot
                                      ? (
                                          activeAdType?.ad_spots?.find(
                                            (s) => s.id === formAds[idx]?.ad_spot
                                          )?.ad_spot_title || ''
                                        ).replace(/\b\w/g, (c) => c.toUpperCase())
                                      : ''}

                                    {formAds[idx]?.ad_start_date &&
                                    formAds[idx]?.ad_start_date !== '{}' &&
                                    !isNaN(new Date(formAds[idx]?.ad_start_date).getTime())
                                      ? ' • '
                                      : ''}

                                    {formAds[idx]?.ad_start_date &&
                                    formAds[idx]?.ad_start_date !== '{}' &&
                                    !isNaN(new Date(formAds[idx]?.ad_start_date).getTime())
                                      ? `${format(new Date(formAds[idx]?.ad_start_date), 'dd/MM/yyyy')} - ${
                                          formAds[idx]?.ad_end_date &&
                                          formAds[idx]?.ad_end_date !== '{}' &&
                                          !isNaN(new Date(formAds[idx]?.ad_end_date).getTime())
                                            ? format(
                                                new Date(formAds[idx]?.ad_end_date),
                                                'dd/MM/yyyy'
                                              )
                                            : 'Ongoing'
                                        }`
                                      : 'Date Preview'}
                                  </Typography>
                                </Flex>
                              </Flex>
                            }
                            description={null}
                          />
                          <AccordionContent padding="24px">
                            <div className="flex flex-col gap-5 mt-4 p-8">
                              <FormInput
                                name={`ads.${idx}.ad_name`}
                                label={`Ad ${idx + 1} Name`}
                                placeholder={`Enter ad name for Ad ${idx + 1}*`}
                                error={errors.ads?.[idx]?.ad_name?.message}
                                disabled={mode === 'view'}
                              />
                              <div className="flex gap-1 flex-col">
                                <div className="flex gap-5 w-full">
                                  <div className="flex flex-col flex-[1_1_0%] min-w-0">
                                    <FormDatePicker
                                      name={`ads.${idx}.ad_start_date`}
                                      label="Start Date*"
                                      error={errors.ads?.[idx]?.ad_start_date?.message}
                                      disabled={mode === 'view'}
                                    />
                                  </div>
                                  <div className="flex flex-col flex-[1_1_0%] min-w-0">
                                    <FormDatePicker
                                      name={`ads.${idx}.ad_end_date`}
                                      label="End Date"
                                      error={errors.ads?.[idx]?.ad_end_date?.message}
                                      disabled={mode === 'view'}
                                    />
                                  </div>
                                </div>
                                <Typography textColor="neutral600" variant="pi">
                                  your campaign will be publised on the above dates subject to adgm
                                  admin team approval
                                </Typography>
                              </div>
                              <Box>
                                <Typography
                                  style={{
                                    fontWeight: 600,
                                    fontSize: '12px',
                                    margin: '0 0 8px 0',
                                    display: 'block',
                                  }}
                                >
                                  Ad Type*
                                </Typography>
                                <Controller
                                  name={`ads.${idx}.ad_type`}
                                  control={methods.control}
                                  disabled={mode === 'view' || campaign?.campaign_status === 'live'}
                                  render={({ field }) => (
                                    <Flex gap={2} style={{ height: '184px' }}>
                                      {adTypes.map((adType) => (
                                        <Flex
                                          key={adType.id}
                                          style={{
                                            width: '100%',
                                            borderRadius: '4px',
                                            height: '184px',
                                            padding: '14px',
                                            cursor:
                                              mode === 'view' ||
                                              (campaign?.campaign_status === 'active' &&
                                                ad?.ad_status === 'live')
                                                ? 'not-allowed'
                                                : 'pointer',
                                          }}
                                          background={
                                            field.value === adType.id ? 'neutral00' : 'neutral0'
                                          }
                                          borderColor={
                                            field.value === adType.id ? 'primary700' : 'primary100'
                                          }
                                          borderWidth="2px"
                                          borderStyle="solid"
                                          direction="column"
                                          justifyContent="space-between"
                                          alignItems="start"
                                          onClick={() => {
                                            if (
                                              mode === 'view' ||
                                              (campaign?.campaign_status === 'active' &&
                                                ad?.ad_status === 'live')
                                            )
                                              return;
                                            field.onChange(adType.id);
                                            methods.setValue(`ads.${idx}.ad_image`, null);
                                            methods.setValue(`ads.${idx}.ad_image_url`, null);
                                            methods.setValue(`ads.${idx}.ad_video_url`, null);
                                            methods.setValue(`ads.${idx}.ad_spot`, null);
                                            methods.setValue(`ads.${idx}.ad_screens`, []);
                                          }}
                                          tabIndex={0}
                                          aria-pressed={field.value === adType.id}
                                        >
                                          <Flex
                                            justifyContent="space-between"
                                            alignItems="start"
                                            style={{ width: '100%' }}
                                          >
                                            <img
                                              style={{ width: '29px' }}
                                              src={adTypeCardImages[adType.ad_type_id] || ''}
                                              alt={adType.title}
                                            />
                                            <Radio
                                              name={field.name}
                                              value={adType.id}
                                              checked={field.value === adType.id}
                                              onChange={() => {
                                                field.onChange(adType.id);
                                                methods.setValue(`ads.${idx}.ad_image`, null);
                                                methods.setValue(`ads.${idx}.ad_image_url`, null);
                                                methods.setValue(`ads.${idx}.ad_video_url`, null);
                                                methods.setValue(`ads.${idx}.ad_spot`, null);
                                                methods.setValue(`ads.${idx}.ad_screens`, []);
                                              }}
                                              tabIndex={-1} // prevent double focus
                                              disabled={
                                                mode === 'view' ||
                                                (campaign?.campaign_status === 'active' &&
                                                  ad?.ad_status === 'live')
                                              }
                                            />
                                          </Flex>
                                          <Flex direction="column" alignItems="start" gap="2">
                                            <Typography style={{ fontSize: '12px' }} variant="beta">
                                              {adType.title}
                                            </Typography>
                                            <Typography
                                              style={{ fontSize: '10px' }}
                                              textColor="neutral600"
                                              variant="epsilon"
                                            >
                                              {adType.description}
                                            </Typography>
                                          </Flex>
                                        </Flex>
                                      ))}
                                    </Flex>
                                  )}
                                />

                                {methods.formState.errors?.ads?.[idx]?.ad_type?.message && (
                                  <Typography
                                    variant="pi"
                                    textColor="danger600"
                                    style={{ marginTop: '8px', fontSize: '12px' }}
                                  >
                                    {methods.formState.errors.ads[idx].ad_type.message}
                                  </Typography>
                                )}
                              </Box>

                              {activeAdType && (
                                <Box style={{ width: '100%' }} key={activeAdType.id}>
                                  <Controller
                                    name={`ads.${idx}.ad_spot`}
                                    control={methods.control}
                                    render={({ field }) => (
                                      <Flex alignItems="start" direction="column" gap={2}>
                                        {activeAdType?.ad_spots.map((adSpot) => (
                                          <Flex
                                            justifyContent="space-between"
                                            style={{ width: '100%' }}
                                          >
                                            <Radio
                                              name={field.name}
                                              value={adSpot.id}
                                              checked={field.value === adSpot.id}
                                              onChange={() => {
                                                field.onChange(adSpot.id);
                                                methods.setValue(`ads.${idx}.ad_screens`, []);
                                              }}
                                              disabled={
                                                mode === 'view' ||
                                                (campaign?.campaign_status === 'active' &&
                                                  ad?.ad_status === 'live')
                                              }
                                            >
                                              {adSpot.ad_spot_display_text}
                                            </Radio>
                                            {methods.watch(`ads.${idx}.ad_spot`) === adSpot.id &&
                                              adSpot.ad_screens.length > 0 && (
                                                <Controller
                                                  name={`ads.${idx}.ad_screens`}
                                                  control={methods.control}
                                                  defaultValue={[]} // Ensures the value is always an array
                                                  render={({ field }) => (
                                                    <Flex gap={4}>
                                                      {adSpot.ad_screens.map((screen) => (
                                                        <Checkbox
                                                          key={screen.id}
                                                          value={screen.id}
                                                          checked={
                                                            Array.isArray(field.value) &&
                                                            field.value.includes(screen.id)
                                                          }
                                                          onChange={(e) => {
                                                            const checked = e.target.checked;
                                                            const value = screen.id;
                                                            let newValue = Array.isArray(
                                                              field.value
                                                            )
                                                              ? [...field.value]
                                                              : [];
                                                            if (checked) {
                                                              if (!newValue.includes(value))
                                                                newValue.push(value);
                                                            } else {
                                                              newValue = newValue.filter(
                                                                (v) => v !== value
                                                              );
                                                            }
                                                            field.onChange(newValue);
                                                          }}
                                                          disabled={
                                                            mode === 'view' ||
                                                            (campaign?.campaign_status ===
                                                              'active' &&
                                                              ad?.ad_status === 'live')
                                                          }
                                                        >
                                                          {screen.ad_screen_title}
                                                        </Checkbox>
                                                      ))}
                                                    </Flex>
                                                  )}
                                                />
                                              )}
                                          </Flex>
                                        ))}
                                        {methods.formState.errors?.ads?.[idx]?.ad_spot?.message && (
                                          <Typography
                                            variant="pi"
                                            textColor="danger600"
                                            style={{ marginTop: '4px', fontSize: '12px' }}
                                          >
                                            {methods.formState.errors.ads[idx].ad_spot?.message}
                                          </Typography>
                                        )}
                                        {methods.formState.errors?.ads?.[idx]?.ad_screens
                                          ?.message && (
                                          <Typography
                                            variant="pi"
                                            textColor="danger600"
                                            style={{ marginTop: '4px', fontSize: '12px' }}
                                          >
                                            {methods.formState.errors.ads[idx].ad_screens?.message}
                                          </Typography>
                                        )}
                                      </Flex>
                                    )}
                                  />
                                </Box>
                              )}

                              <FormInput
                                name={`ads.${idx}.ad_headline`}
                                label={`Headline* (max ${getCurrentValidationRules(idx).titleMax} chars)`}
                                placeholder={`Enter headline (max ${getCurrentValidationRules(idx).titleMax} chars)`}
                                maxLength={getCurrentValidationRules(idx).titleMax}
                                error={errors.ads?.[idx]?.ad_headline?.message}
                                disabled={mode === 'view'}
                              />
                              <Box>
                                <Typography
                                  style={{
                                    fontWeight: 600,
                                    fontSize: '12px',
                                    margin: '0 0 8px 0',
                                    display: 'block',
                                  }}
                                >
                                  Destination URL*
                                </Typography>

                                <Controller
                                  name={`ads.${idx}.is_external`}
                                  control={methods.control}
                                  // defaultValue={true}
                                  render={({ field }) => (
                                    <Flex
                                      gap={5}
                                      style={{
                                        margin: '0 0 8px 0',
                                      }}
                                    >
                                      <Radio
                                        name={field.name}
                                        value="yes"
                                        checked={field.value === 'yes'}
                                        onChange={() => field.onChange('yes')}
                                        disabled={mode === 'view'}
                                      >
                                        External
                                      </Radio>
                                      <Radio
                                        name={field.name}
                                        value="no"
                                        checked={field.value === 'no'}
                                        onChange={() => field.onChange('no')}
                                        disabled={mode === 'view'}
                                      >
                                        Internal (In-app route)
                                      </Radio>
                                    </Flex>
                                  )}
                                />
                                {methods.watch(`ads.${idx}.is_external`) === 'yes' && (
                                  <FormInput
                                    name={`ads.${idx}.ad_external_url`}
                                    // label={`Destination URL*`}
                                    placeholder="Enter Destination URL"
                                    style={{ margin: 0 }}
                                    type="url"
                                    maxLength={2048}
                                    error={errors.ads?.[idx]?.ad_external_url?.message}
                                    disabled={mode === 'view'}
                                    className="m-0"
                                  />
                                )}
                                {methods.watch(`ads.${idx}.is_external`) === 'no' && (
                                  <Box>
                                    <Box marginBottom={3}>
                                      <Controller
                                        name={`ads.${idx}.ad_destination_models`}
                                        control={methods.control}
                                        defaultValue=""
                                        render={({ field }) => (
                                          <SingleSelect
                                            value={field.value ?? ''}
                                            onChange={(value) => {
                                              field.onChange(value);
                                              setActiveDestinationPage(1);
                                              setActiveDestinationPageOptions([]);
                                              methods.setValue(
                                                `ads.${idx}.ad_destination_page`,
                                                ''
                                              );
                                            }}
                                            disabled={mode === 'view'}
                                            placeholder="Select Destination Model"
                                          >
                                            {destinationModels.map((option) => (
                                              <SingleSelectOption
                                                key={option?.key}
                                                value={option?.key}
                                              >
                                                {option?.label}
                                              </SingleSelectOption>
                                            ))}
                                          </SingleSelect>
                                        )}
                                      />
                                      {methods.formState.errors?.ads?.[idx]?.ad_destination_models
                                        ?.message && (
                                        <Typography
                                          variant="pi"
                                          textColor="danger600"
                                          style={{ marginTop: '4px', fontSize: '12px' }}
                                        >
                                          {
                                            methods.formState.errors.ads[idx].ad_destination_models
                                              ?.message
                                          }
                                        </Typography>
                                      )}
                                    </Box>
                                    <Controller
                                      name={`ads.${idx}.ad_destination_page`}
                                      control={methods.control}
                                      defaultValue=""
                                      render={({ field }) => {
                                        let options = [];
                                        if (mode === 'view') {
                                          // Only show default option in view mode
                                          options = activeDestinationPageOptionsDefault.length
                                            ? activeDestinationPageOptionsDefault
                                            : [];
                                        } else if (
                                          mode === 'edit' &&
                                          activeDestinationPageOptionsDefault.length > 0 &&
                                          activeDestinationPageOptions.length === 0
                                        ) {
                                          // In edit mode, show default if present and no fetched options
                                          options = activeDestinationPageOptionsDefault;
                                        } else {
                                          // In create or edit (after model change), show fetched options
                                          options =
                                            activeDestinationPageOptions.length > 0
                                              ? activeDestinationPageOptions
                                              : [];
                                        }

                                        return (
                                          <SingleSelect
                                            value={field.value ?? ''}
                                            onChange={(value) => field.onChange(value)}
                                            disabled={mode === 'view' || options.length === 0}
                                            placeholder="Select Destination Page"
                                          >
                                            {options.map((option) => (
                                              <SingleSelectOption
                                                key={option?.id}
                                                value={option?.id}
                                              >
                                                {option?.title}
                                              </SingleSelectOption>
                                            ))}
                                            {mode !== 'view' &&
                                              activeDestinationPage <
                                                totalDestinationPageOptions && (
                                                <Button
                                                  style={{ width: '100%' }}
                                                  variant="tertiary"
                                                  onClick={() =>
                                                    setActiveDestinationPage((prev) => prev + 1)
                                                  }
                                                >
                                                  Load More
                                                </Button>
                                              )}
                                          </SingleSelect>
                                        );
                                      }}
                                    />
                                    {methods.formState.errors?.ads?.[idx]?.ad_destination_page
                                      ?.message && (
                                      <Typography
                                        variant="pi"
                                        textColor="danger600"
                                        style={{ marginTop: '4px', fontSize: '12px' }}
                                      >
                                        {
                                          methods.formState.errors.ads[idx].ad_destination_page
                                            ?.message
                                        }
                                      </Typography>
                                    )}
                                  </Box>
                                )}
                              </Box>
                              <FormTextArea
                                name={`ads.${idx}.ad_description`}
                                label={`Description* (max ${getCurrentValidationRules(idx).descMax} chars)`}
                                maxLength={getCurrentValidationRules(idx).descMax}
                                placeholder={`Enter ad description (max ${getCurrentValidationRules(idx).descMax} chars)`}
                                error={errors.ads?.[idx]?.ad_description?.message}
                                disabled={mode === 'view'}
                              />
                              {activeAdType?.ad_type_id === 'sticky-ad' && (
                                <FormInput
                                  name={`ads.${idx}.ad_cta_name`}
                                  label="CTA Name*"
                                  placeholder="Enter CTA Name"
                                  error={errors.ads?.[idx]?.ad_cta_name?.message}
                                  disabled={mode === 'view'}
                                />
                              )}
                              <TabGroup>
                                {getCurrentValidationRules(idx).videoAllowed && (
                                  <Tabs style={{ marginBottom: '16px', width: '15rem' }}>
                                    <TabButton>
                                      <Button
                                        variant="tertiary"
                                        size="L"
                                        style={{
                                          width: '100%',
                                          display: 'flex',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <Typography
                                          variant="pi"
                                          fontWeight="bold"
                                          textColor="neutral800"
                                        >
                                          Upload Image
                                        </Typography>
                                      </Button>
                                    </TabButton>

                                    <TabButton>
                                      <Button
                                        variant="tertiary"
                                        size="L"
                                        style={{
                                          width: '100%',
                                          display: 'flex',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <Typography
                                          variant="pi"
                                          fontWeight="bold"
                                          textColor="neutral800"
                                        >
                                          Video
                                        </Typography>
                                      </Button>
                                    </TabButton>
                                  </Tabs>
                                )}
                                <TabPanels>
                                  <TabPanel>
                                    <FileUpload
                                      name={`ads.${idx}.ad_image`}
                                      adImageUrl={`ads.${idx}.ad_image_url`}
                                      disabled={mode === 'view'}
                                      activeAdTypeId={methods.watch(`ads.${idx}.ad_type`)}
                                      adTypes={adTypes}
                                      error={errors.ads?.[idx]?.ad_image?.message}
                                    />
                                  </TabPanel>
                                  <TabPanel>
                                    {getCurrentValidationRules(idx).videoAllowed ? (
                                      <FormInput
                                        name={`ads.${idx}.ad_video_url`}
                                        label={`Vimeo Link`}
                                        placeholder={`https://example.com`}
                                        type="url"
                                        error={errors.ads?.[idx]?.ad_video_url?.message}
                                        disabled={mode === 'view'}
                                      />
                                    ) : (
                                      <Box padding={4} background="neutral100" hasRadius>
                                        <Typography textColor="neutral600" variant="pi">
                                          Video is not available for this ad configuration
                                        </Typography>
                                      </Box>
                                    )}
                                  </TabPanel>
                                </TabPanels>
                              </TabGroup>
                            </div>
                          </AccordionContent>
                        </Accordion>
                      </div>
                    ))}
                  </Flex>

                  {/*
                   ********** ADD AD BUTTON **********
                   */}
                  <div className="flex justify-end !mt-6">
                    <Button
                      variant="tertiary"
                      className="w-full !h-auto py-6 flex items-center justify-center mt-4"
                      disabled={mode === 'view'}
                      onClick={(e) => {
                        e.preventDefault();
                        const currentAds = methods.getValues('ads') || [];
                        methods.setValue('ads', [...currentAds, defaultAdValues]);
                        setActiveAdIdx(currentAds.length); // focus new ad
                      }}
                      startIcon={<Plus />}
                    >
                      Add Ad
                    </Button>
                  </div>
                </>
              )}
            </Box>
          </div>

          {/*
           =============================================
           RIGHT COLUMN: PREVIEW AND SUMMARY
           Ad preview and campaign summary sections
           =============================================
          */}
          <Flex
            background="neutral100"
            direction="column"
            as="aside"
            padding="20px"
            className="flex-1 gap-5 relative"
            style={{ alignSelf: 'flex-start', position: 'sticky', top: '200px' }}
          >
            {/*
             ********** AD PREVIEW SECTION **********
             */}
            <div className="items-center justify-center py-16 flex flex-col bg-card-color border border-border-form rounded-md">
              <div className="w-full px-5">
                <Flex direction="column" justifyContent="space-between" alignItems="center">
                  <Typography variant="omega" fontWeight="bold" className="mb-5 text-label">
                    Ad Preview
                  </Typography>
                  <Typography
                    textColor="neutral500"
                    variant="pi"
                    fontWeight="bold"
                    className="text-label"
                  >
                    Select AD to preview
                  </Typography>
                </Flex>
                {(methods.getValues(`ads.${activeAdIdx}.ad_image`) ||
                  methods.getValues(`ads.${activeAdIdx}.ad_image_url`)) && (
                  <>
                    <div onClick={downloadImage}>
                      <Download
                        style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: '25px',
                          right: '25px',
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="relative mt-5" ref={imgRef}>
                <img
                  src={iphoneFrame}
                  alt="Ad Preview"
                  className="rounded  h-[424px] object-contain object-center"
                />

                <div className="z-10 flex items-center justify-center top-0 absolute h-full py-20 w-full left-1/2 -translate-x-1/2">
                  <div
                    style={{
                      width: 'calc(100% - 2rem)',
                      aspectRatio: activeAdType?.image_size
                        ? `${activeAdType.image_size.width} / ${activeAdType.image_size.height}`
                        : '1',
                      maxHeight: '100%',
                    }}
                    className="relative flex items-end rounded-3xl overflow-hidden"
                  >
                    <div style={{ top: '10px', right: '10px' }} className="absolute z-20">
                      <CustomIconButton isDark={true}>
                        <Arrow />
                      </CustomIconButton>
                    </div>

                    <img
                      src={
                        methods.getValues(`ads.${activeAdIdx}.ad_image`)
                          ? URL.createObjectURL(methods.getValues(`ads.${activeAdIdx}.ad_image`))
                          : (methods.getValues(`ads.${activeAdIdx}.ad_image_url`) ?? previewImage)
                      }
                      alt=""
                      style={{
                        aspectRatio: activeAdType?.image_size
                          ? `${activeAdType.image_size.width} / ${activeAdType.image_size.height}`
                          : '1',
                      }}
                      className="absolute inset-0 size-full object-cover object-center z-1 rounded-3xl"
                    />
                    {(methods.getValues(`ads.${activeAdIdx}.ad_image`) ||
                      methods.getValues(`ads.${activeAdIdx}.ad_image_url`)) && (
                      <div
                        style={{
                          position: 'absolute',
                          borderRadius: '1.5rem',
                          bottom: 0,
                          left: 0,
                          maskImage: 'linear-gradient(transparent, black, black)',
                          width: '100%',
                          height: '60%',
                          background:
                            'linear-gradient(to bottom, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.5))',
                          backdropFilter: 'blur(21px)',
                          zIndex: 0,
                        }}
                      />
                    )}
                    <div
                      style={{
                        padding: '0.5rem',
                      }}
                      className="flex flex-col gap-1 px-6 z-20 w-full"
                    >
                      <Typography
                        style={{ whiteSpace: 'normal', color: 'white', wordBreak: 'break-word' }}
                        variant="beta"
                      >
                        {truncate(getCurrentAdTitle(), 32)}
                      </Typography>
                      <Typography
                        style={{ fontSize: '10px', color: '#f6f6f9', marginBottom: '0.4rem' }}
                        variant="pi"
                      >
                        {truncate(getCurrentAdDescription(), 30)}
                      </Typography>
                      <Typography style={{ color: 'white' }} variant="pi">
                        Sponsored{' '}
                        <span
                          style={{
                            backgroundColor: 'white',
                            color: 'black',
                            padding: '0px 4px',
                            borderRadius: '4px',
                            fontSize: '10px',
                          }}
                        >
                          AD
                        </span>
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
              <Typography
                textColor="neutral500"
                variant="pi"
                fontWeight="bold"
                className="mt-5 text-label"
              >
                {methods.getValues(`ads.${activeAdIdx}.ad_image`) && activeAdType?.image_size
                  ? `${methods.getValues(`ads.${activeAdIdx}.ad_name`)} - ${activeAdType.image_size.width}px × ${activeAdType.image_size.height}px`
                  : 'Ad Name - Ad Size'}
              </Typography>
            </div>
          </Flex>
        </Flex>
      </form>
    </FormProvider>
  );
};

export default CampaignForm;
