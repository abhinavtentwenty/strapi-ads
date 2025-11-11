//@ts-nocheck
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Flex, Typography, Tag, IconButton } from '@strapi/design-system';
import { Cross, Trash, Pencil } from '@strapi/icons';
import { Controller, useFormContext } from 'react-hook-form';
import addImage from '../../../assets/addImage.png';

const FileUpload = ({ name, disabled }) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field: { value, onChange } }) => {
        const files = value || [];

        const onDrop = (acceptedFiles) => {
          if (disabled) return; // Prevent adding files if disabled
          onChange([...files, ...acceptedFiles]);
        };

        const handleRemoveFile = (removeIdx) => {
          if (disabled) return; // Prevent removing files if disabled
          onChange(files.filter((_, idx) => idx !== removeIdx));
        };

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
          onDrop,
          accept: { 'image/*': [] },
          multiple: true,
          disabled, // disables dropzone events
        });

        return (
          <Box>
            {/* Label */}
            <Typography variant="pi" fontWeight="bold" textColor="neutral800">
              Upload Image
            </Typography>
            {/* Upload Dropzone */}
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
                    : 'Click to select assets or drag and drop in this area'}
                </Typography>
              </Flex>
            </Box>
            {/* Uploaded Files Preview */}
            {files.length > 0 && (
              <Flex gap={2} marginTop={3} wrap="wrap">
                {files.map((file, idx) => (
                  <Box
                    padding={4}
                    marginTop={2}
                    borderColor="primary600"
                    hasRadius
                    background="neutral100"
                    style={{ border: '2px solid #dcdce4' }}
                    key={idx}
                  >
                    <div style={{ position: 'relative' }}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
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
                          onClick={() => handleRemoveFile(idx)}
                          disabled={disabled}
                        >
                          <Trash />
                        </IconButton>
                      </Flex>
                    </div>

                    <Typography style={{ fontSize: '12px' }} textColor="neutral600">
                      {file.name.length > 30 ? file.name.slice(0, 27) + '...' : file.name}
                    </Typography>
                  </Box>
                ))}
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
