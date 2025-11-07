// src/guards/RouteGuards.jsx

export const HasRole = (user, roles = []) => {
  return roles.includes(user?.role);
};

export const Can = (user, conditionFn) => {
  if (!user) return false;
  return conditionFn(user);
};
