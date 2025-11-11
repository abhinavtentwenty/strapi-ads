//@ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import styled from 'styled-components';
// import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { Plus, Rocket, More, Pencil } from '@strapi/icons';
import Analytics from '../../../components/Icons/Analytics';
import Edit from '../../../components/Icons/Edit';
import Pause from '../../../components/Icons/Pause';
import Archive from '../../../components/Icons/Archive';
import {
  Accordion,
  AccordionToggle,
  AccordionContent,
  Checkbox,
  Typography,
  DatePicker,
  Textarea,
  Button,
  Radio,
  Flex,
  Popover,
  Box,
  TabGroup,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
} from '@strapi/design-system';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../../components/ui/breadcrumb';
import { Badge } from '../../../components/elements/badge';
import FormCheckbox from '../../../components/elements/form/checkbox';
import FileUpload from '../../../components/elements/form/fileinput';
import CreateCampaignModal from './createCampaignModal';
import EditCampaignModal from './EditCampaignModal';
import AdDurationOverlapModal from './AdDurationOverlapModal';
import { truncate } from '../../../utils/utils';
import CustomButton from '../../../components/elements/customButton';

import iphoneFrame from '../../../assets/phoneFrame.png';
import FormInput from '../../../components/elements/form/input';
import FormDatePicker from '../../../components/elements/form/datepicker';
import FormTextArea from '../../../components/elements/form/textarea';
import Save from '../../../components/icons/Save';
import { FootprintsIcon } from 'lucide-react';
import phoneImage from '../../../assets/phoneFrame.png';
import homeCarousel from '../../../assets/homeCarousel.png';
import widgetBanner from '../../../assets/widgetBanner.png';
import stickyAd from '../../../assets/stickyAd.png';
import listingBanner from '../../../assets/listingBanner.png';
import emptyImage from '../../../assets/emptyImage.png';
import CustomIconButton from '../../../components/elements/customIconButton';
import Arrow from '../../../components/Icons/Arrow';
import useAdType from '../../../components/hooks/useAdType';
import ConfirmArchiveModal from '../../Components/confirmArchiveModal';
import ConfirmUnpublishModal from '../../Components/confirmUnpublishModal';

// TEMP: Placeholder for transformPayload to prevent runtime error
const transformPayload = ({ campaignName, ads }) => ({
  campaignPayload: { campaignName },
  adsPayload: ads,
});

// Default values for a new ad
export const defaultAdValues = {
  name: '',
  title: '',
  startDate: '',
  endDate: '',
  description: '',
  destinationUrl: '',
  adType: '',
  files: [],
  selected: false,
};

const CampaignForm = ({
  mode, // 'create' | 'edit' | 'view'
  initialValues = {
    campaignName: '',
    directory: false,
    news: false,
    events: false,
    offers: false,
    ads: [],
  },
  onSubmit = () => {},
}) => {
  const history = useHistory();
  const { adTypes } = useAdType();
  const [isOpenCreateCampaignModal, setIsOpenCreateCampaignModal] = React.useState(false);
  const [isOpenEditCampaignModal, setIsOpenEditCampaignModal] = React.useState(false);
  const morePopoverRef = React.useRef(null);
  const [openMorePopover, setOpenMorePopover] = React.useState(false);

  const [isOpenArchiveCampaignModal, setIsOpenArchiveCampaignModal] = React.useState(false);
  const [isOpenUnpublishCampaignModal, setIsOpenUnpublishCampaignModal] = React.useState(false);

  const methods = useForm({
    // resolver: zodResolver(CampaignSchema),
    defaultValues: initialValues,
  });

  const errors = methods.formState.errors;
  const campaignName = methods.watch('campaignName');
  const formAds = methods.watch('ads') || [];

  // Track which ad accordion is open for preview (by index)
  const [activeAdIdx, setActiveAdIdx] = React.useState(null);
  const [activeAdType, setActiveAdType] = React.useState(null);
  const adTypeWatch = methods.watch(`ads.${activeAdIdx}.adType`);

  React.useEffect(() => {
    const adType = getCurrentAdType();
    setActiveAdType(adType);
  }, [adTypeWatch]);

  const getCurrentAdType = () => {
    return adTypes.find((type) => type.ad_type_id === adTypeWatch) || null;
  };

  // Checkbox change handler for ad selection
  const handleAdCheckboxChange = (checked, idx) => {
    const isChecked = typeof checked === 'boolean' ? checked : checked === 'true';
    methods.setValue(`ads.${idx}.selected`, isChecked);
  };

  const handleSelectAllChange = (checked) => {
    const ads = methods.getValues('ads') || [];
    ads.forEach((_, idx) => {
      methods.setValue(`ads.${idx}.selected`, checked);
    });
  };

  /**
   * =============================================
   * HELPER FUNCTIONS
   * All helper functions used for ad preview and form logic.
   * =============================================
   */

  const getSelectedAds = (ads) => ads.filter((ad) => ad.selected);
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
  const getCurrentAdTitle = (idx, ads) => {
    const ad = ads[idx] || {};
    return ad.name || 'Ad Title Preview';
  };

  const getCurrentAdDescription = (idx, ads) => {
    const ad = ads[idx] || {};
    return ad.description || 'Ad description preview';
  };

  const adTypeCardImages = {
    'home-carousel': homeCarousel,
    'widget-banner': widgetBanner,
    'sticky-ad': stickyAd,
    'listing-banner': listingBanner,
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
  `;

  const TabButton = styled(Tab)`
    padding: 0; /* remove Tab's default padding */
    border: none;
    background: #eeeeee;

    > div {
      padding: 0 !important;
      background: transparent !important;
    }

    &[aria-selected='true'] {
      /* styles for active tab */
      button {
        background: #4945ff !important; /* active bg */
        color: #ffffff !important; /* white text */
      }

      /* ensure ALL text + icon parts become white */
      svg,
      svg path,
      span,
      p,
      div {
        color: #ffffff !important;
        fill: #ffffff !important;
      }
    }

    &[aria-disabled='true'] {
      cursor: not-allowed;
      opacity: 0.6;
    }
  `;

  return (
    <FormProvider {...methods}>
      {/* <AdDurationOverlapModal isOpen={true} setIsOpen={() => {}} onSubmit={() => {}} /> */}
      <CreateCampaignModal
        isOpen={isOpenCreateCampaignModal}
        setIsOpen={setIsOpenCreateCampaignModal}
        onSubmit={() => {}}
        adsCount={getSelectedAds(formAds).length}
      />
      <EditCampaignModal
        isOpen={isOpenEditCampaignModal}
        setIsOpen={setIsOpenEditCampaignModal}
        onSubmit={() => {}}
        adsCount={getSelectedAds(formAds).length}
      />
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
      <form
        className="py-16"
        // onSubmit={methods.handleSubmit(handlePublish, (errors) => {
        //   console.log("Zod validation errors:", errors);
        // })}
      >
        {/*
         =============================================
         HEADER SECTION
         Campaign title and action buttons
         =============================================
        */}
        <div className="flex justify-between items-center">
          {mode === 'create' && <Typography variant="alpha">Create Campaign</Typography>}
          {(mode === 'edit' || mode === 'view') && (
            <Flex direction="column" alignItems="flex-start">
              <Flex gap={2}>
                <p className="text-xs text-[#62627B] font-normal">
                  {format(new Date('2025-12-01'), 'MM/dd/yy')} -{' '}
                  {format(new Date('2024-12-31'), 'MM/dd/yy')}
                </p>
                {/* <Badge $variant={feature.status}>{feature.status}</Badge>  */}
                <Badge $variant="live">Live</Badge>
              </Flex>
              <Typography variant="alpha">Tourism Q1</Typography>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">ADGM</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>Campaign Management </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>Tourism Q1</BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </Flex>
          )}
          <div className="flex gap-4">
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
                        onClick={() => setIsOpenUnpublishCampaignModal(true)}
                        justifyContent="space-between"
                        gap={6}
                      >
                        <Typography>Unpublish</Typography>
                        <Pause />
                      </PopoverItem>
                      <PopoverItem
                        justifyContent="space-between"
                        role="button"
                        style={{ width: '100%' }}
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
            {mode === 'edit' && (
              <CustomButton
                disabled={mode === 'view'}
                onClick={() => history.push('campaign-report')}
              >
                <Analytics stroke="#32324d" />
                View Report
              </CustomButton>
            )}
            {mode !== 'view' && (
              <CustomButton
                disabled={mode === 'view'}
                onClick={() => {
                  // Redirect using useHistory from react-router-dom
                  history.push('/your-target-page');
                }}
              >
                <Save stroke="#32324d" />
                Save
              </CustomButton>
            )}
            {mode === 'create' && (
              <Button
                startIcon={<Rocket />}
                // type="submit"
                onClick={() => setIsOpenCreateCampaignModal(true)}
                variant="default"
                size="L"
                disabled={getSelectedAds(formAds).length === 0}
              >
                {getSelectedAds(formAds).length === 0
                  ? 'Publish'
                  : `Publish with ${getSelectedAds(formAds).length} Ads`}
              </Button>
            )}

            {mode === 'edit' && (
              <Button
                startIcon={<Rocket />}
                // type="submit"
                onClick={onSubmit}
                variant="default"
                size="L"
                disabled={getSelectedAds(formAds).length === 0}
              >
                Save & Publish
              </Button>
            )}
          </div>
        </div>

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
          className="max-md:!flex-col"
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
                name="campaignName"
                label="Campaign Name*"
                placeholder="Enter campaign name"
                error={errors.campaignName?.message}
                disabled={mode === 'view'}
              />
              <Flex alignItems="flex-start" direction="column" gap={3}>
                <Typography style={{ fontWeight: 600, fontSize: '12px' }}>
                  Company registered as
                </Typography>
                <Controller
                  name="companyRegisteredAs"
                  control={methods.control}
                  defaultValue="basic"
                  render={({ field }) => (
                    <Flex gap={5}>
                      <Radio
                        name={field.name}
                        value="adgm"
                        checked={field.value === 'adgm'}
                        onChange={() => field.onChange('adgm')}
                        disabled={mode === 'view'}
                      >
                        ADGM Entity
                      </Radio>
                      <Radio
                        name={field.name}
                        value="external"
                        checked={field.value === 'external'}
                        onChange={() => field.onChange('external')}
                        disabled={mode === 'view'}
                      >
                        External Entity
                      </Radio>
                    </Flex>
                  )}
                />
              </Flex>

              <FormInput
                name="entityName"
                placeholder="Enter entity name"
                error={errors.entityName?.message}
                disabled={mode === 'view'}
              />
              {methods.watch('companyRegisteredAs') === 'adgm' && (
                <FormInput
                  name="licence"
                  placeholder="Enter licence"
                  error={errors.licence?.message}
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
                      <Accordion
                        key={idx}
                        id={`ad-accordion-${idx}`}
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
                          title={
                            <Flex
                              style={{ width: 'auto' }}
                              direction="row"
                              alignItems="flex-start"
                              gap={1}
                            >
                              <Checkbox
                                className="relative z-50"
                                name={`ads.${idx}.selected`}
                                checked={!!formAds[idx]?.selected}
                                onChange={(e) => handleAdCheckboxChange(e.target.checked, idx)}
                                onClick={(e) => e.stopPropagation()}
                                disabled={mode === 'view'}
                              />

                              <Flex direction="column" alignItems="flexStart" gap={2}>
                                <Flex gap={2} alignItems="center">
                                  <Typography>{`Ad ${idx + 1}`}</Typography>
                                  {mode === 'edit' && <Badge $variant="live">Live</Badge>}
                                  {mode === 'create' && <Badge $variant="draft">Draft</Badge>}
                                </Flex>

                                <Typography>{formAds[idx]?.name || 'Ad Title Preview'}</Typography>
                              </Flex>
                              {mode === 'edit' && (
                                <Flex style={{ marginLeft: '180px' }} gap={2}>
                                  <CustomButton onClick={() => {}}>
                                    <Pause stroke="#32324d" />
                                    Unpublish
                                  </CustomButton>
                                  {/* <Button
                                    startIcon={<Pause stroke="#000" />}
                                    variant="tertiary"
                                    onClick={() => {}}
                                  >
                                    Unpublish
                                  </Button> */}
                                  <CustomButton onClick={() => {}}>
                                    <Analytics stroke="#32324d" />
                                    Report
                                  </CustomButton>
                                  {/* <Button
                                    startIcon={<Analytics stroke="#000" />}
                                    variant="tertiary"
                                    onClick={() => {}}
                                  >
                                    Report
                                  </Button> */}
                                  <CustomButton onClick={() => {}}>
                                    <Edit stroke="#32324d" />
                                    Edit
                                  </CustomButton>
                                  {/* <Button
                                    startIcon={<Pencil fill="neutral1000" />}
                                    variant="tertiary"
                                    // onClick={(e) => {
                                    //   e.stopPropagation();
                                    //   setActiveAdIdx(activeAdIdx === idx ? null : idx);
                                    // }}
                                  >
                                    Edit
                                  </Button> */}
                                </Flex>
                              )}
                            </Flex>
                          }
                          description={null}
                          action={null}
                        />
                        <AccordionContent padding="24px">
                          <div className="flex flex-col gap-5 mt-4 p-8">
                            <FormInput
                              name={`ads.${idx}.name`}
                              label={`Ad ${idx + 1} Name`}
                              placeholder={`Enter ad name for Ad ${idx + 1}`}
                              error={errors.ads?.[idx]?.message}
                              disabled={mode === 'view'}
                            />
                            <div className="flex gap-1 flex-col">
                              <div className="flex gap-5 w-full">
                                <div className="flex flex-col flex-[1_1_0%] min-w-0">
                                  <FormDatePicker
                                    name={`ads.${idx}.startDate`}
                                    label="Start Date"
                                    error={errors.ads?.[idx]?.message}
                                    disabled={mode === 'view'}
                                  />
                                </div>
                                <div className="flex flex-col flex-[1_1_0%] min-w-0">
                                  <FormDatePicker
                                    name={`ads.${idx}.endDate`}
                                    label="End Date"
                                    error={errors.ads?.[idx]?.message}
                                    disabled={mode === 'view'}
                                  />
                                </div>
                              </div>
                              <Typography textColor="neutral600" variant="pi">
                                your campaign will be publised on the above dates subject to adgm
                                admin team approval
                              </Typography>
                            </div>
                            <Controller
                              name={`ads.${idx}.adType`}
                              control={methods.control}
                              render={({ field }) => (
                                <Flex gap={2} style={{ height: '184px' }}>
                                  {adTypes.map((adType) => (
                                    <Flex
                                      key={adType.ad_type_id}
                                      style={{
                                        width: '100%',
                                        backgroundColor: '#F9F9F9',
                                        borderRadius: '4px',
                                        height: '184px',
                                        padding: '14px',
                                        cursor: 'pointer',
                                        border:
                                          field.value === adType.ad_type_id
                                            ? '2px solid #666687'
                                            : '2px solid transparent',
                                      }}
                                      direction="column"
                                      justifyContent="space-between"
                                      alignItems="start"
                                      onClick={() => field.onChange(adType.ad_type_id)}
                                      tabIndex={0}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ')
                                          field.onChange(adType.ad_type_id);
                                      }}
                                      aria-pressed={field.value === adType.ad_type_id}
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
                                          value={adType.ad_type_id}
                                          checked={field.value === adType.ad_type_id}
                                          onChange={() => field.onChange(adType.ad_type_id)}
                                          tabIndex={-1} // prevent double focus
                                          disabled={mode === 'view'}
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

                            {activeAdType && (
                              <Box style={{ width: '100%' }} key={activeAdType.ad_type_id}>
                                <Controller
                                  name={`ads.${idx}.adSpot`}
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
                                            value={adSpot.ad_spot_id}
                                            checked={field.value === adSpot.ad_spot_id}
                                            onChange={() => field.onChange(adSpot.ad_spot_id)}
                                          >
                                            {adSpot.ad_spot_display_text}
                                          </Radio>
                                          {methods.watch(`ads.${idx}.adSpot`) ===
                                            adSpot.ad_spot_id &&
                                            adSpot.ad_screens.length > 0 && (
                                              <Flex gap={4}>
                                                {adSpot.ad_screens.map((screen) => (
                                                  <FormCheckbox
                                                    name={`ads.${idx}.${screen.ad_screen_id}`}
                                                    label={screen.ad_screen_title}
                                                  />
                                                ))}
                                              </Flex>
                                            )}
                                        </Flex>
                                      ))}
                                    </Flex>
                                  )}
                                />
                              </Box>
                            )}

                            <FormInput
                              name={`ads.${idx}.headline`}
                              label={`Headline*`}
                              placeholder={`Enter headline`}
                              maxLength={60}
                              error={errors.ads?.[idx]?.message}
                              disabled={mode === 'view'}
                            />
                            <FormInput
                              name={`ads.${idx}.destinationUrl`}
                              label={`Destination URL*`}
                              placeholder={`https://example.com`}
                              type="url"
                              maxLength={2048}
                              error={errors.ads?.[idx]?.message}
                              disabled={mode === 'view'}
                            />
                            <FormTextArea
                              name={`ads.${idx}.description`}
                              label="Description*"
                              maxLength={150}
                              placeholder="Enter ad description"
                              error={errors.ads?.[idx]?.message}
                              disabled={mode === 'view'}
                            />
                            <TabGroup>
                              <Tabs style={{ marginBottom: '16px', width: '15rem' }}>
                                <TabButton>
                                  <Button variant="tertiary" size="L" style={{ width: '100%' }}>
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
                                  <Button variant="tertiary" size="L" style={{ width: '100%' }}>
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
                              <TabPanels>
                                <TabPanel>
                                  <FileUpload
                                    name={`ads.${idx}.files`}
                                    disabled={mode === 'view'}
                                  />
                                </TabPanel>
                                <TabPanel>
                                  <FormInput
                                    name={`ads.${idx}.videoUrl`}
                                    label={`Vimeo Link*`}
                                    placeholder={`https://example.com`}
                                    type="url"
                                    maxLength={60}
                                    error={errors.ads?.[idx]?.message}
                                    disabled={mode === 'view'}
                                  />
                                </TabPanel>
                              </TabPanels>
                            </TabGroup>
                          </div>
                        </AccordionContent>
                      </Accordion>
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
            className="flex-1 gap-5"
          >
            {/*
             ********** AD PREVIEW SECTION **********
             */}
            <div className="items-center justify-center py-16 flex flex-col bg-card-color border border-border-form rounded-md">
              <Typography variant="omega" fontWeight="bold" className="mb-5 text-label">
                Ad Preview
              </Typography>
              <div className="relative">
                <img
                  src={iphoneFrame}
                  alt="Ad Preview"
                  className="rounded shadow  h-[424px] object-contain object-center"
                />

                <div className="z-10 flex items-center justify-center top-0 absolute h-full py-20  w-full left-1/2 -translate-x-1/2">
                  <div
                    style={{ width: 'calc(100% - 2rem)', aspectRatio: '1' }}
                    className=" relative flex items-end rounded-3xl"
                  >
                    <div style={{ top: '10px', right: '10px' }} className="absolute">
                      <CustomIconButton isDark={true}>
                        <Arrow />
                      </CustomIconButton>
                    </div>
                    <img
                      src={
                        methods.getValues(`ads.${activeAdIdx}.files`)?.[0]
                          ? URL.createObjectURL(methods.getValues(`ads.${activeAdIdx}.files`)?.[0])
                          : emptyImage
                      }
                      alt=""
                      className="absolute inset-0 size-full object-cover object-center -z-10 rounded-3xl "
                    />
                    <div className="absolute rounded-3xl bottom-0 w-full h-[35%] bg-gradient-to-t from-black/70 via-black/10 to-transparent backdrop-blur-md z-10" />
                    <div
                      style={{
                        // marginBottom: '0.2rem',
                        padding: '0.5rem',
                      }}
                      className="flex flex-col gap-1 px-6 z-20 w-full "
                    >
                      <Typography
                        style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
                        variant="beta"
                        textColor="neutral0"
                      >
                        {truncate(getCurrentAdTitle(activeAdIdx, formAds), 32)}
                      </Typography>
                      <Typography
                        style={{ fontSize: '10px', marginBottom: '0.4rem' }}
                        variant="pi"
                        textColor="neutral100"
                      >
                        {truncate(getCurrentAdDescription(activeAdIdx, formAds), 30)}
                      </Typography>
                      <Typography variant="pi" textColor="neutral0">
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
            </div>
          </Flex>
        </Flex>
      </form>
    </FormProvider>
  );
};

export default CampaignForm;
