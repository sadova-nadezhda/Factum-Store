import React from 'react';

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: SelectOption[];
};

export default function Select({ options, value, onChange, ...props }: SelectProps) {
  return (
    <select value={value} onChange={onChange} {...props}>
      {options.map(({ value, label, disabled }) => (
        <option key={value} value={value} disabled={disabled || false}>
          {label}
        </option>
      ))}
    </select>
  );
}
