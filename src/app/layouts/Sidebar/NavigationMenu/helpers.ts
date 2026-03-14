import { routes } from '#/app/routes/RouteConfig';

export const getMenuItems = () =>
  routes
    .filter((route) => route.showInMenu)
    .map(({ path, icon, text, name }) => ({
      path,
      icon,
      text: text || name,
    }));
