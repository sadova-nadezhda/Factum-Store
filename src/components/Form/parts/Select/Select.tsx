import React from 'react';

export default function Select({ options, value, onChange, ...props }) {
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
