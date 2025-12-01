// @ts-nocheck
import { z } from 'zod';

export const AdSchema = z
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
    ad_spot: z.number().optional(),
    ad_status: z.string().optional(),
    ad_screens: z.array(z.number()).optional(),
    ad_headline: z.string().min(1, 'Headline is required'),
    ad_external_url: z.preprocess(
      (val) => (val === '' ? undefined : val),
      z.string().url('Must be a valid URL').optional().nullable()
    ),
    ad_description: z.string().min(1, 'Description is required'),
    ad_image: z.any().optional(),
    is_external: z.string().optional(),
    ad_video_url: z.string().url('Must be a valid URL').optional().nullable(),
  })
  .refine((ad) => !ad.ad_end_date || ad.ad_end_date > ad.ad_start_date, {
    message: 'End date must be after start date',
    path: ['ad_end_date'],
  });

export const CampaignSchema = z.object({
  campaign_id: z.string().optional(),
  campaign_name: z.string().min(1, 'Campaign name is required'),
  campaign_entity_type: z.enum(['adgm_entity', 'external_entity']),
  campaign_entity_name: z.string().min(1, 'Entity name is required'),
  campaign_entity_license_number: z.string().optional(),
  ads: z.array(AdSchema).min(1, 'At least one ad is required'),
});
