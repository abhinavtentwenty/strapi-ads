import React from 'react';
import { Textarea } from '@strapi/design-system';
import { useFormContext, Controller } from 'react-hook-form';

const FormTextArea = ({
  name,
  label = 'Label',
  placeholder = '',
  error,
  disabled = false,
  style,
  ...props
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Textarea
          {...field}
          label={label}
          name={name}
          placeholder={placeholder}
          error={error}
          disabled={disabled}
          style={{
            ...(style || {}),
            ...(disabled
              ? {
                  border: 'none !important',
                  boxShadow: 'none !important',
                  color: '#62627B',
                  cursor: 'not-allowed',
                }
              : {}),
          }}
          {...props}
        />
      )}
    />
  );
};

export default FormTextArea;
