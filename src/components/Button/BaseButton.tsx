import { createElement, ElementType, ComponentPropsWithoutRef } from 'react';

interface BaseButtonProps<T extends ElementType = 'button'> {
  component?: T;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const BaseButton = <T extends ElementType = 'button'>({
  component,
  children,
  className,
  style,
  ...props
}: BaseButtonProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof BaseButtonProps<T>>) => {
  const Component = component || 'button';
  return createElement(Component, { className, style, ...props }, children);
};

export default BaseButton;
