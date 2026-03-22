import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { wrap } from '@reatom/core';

import { routesConfig } from '#/app/routes/routesConfig';
import { cn } from '#/shared/lib/bem';

import './NavigationMenu.scss';

const cnNavMenu = cn('NavigationMenu');

export const NavigationMenu = () => {
  const menuItems = Object.values(routesConfig).filter((r) => r.showInMenu);

  return (
    <List className={cnNavMenu()}>
      {menuItems.map(({ text, icon, route, exact }) => {
        const isActive = exact ? route.exact() : route();

        return (
          <ListItem key={text} disablePadding className={cnNavMenu('ItemWrapper')}>
            <ListItemButton
              selected={!!isActive}
              onClick={wrap(() => route.go())}
              className={cnNavMenu('Item', { selected: !!isActive })}
            >
              <ListItemIcon className={cnNavMenu('ItemIcon')}>{icon}</ListItemIcon>
              <ListItemText primary={text} className={cnNavMenu('ItemText')} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};
