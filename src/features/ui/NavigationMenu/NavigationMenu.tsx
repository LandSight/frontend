import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MapIcon from '@mui/icons-material/Map';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import { cn } from '../../../shared/lib/bem';

import './NavigationMenu.scss';

const menuItems = [
  { text: 'Карта', icon: <MapIcon />, path: '/map' },
  { text: 'Анализы', icon: <AssessmentIcon />, path: '/analyses' },
];

const cnNavMenu = cn('NavigationMenu');

export const NavigationMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <List className={cnNavMenu()}>
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <ListItem key={item.text} disablePadding className={cnNavMenu('ItemWrapper')}>
            <ListItemButton
              selected={isActive}
              onClick={() => navigate(item.path)}
              className={cnNavMenu('Item', { active: isActive })}
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
