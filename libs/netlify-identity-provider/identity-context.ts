import React, { createContext } from 'react';
import { IdentityContextState } from './constants';
import moment from 'moment';
import { User } from 'gotrue-js';

const defaultIdentityContext: IdentityContextState = {
  login: (username: string, password: string, rememberMe: boolean) =>
    Promise.resolve((null as unknown) as User),
  user: (undefined as unknown) as User,
  confirm: (token: string, remember?: boolean) =>
    Promise.resolve((null as unknown) as User),
  acceptInvite: (token: string, password: string, remember?: boolean) =>
    Promise.resolve((null as unknown) as User),
  verify: (type: string, token: string, remember?: boolean): Promise<User> =>
    Promise.resolve((null as unknown) as User),
  signup: (email: string, password: string, data?: any): Promise<User> =>
    Promise.resolve((null as unknown) as User),
  inProgress: true,
  tokenExpired: true,
  expiresIn: 0,
};

export const IdentityContext = createContext<IdentityContextState>(
  defaultIdentityContext
);

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
  const expiresIn = getTokenExpiration(context.user?.token?.expires_at || 0);
  const [inProgress, setInProgress] = React.useState<boolean>(
    context.inProgress
  );
  const tokenExpired = expiresIn < 5;

  React.useEffect(() => {
    // TODO: When the value is a negative value, we should force logout the user with a timer.
    // const status = `Expires in {${expiresIn}} minutes`;
    // console.debug(status);
    if (expiresIn < 2 && expiresIn > 0) {
      setInProgress(true);
      // this will fire when the expire is less than 2, but great than 0;
      context.user
        .jwt(true)
        .catch((e) => {
          console.error('error logout!', e.message);
          context.user.logout().finally(() => (window.location.href = '/'));
        })
        .finally(() => setInProgress(false));
    }
  }, [expiresIn]);

  return {
    ...context,
    inProgress,
    tokenExpired,
    expiresIn,
  };
};
