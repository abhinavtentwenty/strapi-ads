import React from 'react';
import { DatePicker } from '@strapi/design-system';
import { useFormContext, Controller } from 'react-hook-form';

// Converts a date string or JS Date to UTC midnight
const toUTCDate = (value) => {
  if (!value) return null;

  const d = new Date(value);
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
};

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
      render={({ field }) => {
        const utcDate = toUTCDate(field.value);

        return (
          <DatePicker
            label={label}
            selectedDate={utcDate} // always pass UTC-normalized date
            onChange={(date) => {
              // convert the selected date back to UTC before storing in form
              const next = date ? toUTCDate(date) : null;
              field.onChange(next);
            }}
            error={error}
            locale={locale}
            size={size}
            disabled={disabled}
            onClear={() => field.onChange(null)}
          />
        );
      }}
    />
  );
};

export default FormDatePicker;
