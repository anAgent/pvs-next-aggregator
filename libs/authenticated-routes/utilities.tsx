import React from 'react';

export function getChildrenOrFunction<T>(
  children: React.ReactNode,
  args: T
): React.ReactNode {
  if (typeof children === 'function') {
    return children(args);
  }
  return children;
}
