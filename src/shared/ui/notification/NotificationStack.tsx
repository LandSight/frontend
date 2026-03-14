import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useAction, useAtom } from '@reatom/react';

import { cn } from '#/shared/lib/bem';

import { notificationsAtom, removeNotification } from './models/notifications';

import './NotificationStack.scss';

const cnNotificationStack = cn('NotificationStack');

export const NotificationStack = () => {
  const [notifications] = useAtom(notificationsAtom);
  const handleClose = useAction((id: number) => removeNotification(id));

  if (!notifications.length) return null;

  return (
    <div className={cnNotificationStack()}>
      {[notifications[notifications.length - 1]].map(
        ({ id, message, severity, duration = 6000 }) => (
          <Snackbar
            key={id}
            open={true}
            autoHideDuration={duration}
            onClose={() => handleClose(id)}
            className={cnNotificationStack('Snackbar')}
          >
            <Alert onClose={() => handleClose(id)} severity={severity} sx={{ width: '100%' }}>
              {message}
            </Alert>
          </Snackbar>
        )
      )}
    </div>
  );
};
