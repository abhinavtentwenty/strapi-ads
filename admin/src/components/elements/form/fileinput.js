//@ts-nocheck
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Flex, Typography, IconButton } from '@strapi/design-system';
import { Trash, Pencil } from '@strapi/icons';
import { Controller, useFormContext } from 'react-hook-form';
import addImage from '../../../assets/addImage.png';

const FileUpload = ({ name, disabled, adImageUrl }) => {
  const { control, setValue, watch } = useFormContext();

  const imgUrl = watch(adImageUrl);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null}
      render={({ field: { value, onChange } }) => {
        const file = value || null;

        const onDrop = (acceptedFiles) => {
          if (disabled) return;
          onChange(acceptedFiles[0]);
          setValue(adImageUrl, null);
        };

        const handleRemoveFile = () => {
          if (disabled) return;
          onChange(null);
          setValue(adImageUrl, null);
        };

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
          onDrop,
          accept: { 'image/*': [] },
          multiple: false,
          disabled,
        });

        const showDropzone = !file && !imgUrl;

        return (
          <Box>
            <Typography variant="pi" fontWeight="bold" textColor="neutral800">
              Upload Image
            </Typography>
            {showDropzone && (
              <Box
                padding={8}
                marginTop={2}
                borderColor="neutral200"
                hasRadius
                style={{
                  border: '2px solid #dcdce4',
                  opacity: disabled ? 0.5 : 1,
                  pointerEvents: disabled ? 'none' : 'auto',
                  background: disabled ? '#f6f6f9' : undefined,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                }}
                background="neutral100"
                role="button"
                {...getRootProps()}
              >
                <input {...getInputProps()} disabled={disabled} />
                <Flex direction="column" alignItems="center" justifyContent="center" gap={2}>
                  <img style={{ width: '30px' }} src={addImage} alt="Add" />
                  <Typography
                    textColor="neutral600"
                    variant="beta"
                    textAlign="center"
                    style={{ fontSize: '12px' }}
                  >
                    {isDragActive
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
                    <Flex gap="3" style={{ position: 'absolute', bottom: 5, right: 40 }}>
                      <IconButton aria-label="Edit file" disabled={disabled}>
                        <Pencil />
                      </IconButton>
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
                    <Flex gap="3" style={{ position: 'absolute', bottom: 5, right: 40 }}>
                      <IconButton aria-label="Edit file" disabled={disabled}>
                        <Pencil />
                      </IconButton>
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
              <Typography variant="pi" textColor="neutral500">
                Recommended size for <strong>“Native Card Small”</strong> Ad is{' '}
                <strong>375px x 600px</strong>, or an image with ratio <strong>9:16</strong>
              </Typography>
            </Box>
          </Box>
        );
      }}
    />
  );
};

export default FileUpload;
