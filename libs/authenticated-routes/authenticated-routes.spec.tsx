import React from 'react';
import { render } from '@testing-library/react';

import AuthenticatedRoutes from './authenticated-routes';

describe('AuthenticatedRoutes', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AuthenticatedRoutes />);
    expect(baseElement).toBeTruthy();
  });
});
