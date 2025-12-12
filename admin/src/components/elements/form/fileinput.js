//@ts-nocheck
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Flex, Typography, IconButton } from '@strapi/design-system';
import { Trash } from '@strapi/icons';
import { Controller, useFormContext } from 'react-hook-form';
import addImage from '../../../assets/addImage.png';
import { validateImageSize } from '../../../config/adValidationRules';

const ALLOWED_IMAGE_FORMATS = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

const FileUpload = ({ name, disabled, adImageUrl, activeAdTypeId, adTypes, error }) => {
  const { control, setValue, watch, clearErrors } = useFormContext();
  const [imageError, setImageError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const imgUrl = watch(adImageUrl);

  // Get the ad type details to show required size
  const adType = adTypes?.find((type) => type.id === activeAdTypeId);
  const requiredSize = adType?.image_size;

  const validateAndSetImage = async (file) => {
    if (!file) return;

    // Check if ad type is selected
    if (!adType?.ad_type_id) {
      setImageError('Please select an ad type before uploading an image');
      return false;
    }

    // Check file format
    if (!Object.keys(ALLOWED_IMAGE_FORMATS).includes(file.type)) {
      setImageError('Only JPG, PNG, and WebP formats are allowed');
      return false;
    }

    setIsValidating(true);
    setImageError(null);

    // Validate image size with 5% aspect ratio tolerance
    const validation = await validateImageSize(file, adType, 0.05);
    setIsValidating(false);

    if (!validation.valid) {
      setImageError(validation.error);
      return false;
    }

    setImageError(null);
    return true;
  };

  // Determine which error to show (image validation error takes priority when user tries to upload)
  const displayError = imageError || error;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      render={({ field: { value, onChange } }) => {
        const file = value || null;

        const onDrop = async (acceptedFiles, rejectedFiles) => {
          if (disabled) return;

          // Handle rejected files (wrong format)
          if (rejectedFiles.length > 0) {
            const rejection = rejectedFiles[0];
            if (rejection.errors.some((e) => e.code === 'file-invalid-type')) {
              setImageError('Only JPG, PNG, and WebP formats are allowed');
            }
            return;
          }

          const selectedFile = acceptedFiles[0];
          if (!selectedFile) return;

          // Clear form validation error when user attempts upload
          clearErrors(name);

          const isValid = await validateAndSetImage(selectedFile);
          if (isValid) {
            onChange(selectedFile);
            setValue(adImageUrl, null);
          }
        };

        const handleRemoveFile = () => {
          if (disabled) return;
          onChange(null);
          setValue(adImageUrl, null);
          setImageError(null);
        };

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
          onDrop,
          accept: ALLOWED_IMAGE_FORMATS,
          multiple: false,
          disabled: disabled || !adType?.ad_type_id || isValidating,
        });

        const showDropzone = !file && !imgUrl;

        return (
          <Box>
            <Typography variant="pi" fontWeight="bold" textColor="neutral800">
              Upload Image*
              {requiredSize && (
                <span>
                  {' '}
                  (Minimum: {requiredSize.width}x{requiredSize.height}px, Aspect Ratio:{' '}
                  {(requiredSize.width / requiredSize.height).toFixed(2)})
                </span>
              )}
            </Typography>
            {showDropzone && (
              <Box
                padding={8}
                marginTop={2}
                borderColor="neutral200"
                hasRadius
                style={{
                  border: displayError ? '2px solid #d02b20' : '2px solid #dcdce4',
                  opacity: disabled || !adType?.ad_type_id ? 0.5 : 1,
                  pointerEvents: disabled || !adType?.ad_type_id || isValidating ? 'none' : 'auto',
                  background: disabled ? '#f6f6f9' : undefined,
                  cursor: disabled || !adType?.ad_type_id ? 'not-allowed' : 'pointer',
                }}
                background="neutral100"
                role="button"
                {...getRootProps()}
              >
                <input
                  {...getInputProps()}
                  disabled={disabled || !adType?.ad_type_id || isValidating}
                />
                <Flex direction="column" alignItems="center" justifyContent="center" gap={2}>
                  <img style={{ width: '30px' }} src={addImage} alt="Add" />
                  <Typography
                    textColor="neutral600"
                    variant="beta"
                    textAlign="center"
                    style={{ fontSize: '12px' }}
                  >
                    {isValidating
                      ? 'Validating image...'
                      : isDragActive
                        ? 'Drag and drop in this area.'
                        : 'Click to select an image or drag and drop here'}
                  </Typography>
                </Flex>
              </Box>
            )}
            {/* Show preview if a file is present */}
            {file && (
              <Flex gap={2} marginTop={3} wrap="wrap">
                <Box
                  padding={4}
                  marginTop={2}
                  borderColor="primary600"
                  hasRadius
                  background="neutral100"
                  style={{ border: '2px solid #dcdce4' }}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={
                        file instanceof File
                          ? URL.createObjectURL(file)
                          : typeof file === 'string'
                            ? file
                            : ''
                      }
                      alt={file.name || 'Ad Image'}
                      style={{
                        width: '159px',
                        height: '159px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                    <Flex gap="3" style={{ position: 'absolute', bottom: 5, right: 60 }}>
                      <IconButton
                        aria-label="Remove file"
                        onClick={handleRemoveFile}
                        disabled={disabled}
                      >
                        <Trash />
                      </IconButton>
                    </Flex>
                  </div>
                  <Typography style={{ fontSize: '12px' }} textColor="neutral600">
                    {file.name?.length > 30 ? file.name.slice(0, 27) + '...' : file.name || ''}
                  </Typography>
                </Box>
              </Flex>
            )}
            {/* Show preview if imgUrl is present and no file */}
            {!file && imgUrl && (
              <Flex gap={2} marginTop={3} wrap="wrap">
                <Box
                  padding={4}
                  marginTop={2}
                  borderColor="primary600"
                  hasRadius
                  background="neutral100"
                  style={{ border: '2px solid #dcdce4' }}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={imgUrl}
                      alt="Ad Image"
                      style={{
                        width: '159px',
                        height: '159px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                    <Flex gap="3" style={{ position: 'absolute', bottom: 5, right: 60 }}>
                      <IconButton
                        aria-label="Remove file"
                        onClick={handleRemoveFile}
                        disabled={disabled}
                      >
                        <Trash />
                      </IconButton>
                    </Flex>
                  </div>
                </Box>
              </Flex>
            )}
            <Box marginTop={1}>
              {displayError ? (
                <Typography variant="pi" textColor="danger600">
                  {displayError}
                </Typography>
              ) : !adType?.ad_type_id ? (
                <Typography variant="pi" textColor="danger600">
                  Please select an ad type first
                </Typography>
              ) : requiredSize ? (
                <Typography variant="pi" textColor="neutral500">
                  Accepted formats: <strong>JPG, PNG, WebP</strong>
                  <br />
                  Minimum image size:{' '}
                  <strong>
                    {requiredSize.width}px x {requiredSize.height}px
                  </strong>
                  <br />
                  Required aspect ratio:{' '}
                  <strong>{(requiredSize.width / requiredSize.height).toFixed(2)}</strong> (±5%
                  tolerance)
                </Typography>
              ) : (
                <Typography variant="pi" textColor="neutral500">
                  Please select an ad type to see image requirements
                </Typography>
              )}
            </Box>
          </Box>
        );
      }}
    />
  );
};

export default FileUpload;
