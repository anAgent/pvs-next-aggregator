import './unauthenticated-routes.module.scss';
import React from 'react';
import { useIdentity } from '../netlify-identity-provider/identity-context';

export const UnauthenticatedRoutes: React.FC = ({ children }) => {
  const { user } = useIdentity();

  if (user === null) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return null;
};

export default UnauthenticatedRoutes;
