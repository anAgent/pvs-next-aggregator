import '../styles/globals.css';
import { AppProps } from 'next/app';
import {
  getNetlifyAuth,
  NetlifyIdentityProvider,
} from '../libs/netlify-identity-provider';

function Application({ Component, pageProps }: AppProps) {
  console.log('app loaded');
  return (
    <NetlifyIdentityProvider identity={getNetlifyAuth()}>
      <Component {...pageProps} />
    </NetlifyIdentityProvider>
  );
}

export default Application;
