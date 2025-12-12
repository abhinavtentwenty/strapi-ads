//@ts-nocheck
import React from 'react';
import { TextInput } from '@strapi/design-system';
import { useFormContext, Controller } from 'react-hook-form';

const FormInput = ({
  name,
  label = '',
  placeholder = '',
  type = 'text',
  error,
  disabled = false,
  ariaLabel = 'text-input',
  style,
  ...props
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextInput
          {...field}
          aria-label={ariaLabel}
          label={label}
          name={name}
          placeholder={placeholder}
          type={type}
          error={error}
          style={{
            ...(style || {}),
            ...(disabled
              ? {
                  border: 'none !important',
                  boxShadow: 'none !important',
                  color: '#62627B',
                }
              : {}),
          }}
          disabled={disabled}
          {...props}
        />
      )}
    />
  );
};

export default FormInput;
