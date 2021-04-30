import Head from 'next/head';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthenticatedRoutes from '../libs/authenticated-routes/authenticated-routes';
import UnauthenticatedRoutes from '../libs/unauthenticated-routes/unauthenticated-routes';
import { useIdentity } from '../libs/netlify-identity-provider';
import { UiFileInputButton } from '../components/UiFileInputButton';

import axios, { AxiosRequestConfig } from 'axios';
import { ApiResponse } from '../libs/interfaces';
import LoginForm from '../components/LoginForm';
import { Col, Container, Row } from 'react-bootstrap';

/////////////
export const uploadFileRequest = async (
  formData: FormData,
  progressCallback?: (progressEvent: ProgressEvent) => void
): Promise<ApiResponse<string[]>> => {
  const config: AxiosRequestConfig = {
    headers: { 'content-type': 'multipart/form-data' },
    onUploadProgress: progressCallback,
    validateStatus: (status) => true,
  };
  const response = await axios.post('/api/uploads', formData, config);

  return response.data;
};
/////////////

export default function Home() {
  // @ts-ignore
  const onChange = async (formData: any) => {
    const response = await uploadFileRequest(formData, (event: any) => {
      console.log(
        `Current progress:`,
        Math.round((event.loaded * 100) / event.total)
      );
    });

    console.log('response', response);
  };

  const { user } = useIdentity();

  return (
    <Container>
      <AuthenticatedRoutes>
        <Head>
          <title>Sweet</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <Header title="Welcome to my app!" />
          <button
            onClick={async () => {
              await user.logout();
              window.location.assign('/logout');
            }}
          >
            Logout
          </button>
          <UiFileInputButton
            onChange={onChange}
            label={'Upload'}
            uploadFileName={'theFiles'}
          />
        </main>
        <Footer />
      </AuthenticatedRoutes>
      <UnauthenticatedRoutes>
        <Row className="justify-content-md-center mt-5">
          <Col lg={4}>
            <LoginForm />
          </Col>
        </Row>
      </UnauthenticatedRoutes>
    </Container>
  );
}
