import React from 'react';
import { useIdentity } from '../libs/netlify-identity-provider';

const Logout = () => {
  const { login } = useIdentity();

  return (
    <div>
      <button
        onClick={async () => {
          await login('aaron.moline@outlook.com', 'Foobar234$', true);
          window.location.assign('/');
        }}
      >
        Log in here.
      </button>
    </div>
  );
};

export default Logout;
