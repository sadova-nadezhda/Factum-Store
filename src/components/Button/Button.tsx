import classNames from 'classnames';
import BaseButton from './BaseButton';
import { ElementType, ComponentPropsWithoutRef } from 'react';

interface ButtonProps<T extends ElementType = 'button'> {
  component?: T;
  className?: string;
}

const Button = <T extends ElementType = 'button'>({
  className,
  component,
  ...props
}: ButtonProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>) => {
  const Component = component || 'button';
  return (
    <BaseButton
      component={Component}
      className={className}
      {...props}
    />
  );
};

export default Button;