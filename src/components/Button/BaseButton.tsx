import React, { createElement } from 'react';
import type { ElementType, ComponentPropsWithoutRef } from 'react';

interface BaseButtonProps<T extends ElementType = 'button'> {
  component?: T;
  className?: string | undefined;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const BaseButton = React.forwardRef(function BaseButtonInner<
  T extends ElementType = 'button'
>(
  {
    component,
    children,
    className,
    style,
    ...props
  }: BaseButtonProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof BaseButtonProps<T>>,
  ref: React.Ref<Element>
) {
  const Component = component || 'button';
  return createElement(Component as any, { className, style, ref, ...props }, children);
}) as <T extends ElementType = 'button'>(
  p: BaseButtonProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof BaseButtonProps<T>> & { ref?: React.Ref<Element> }
) => React.ReactElement | null;

export default BaseButton;