import React from 'react';
import classNames from 'classnames';

type AsProp<C extends React.ElementType> = {
  as?: C;
  className?: string | undefined;
};

type PolymorphicProps<C extends React.ElementType, P> =
  P &
  AsProp<C> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof (P & AsProp<C>)>;

type TitleBaseProps = {
  children?: React.ReactNode;
};

const defaultTag = 'h1';

function Title<C extends React.ElementType = typeof defaultTag>(
  { as, className, children, ...rest }: PolymorphicProps<C, TitleBaseProps>,
) {
  const Component = (as ?? defaultTag) as React.ElementType;
  return (
    <Component className={classNames(className)} {...rest}>
      {children}
    </Component>
  );
}

export default Title;