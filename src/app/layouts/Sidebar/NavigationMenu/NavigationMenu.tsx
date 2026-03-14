import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import { cn } from '#/shared/lib/bem';

import { getMenuItems } from './helpers';

import './NavigationMenu.scss';

const cnNavMenu = cn('NavigationMenu');

export const NavigationMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = getMenuItems();

  return (
    <List className={cnNavMenu()}>
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <ListItem key={item.text} disablePadding className={cnNavMenu('ItemWrapper')}>
            <ListItemButton
              selected={isActive}
              onClick={() => navigate(item.path)}
              className={cnNavMenu('Item', { selected: isActive })}
            >
              <ListItemIcon className={cnNavMenu('ItemIcon')}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} className={cnNavMenu('ItemText')} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};
