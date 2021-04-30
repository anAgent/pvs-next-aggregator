import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.scss';

import { AppProps } from 'next/app';
import {
  getNetlifyAuth,
  NetlifyIdentityProvider,
} from '../libs/netlify-identity-provider';

function Application({ Component, pageProps }: AppProps) {
  return (
    <NetlifyIdentityProvider identity={getNetlifyAuth()}>
      <Component {...pageProps} />
    </NetlifyIdentityProvider>
  );
}

export default Application;
