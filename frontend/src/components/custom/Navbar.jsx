'use client';

import React from 'react';
import { FaTasks } from 'react-icons/fa';
import LinkButton from '@/components/custom/LinkButton';
import { useAuth } from '@reactivers/use-auth';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { useCallback } from 'react';
import { toast } from 'sonner';

const links = [
  {
    href: '/login',
    label: 'Login',
  },
  {
    href: '/signup',
    label: 'Signup',
  },
];

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const pathName = usePathname();
  const handelLogout = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      );
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message || 'Logout error');
        return;
      }
      console.log('Logout result:', result);
      logout();
      toast.success(result.message || 'Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout error');
    }
  }, [toast, logout]);

  return (
    <nav className="bg-blue-500 p-5 justify-between flex items-center">
      <div>
        <FaTasks className="text-white" size="30px" />
      </div>
      <div className="flex">
        {isLoggedIn ? (
          <div className="flex items-center gap-5">
            <h1 className="text-white">{user.email}</h1>
            <Button
              onClick={handelLogout}
              variant={'destructive'}
              label="Logout"
            >
              Logout
            </Button>
          </div>
        ) : (
          <>
            {links.map((link) => (
              <LinkButton
                key={link.href}
                href={link.href}
                variant={pathName === link.href ? 'default' : 'secondary'}
              >
                {link.label}
              </LinkButton>
            ))}
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
