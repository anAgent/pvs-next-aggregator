import GoTrue, { User } from 'gotrue-js';
import React, { useState } from 'react';
import { IdentityContextState } from './constants';
import { getTokenExpiration, IdentityContext } from './identity-context';
import { toast, ToastContainer } from 'react-toastify';

export interface NetlifyIdentityProviderProps {
  identity: GoTrue;
}

const buildIdentityContext = (
  identity: GoTrue,
  status: (inProgress: boolean) => void
) => {
  const expiresIn = getTokenExpiration(
    identity.currentUser()?.token?.expires_at
  );

  const userIdentity: IdentityContextState = {
    user: identity.currentUser() as User,
    confirm: (token: string, remember?: boolean): Promise<User> => {
      return identity.confirm(token, remember);
    },
    login: async (
      username: string,
      password: string,
      rememberMe: boolean
    ): Promise<User> => {
      status(true);
      return await identity
        .login(username, password, rememberMe)
        .then((user) => {
          status(false);
          window.location.assign('/');
          return user;
        });
    },
    signup: async (
      email: string,
      password: string,
      data?: { fullName: string }
    ) => {
      status(true);
      const user = await identity.signup(email, password, data);
      status(false);
      return user;
    },
    verify: async (
      type: string,
      token: string,
      remember?: boolean
    ): Promise<User> => {
      status(true);
      const user = await identity.verify(type, token, remember);
      status(false);
      return user;
    },
    acceptInvite: async (
      token: string,
      password: string,
      remember?: boolean
    ) => {
      status(true);
      const user = await identity.acceptInvite(token, password, remember);
      status(false);
      return user;
    },
    inProgress: true,
    tokenExpired: expiresIn < 5,
    expiresIn,
  };

  return userIdentity;
};

export const NetlifyIdentityProvider: React.FC<NetlifyIdentityProviderProps> = ({
  children,
  identity,
}): React.ReactElement => {
  const user = identity.currentUser();
  const [timeoutId, setTimeoutId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const userIdentity = buildIdentityContext(identity, (inProgress) =>
    setLoading(inProgress)
  );

  const warningToast = (message: string) =>
    toast(message, {
      autoClose: false,
      position: 'top-center',
      onClick: async () => {
        if (user) {
          await user.jwt(true).catch((e) => {
            // Log error
            console.error(e.message);
            user.logout();
          });
        }
        return true;
      },
    });

  React.useEffect(() => {
    if (user === null) {
      if (window.location.hash.indexOf('invite_token') > -1) {
        window.location.assign(`/confirm${window.location.hash}`);
      }
    }
  }, []);

  React.useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const timeout = (userIdentity.expiresIn - 1) * 60 * 1000;

    console.log(`Setting timout for ${timeout} milliseconds`);

    if (timeout > 0) {
      const id = setTimeout(() => {
        if (user?.logout) {
          user.logout().then(() => (window.location.href = '/'));
        }
      }, timeout);

      // @ts-ignore
      setTimeoutId(id);
    }
  }, [userIdentity.expiresIn]);

  React.useEffect(() => {
    // If the token will expire in less then 2 minutes, then set a timer to logout.
    if (user && userIdentity.expiresIn <= 1) {
      warningToast(`Token Expires in ${userIdentity.expiresIn} minutes`);
    }
  }, [userIdentity.expiresIn]);

  userIdentity.inProgress = loading;

  return (
    <IdentityContext.Provider value={userIdentity}>
      {children}
      <ToastContainer />
    </IdentityContext.Provider>
  );
};

export default NetlifyIdentityProvider;
