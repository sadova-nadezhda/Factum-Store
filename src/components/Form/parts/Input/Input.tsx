import React from 'react';
import { InputMask } from '@react-input/mask';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask?: string;
}

export default function Input({ mask, ...props }: InputProps) {
  if (mask) {
    return <InputMask mask={mask} replacement={{ _: /\d/ }} {...props} />;
  }

  return <input {...props} />;
}