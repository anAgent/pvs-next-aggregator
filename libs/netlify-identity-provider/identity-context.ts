import React, { createContext } from 'react';
import { IdentityContextState } from './constants';
import moment from 'moment';

export const IdentityContext = createContext<IdentityContextState | null>(null);

export const getTokenExpiration = (expires_at?: number): number => {
  if (!expires_at) {
    return 0;
  }

  const now = moment();
  const tokenDate = moment(expires_at);
  return tokenDate.diff(now, 'minutes');
};

export const useIdentity = (): IdentityContextState => {
  const context = React.useContext(IdentityContext);

  if (context == null) {
    throw new Error('useIdentity must be within provider.');
  }

  return {
    ...context,
  };
};
