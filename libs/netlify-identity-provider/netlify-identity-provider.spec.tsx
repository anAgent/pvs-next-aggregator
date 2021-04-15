import React from 'react';
import { render } from '@testing-library/react';
import NetlifyIdentityProvider from './netlify-identity-provider';
import { mocked } from 'ts-jest/utils';
import GoTrue from 'gotrue-js';
import { useLocation } from 'react-router';

jest.mock('gotrue-js');
jest.mock('react-router');

const goTrue = new GoTrue();
const goTrueMock = mocked(goTrue);
const locationMock = mocked(useLocation);

describe('NetlifyIdentityProvider', () => {
  afterEach(() => {
    // to ?

    // @ts-ignore
    //goTrueMock.mockReset();
    locationMock.mockReset();
  });

  beforeEach(() => {
    locationMock.mockImplementation(() => {
      return {
        hash: '',
        ...jest.requireActual('react-router-dom'),
      };
    });
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <NetlifyIdentityProvider identity={goTrueMock} />
    );
    expect(baseElement).toBeTruthy();
  });
});
