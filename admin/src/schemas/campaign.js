import { z } from 'zod';

export const AdSchema = z.object({
  name: z.string().min(1, 'Ad name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  adType: z.string().min(1, 'Ad type is required'),
  adSpot: z.string().optional(),
  screens: z.array(z.string()).optional(),
  headline: z.string().min(1, 'Headline is required'),
  destinationUrl: z.string().url('Must be a valid URL'),
  description: z.string().min(1, 'Description is required'),
  files: z.array(z.any()).optional(),
  videoUrl: z.string().url('Must be a valid URL').optional(),
});

export const CampaignSchema = z.object({
  campaignName: z.string().min(1, 'Campaign name is required'),
  companyRegisteredAs: z.enum(['adgm', 'external']),
  entityName: z.string().min(1, 'Entity name is required'),
  licence: z.string().optional(),
  ads: z.array(AdSchema).min(1, 'At least one ad is required'),
});
