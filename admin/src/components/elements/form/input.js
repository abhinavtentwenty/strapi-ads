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
          disabled={disabled}
          {...props}
        />
      )}
    />
  );
};

export default FormInput;
