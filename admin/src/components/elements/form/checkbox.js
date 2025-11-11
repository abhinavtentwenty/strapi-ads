import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Checkbox } from '@strapi/design-system';

const FormCheckbox = ({ name, label = '', disabled = false }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false}
      render={({ field }) => (
        <Checkbox checked={field.value} onChange={field.onChange} disabled={disabled}>
          {label}
        </Checkbox>
      )}
    />
  );
};

export default FormCheckbox;
