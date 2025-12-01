import React from 'react';
import { DatePicker } from '@strapi/design-system';
import { useFormContext, Controller } from 'react-hook-form';

const FormDatePicker = ({
  name,
  label = 'Label',
  error,
  disabled = false,
  locale = 'en-GB',
  size = 'M',
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <DatePicker
          label={label}
          // selectedDate={field.value}
          value={field.value}
          onChange={(date) => field.onChange(date)}
          error={error}
          locale={locale}
          size={size}
          disabled={disabled}
          onClear={() => field.onChange(null)}
        />
      )}
    />
  );
};

export default FormDatePicker;
