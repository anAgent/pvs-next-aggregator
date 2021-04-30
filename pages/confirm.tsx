import React from 'react';
import LoginForm from '../components/LoginForm';
import { useRouter } from 'next/router';

const Confirm = () => {
  const router = useRouter();
  const inviteToken = router.asPath.split('=')[1];

  return (
    <div className="container text-center">
      <LoginForm inviteToken={inviteToken} />;
    </div>
  );
};

export default Confirm;
