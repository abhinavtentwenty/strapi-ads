import React from "react";
import { DatePicker } from "@strapi/design-system";
import { useFormContext, Controller } from "react-hook-form";

const FormDatePicker = ({
  name,
  label = "Label",
  error,
  disabled = false,
  locale = "en-GB",
  size = "M",
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <DatePicker
          {...field}
          label={label}
          name={name}
          error={error}
          locale={locale}
          size={size}
          disabled={disabled}
          onClear={() => field.onChange(undefined)}
        />
      )}
    />
  );
};

export default FormDatePicker;
