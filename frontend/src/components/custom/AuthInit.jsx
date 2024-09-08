'use client';

import { useAuth } from '@reactivers/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';

function AuthInit() {
  const { login, logout } = useAuth();
  const router = useRouter();
  const handelGetCurrentUser = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      );
      const result = await response.json();
      console.log('Current user:', result.user);
      if (!response.ok) {
        logout();
        router.push('/login');
        return;
      }
      login(result.user);
    } catch (error) {
      console.error('Login error:', error);
    }
  }, [login, logout]);

  useEffect(() => {
    handelGetCurrentUser();
  }, [handelGetCurrentUser]);
  return null;
}

export default AuthInit;
