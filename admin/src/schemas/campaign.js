// @ts-nocheck
import { z } from 'zod';
import { getAdValidationRules, areScreensValid } from '../config/adValidationRules';

export const buildAdSchema = (adTypes) =>
  z
    .object({
      id: z.number().optional(),
      ad_name: z.string().min(1, 'Ad name is required'),
      ad_start_date: z.preprocess(
        (val) => (val ? new Date(val) : undefined),
        z.date({ required_error: 'Start date is required' })
      ),
      ad_end_date: z.preprocess((val) => (val ? new Date(val) : undefined), z.date().optional()),
      ad_type: z.number().min(1, 'Ad type is required'),
      ad_destination_page: z.string().optional().nullable(),
      ad_destination_models: z.string().optional(),
      ad_spot: z.number().optional().nullable(),
      ad_status: z.string().optional(),
      ad_cta_name: z.string().optional(),
      ad_screens: z.array(z.number()).optional(),
      ad_headline: z.string().min(1, 'Headline is required'),
      ad_external_url: z.preprocess(
        (val) => (val === '' ? undefined : val),
        z.string().url('Must be a valid URL').optional().nullable()
      ),
      ad_description: z.string().min(1, 'Description is required'),
      ad_image: z.any().optional(),
      ad_image_url: z.string().optional().nullable(),
      is_external: z.string().optional(),
      ad_video_url: z.string().url('Must be a valid URL').optional().nullable(),
    })
    .refine((ad) => !ad.ad_end_date || ad.ad_end_date > ad.ad_start_date, {
      message: 'End date must be after start date',
      path: ['ad_end_date'],
    })
    .refine(
      (ad) => {
        const adType = adTypes.find((type) => type.id === ad.ad_type);
        if (adType && Array.isArray(adType.ad_spots) && adType.ad_spots.length > 0) {
          return !!ad.ad_spot;
        }
        return true;
      },
      {
        message: 'Ad spot is required for this ad type',
        path: ['ad_spot'],
      }
    )
    .superRefine((ad, ctx) => {
      // Get ad type and spot details
      const adType = adTypes.find((type) => type.id === ad.ad_type);
      const adSpot = adType?.ad_spots?.find((spot) => spot.id === ad.ad_spot);

      if (!adType || !adSpot) return;

      // Get all available screens
      const allScreens = adSpot.ad_screens || [];

      // Validate CTA name for sticky-ad
      if (adType.ad_type_id === 'sticky-ad') {
        if (!ad.ad_cta_name || ad.ad_cta_name.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'CTA name is required for Sticky Ad',
            path: ['ad_cta_name'],
          });
        }
      }

      // Validate ad screens (if spot has screens, at least one must be selected)
      if (adSpot.ad_screens && adSpot.ad_screens.length > 0) {
        if (!ad.ad_screens || ad.ad_screens.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'At least one screen must be selected for this ad spot',
            path: ['ad_screens'],
          });
          return;
        }

        // Validate if selected screens are valid for this ad type and spot
        const screensValid = areScreensValid(
          adType.ad_type_id,
          adSpot.ad_spot_id,
          ad.ad_screens,
          allScreens
        );

        if (!screensValid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Selected screens are not valid for this ad type and spot combination',
            path: ['ad_screens'],
          });
          return;
        }
      }

      // Get validation rules from config (now including screens)
      const rules = getAdValidationRules(
        adType.ad_type_id,
        adType.image_size,
        adSpot.ad_spot_id,
        ad.ad_screens || [],
        allScreens
      );

      // Validate headline length
      if (ad.ad_headline && ad.ad_headline.length > rules.titleMax) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Headline must be ${rules.titleMax} characters or less for this ad configuration`,
          path: ['ad_headline'],
        });
      }

      // Validate description length
      if (ad.ad_description && ad.ad_description.length > rules.descMax) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Description must be ${rules.descMax} characters or less for this ad configuration`,
          path: ['ad_description'],
        });
      }

      // Validate video URL if not allowed
      if (!rules.videoAllowed && ad.ad_video_url) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Video is not allowed for this ad configuration',
          path: ['ad_video_url'],
        });
      }

      // Validate external/internal destination
      if (ad.is_external === 'yes') {
        if (!ad.ad_external_url || ad.ad_external_url.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'External URL is required when ad is external',
            path: ['ad_external_url'],
          });
        }
      }
      if (ad.is_external === 'no') {
        if (!ad.ad_destination_page) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Destination page is required when ad is internal',
            path: ['ad_destination_page'],
          });
        }
        if (!ad.ad_destination_models) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Destination model is required when ad is internal',
            path: ['ad_destination_models'],
          });
        }
      }

      // Validate image is present (only required if no image URL exists)
      if (!ad.ad_image && (!ad.ad_image_url || ad.ad_image_url.trim() === '')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Image is required',
          path: ['ad_image'],
        });
      }
    });

export const buildCampaignSchema = (adTypes) =>
  z
    .object({
      campaign_id: z.string().optional(),
      campaign_name: z.string().min(1, 'Campaign name is required'),
      campaign_entity_type: z.enum(['adgm_entity', 'external_entity']),
      campaign_entity_name: z.string().min(1, 'Entity name is required'),
      campaign_entity_license_number: z.string().optional(),
      ads: z.array(buildAdSchema(adTypes)).optional(),
    })
    .refine(
      (campaign) => {
        if (campaign.campaign_entity_type === 'adgm_entity') {
          return (
            campaign.campaign_entity_license_number &&
            campaign.campaign_entity_license_number.trim() !== ''
          );
        }
        return true;
      },
      {
        message: 'License number is required for ADGM Entity',
        path: ['campaign_entity_license_number'],
      }
    );
