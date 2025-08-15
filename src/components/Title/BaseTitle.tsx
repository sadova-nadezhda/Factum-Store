import React, { createElement, CSSProperties, JSX } from 'react';

type BaseTitleProps = {
  component?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
} & React.HTMLAttributes<HTMLElement>;

const BaseTitle: React.FC<BaseTitleProps> = ({
  component = 'h1',
  children,
  className,
  style,
  ...props
}) => {
  return createElement(component, { className, style, ...props }, children);
};

export default BaseTitle;