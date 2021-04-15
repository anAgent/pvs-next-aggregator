import React from 'react';
import { render } from '@testing-library/react';
import GoTrue, { User } from 'gotrue-js';
import { useLocation } from 'react-router';

import UnauthenticatedRoutes from './unauthenticated-routes';
import { NetlifyIdentityProvider } from '@nx-rosatsch/ui-components';

import { mocked } from 'ts-jest/utils';

jest.mock('gotrue-js');
jest.mock('react-router');

describe('UnauthenticatedRoutes', () => {
  it('should render successfully when user is not authenticated', async () => {
    // Arrange
    const goTrue = new GoTrue();
    const goTrueMock = mocked<GoTrue>(goTrue);
    const locationMock = mocked(useLocation);
    locationMock.mockImplementation(() => {
      return {
        hash: '',
        ...jest.requireActual('react-router-dom'),
      };
    });
    goTrueMock.currentUser.mockReturnValue(null);

    // Act
    const { baseElement, findByText, container } = render(
      <NetlifyIdentityProvider identity={goTrueMock}>
        <UnauthenticatedRoutes>
          <div>Rendered</div>
        </UnauthenticatedRoutes>
      </NetlifyIdentityProvider>
    );

    // Assert
    expect(baseElement).toBeTruthy();
    expect(goTrueMock.currentUser).toBeCalled();
    expect(await findByText('Rendered')).toBeDefined();
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div>
          Rendered
        </div>
      </div>
    `);
  });

  it('should not render content when user is authenticated', async () => {
    // Arrange
    const goTrue = new GoTrue();
    const goTrueMock = mocked<GoTrue>(goTrue);
    const locationMock = mocked(useLocation);
    locationMock.mockImplementation(() => {
      return {
        hash: '',
        ...jest.requireActual('react-router-dom'),
      };
    });
    goTrueMock.currentUser.mockReturnValue({ id: 'user' } as User);

    // Act
    const { baseElement, container } = render(
      <NetlifyIdentityProvider identity={goTrueMock}>
        <UnauthenticatedRoutes>
          <div>Rendered</div>
        </UnauthenticatedRoutes>
      </NetlifyIdentityProvider>
    );

    // Assert
    expect(baseElement).toBeTruthy();
    expect(goTrueMock.currentUser).toBeCalled();
    expect(container).toMatchInlineSnapshot(`<div />`);
  });
});
