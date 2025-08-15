import React, { JSX } from 'react';
import classNames from 'classnames';

import BaseTitle from './BaseTitle';

type TitleProps = React.ComponentPropsWithoutRef<'h1'> & {
  component?: keyof JSX.IntrinsicElements;
  className?: string;
};

const Title: React.FC<TitleProps> = ({ className, component: Component = 'h1', ...props }) => {
  return (
    <BaseTitle
      component={Component}
      className={classNames(className)}
      {...props}
    />
  );
};

export default Title;