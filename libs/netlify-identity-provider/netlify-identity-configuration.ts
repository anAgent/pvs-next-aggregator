import GoTrue from 'gotrue-js';

const config = {
  APIUrl: process.env.NEXT_PUBLIC_NETLIFY_IDENTITY_URI || '',
  audience: process.env.NEXT_PUBLIC_NETLIFY_IDENTITY_AUDIENCE || '',
  setCookie: true,
};

export const getNetlifyAuth = (): GoTrue => new GoTrue(config);
