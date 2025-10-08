import React, { forwardRef } from 'react';
import BaseButton from './BaseButton';
import type { ElementType, ComponentPropsWithoutRef } from 'react';

interface ButtonProps<T extends ElementType = 'button'> {
  component?: T;
  className?: string | undefined;
}

const Button = forwardRef(function ButtonInner<
  T extends ElementType = 'button'
>(
  {
    className,
    component,
    ...props
  }: ButtonProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>,
  ref: React.Ref<Element>
) {
  const Component = (component ?? 'button') as React.ElementType;

  // если это <button> и тип не задан — добавляем type="button"
  const maybeType =
    Component === 'button' && (props as any).type == null
      ? { type: 'button' as const }
      : null;

  return (
    <BaseButton
      ref={ref as any}
      component={Component}
      className={className}
      {...maybeType}
      {...props}
    />
  );
}) as <T extends ElementType = 'button'>(
  p: ButtonProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ButtonProps<T>> & { ref?: React.Ref<Element> }
) => React.ReactElement | null;

export default Button;