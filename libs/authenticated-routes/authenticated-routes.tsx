import React from 'react';

import { useIdentity } from '../netlify-identity-provider/identity-context';
import { getChildrenOrFunction } from './utilities';

/* eslint-disable-next-line */
export interface AuthenticatedRoutesProps {}

export const AuthenticatedRoutes: React.FC<AuthenticatedRoutesProps> = ({
  children,
}) => {
  const identity = useIdentity();

  if (identity.user !== null) {
    return (
      <React.Fragment>
        {getChildrenOrFunction(children, identity)}
      </React.Fragment>
    );
  }

  return null;
};

export default AuthenticatedRoutes;
