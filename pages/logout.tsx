import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { useRouter } from 'next/router';

const Logout = () => {
  const router = useRouter();
  return (
    <div className="container">
      <Card>
        <Card.Header>Logged out</Card.Header>
        <Card.Body>
          <Button variant="primary" onClick={() => router.push('/')}>
            Click here to login
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Logout;
