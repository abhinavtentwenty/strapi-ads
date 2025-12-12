// @ts-nocheck

export const AD_VALIDATION_RULES = {
  // Home Carousel
  'home-carousel': {
    spots: {
      home: {
        titleMax: 24,
        descMax: 45,
        videoAllowed: true,
        requiredScreens: [],
      },
      'business-home': {
        titleMax: 24,
        descMax: 45,
        videoAllowed: true,
        requiredScreens: [],
      },
      'lifestyle-home': {
        titleMax: 24,
        descMax: 45,
        videoAllowed: true,
        requiredScreens: [],
      },
    },
  },

  // Widget Banner
  'widget-banner': {
    spots: {
      home: {
        titleMax: 12,
        descMax: 24,
        videoAllowed: false,
        requiredScreens: [],
      },
      'business-details': {
        titleMax: 12,
        descMax: 24,
        videoAllowed: false,
        requiredScreens: ['directory', 'events', 'news', 'offers'],
      },
      'lifestyle-details': {
        titleMax: 12,
        descMax: 24,
        videoAllowed: false,
        requiredScreens: ['events', 'offers', 'shop', 'dine', 'fashion'],
      },
    },
  },

  // Sticky Ad
  'sticky-ad': {
    spots: {
      'business-listing': {
        titleMax: 34,
        descMax: 75,
        videoAllowed: false,
        requiredScreens: ['directory', 'news', 'events', 'offers'],
      },
      'lifestyle-listing': {
        titleMax: 34,
        descMax: 75,
        videoAllowed: false,
        requiredScreens: ['events', 'offers', 'shop', 'dine', 'fashion'],
      },
    },
  },

  // Listing Banner
  'listing-banner': {
    spots: {
      'business-listing': {
        titleMax: 20,
        descMax: 24,
        videoAllowed: false,
        requiredScreens: ['directory', 'news', 'events', 'offers'],
      },
      'lifestyle-listing': {
        titleMax: 20,
        descMax: 24,
        videoAllowed: false,
        requiredScreens: ['events', 'offers', 'shop', 'dine', 'fashion'],
      },
    },
  },
};

/**
 * Default validation rules when no specific rule is found
 */
export const DEFAULT_VALIDATION_RULES = {
  titleMax: 60,
  descMax: 150,
  videoAllowed: false,
  requiredScreens: [],
};

export const validateImageSize = (file, adType, aspectTolerance = 0.05) => {
  return new Promise((resolve) => {
    if (!file) {
      resolve({ valid: false, error: 'No file provided', dimensions: null });
      return;
    }

    const requiredSize = adType?.image_size;

    if (!requiredSize) {
      resolve({ valid: false, error: 'Image size requirements not found', dimensions: null });
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const actualWidth = img.width;
      const actualHeight = img.height;
      const requiredWidth = requiredSize.width;
      const requiredHeight = requiredSize.height;

      // Calculate aspect ratios
      const requiredAspectRatio = requiredWidth / requiredHeight;
      const actualAspectRatio = actualWidth / actualHeight;

      // Check if aspect ratio is within tolerance
      const aspectRatioDifference = Math.abs(actualAspectRatio - requiredAspectRatio);
      const isAspectRatioValid = aspectRatioDifference <= aspectTolerance;

      // Check minimum dimensions (image should be at least as large as required)
      const meetsMinimumWidth = actualWidth >= requiredWidth;
      const meetsMinimumHeight = actualHeight >= requiredHeight;

      const isValid = isAspectRatioValid && meetsMinimumWidth && meetsMinimumHeight;

      let errorMessage = null;
      if (!isValid) {
        if (!meetsMinimumWidth || !meetsMinimumHeight) {
          errorMessage = `Image dimensions too small. Minimum required: ${requiredWidth}x${requiredHeight}px. Current: ${actualWidth}x${actualHeight}px`;
        } else if (!isAspectRatioValid) {
          errorMessage = `Invalid aspect ratio. Required ratio: ${requiredWidth}:${requiredHeight} (${requiredAspectRatio.toFixed(2)}). Current: ${actualWidth}:${actualHeight} (${actualAspectRatio.toFixed(2)})`;
        }
      }

      resolve({
        valid: isValid,
        error: errorMessage,
        dimensions: { width: actualWidth, height: actualHeight },
        required: requiredSize,
        aspectRatio: {
          required: requiredAspectRatio,
          actual: actualAspectRatio,
          difference: aspectRatioDifference,
        },
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        valid: false,
        error: 'Failed to load image',
        dimensions: null,
        required: requiredSize,
      });
    };

    img.src = objectUrl;
  });
};

export const getAdValidationRules = (
  adTypeId,
  adTypeImageSize,
  adSpotId,
  adScreenIds = [],
  allScreens = [],
  adTypes = []
) => {
  if (!adTypeId || !adSpotId) {
    return DEFAULT_VALIDATION_RULES;
  }

  const adType = AD_VALIDATION_RULES[adTypeId];
  if (!adType) {
    return DEFAULT_VALIDATION_RULES;
  }

  const spot = adType.spots[adSpotId];
  if (!spot) {
    return DEFAULT_VALIDATION_RULES;
  }

  // If no screens are required for this spot (like home-carousel), return spot rules
  if (!spot.requiredScreens || spot.requiredScreens.length === 0) {
    return { ...spot, imageSize: adTypeImageSize };
  }

  // If screens are required but none selected, return spot rules (validation will fail in Zod)
  if (!adScreenIds || adScreenIds.length === 0) {
    return { ...spot, imageSize: adTypeImageSize };
  }

  // Check if any selected screen matches the required screens
  const selectedScreenIds = adScreenIds
    .map((id) => {
      const screen = allScreens.find((s) => s.id === id);
      return screen?.ad_screen_id;
    })
    .filter(Boolean);

  const hasValidScreen = selectedScreenIds.some((screenId) =>
    spot.requiredScreens.includes(screenId)
  );

  // If at least one valid screen is selected, return the spot rules
  if (hasValidScreen) {
    return { ...spot, imageSize: adTypeImageSize };
  }

  // If no valid screens selected, return default
  return DEFAULT_VALIDATION_RULES;
};

export const areScreensValid = (adTypeId, adSpotId, adScreenIds = [], allScreens = []) => {
  if (!adTypeId || !adSpotId) return true;

  const adType = AD_VALIDATION_RULES[adTypeId];
  if (!adType) return true;

  const spot = adType.spots[adSpotId];
  if (!spot) return true;

  // If no screens required, it's valid
  if (!spot.requiredScreens || spot.requiredScreens.length === 0) {
    return true;
  }

  // If screens required but none selected
  if (!adScreenIds || adScreenIds.length === 0) {
    return false;
  }

  // Check if at least one selected screen is valid
  const selectedScreenIds = adScreenIds
    .map((id) => {
      const screen = allScreens.find((s) => s.id === id);
      return screen?.ad_screen_id;
    })
    .filter(Boolean);

  return selectedScreenIds.some((screenId) => spot.requiredScreens.includes(screenId));
};
