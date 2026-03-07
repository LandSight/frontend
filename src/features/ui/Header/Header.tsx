import React from 'react';

import { cn } from '../../../shared/lib/bem';

import './Header.scss';

const cnHeader = cn('Header');

export const Header: React.FC = () => {
  return (
    <header className={cnHeader()}>
      <div className={cnHeader('Logo')}>
        <img src="/logo.png" alt="LandSight Logo" className={cnHeader('Image')} />
      </div>
      <div className={cnHeader('Title')}>LandSight</div>
    </header>
  );
};
