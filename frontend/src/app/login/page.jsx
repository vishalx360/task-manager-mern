'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useCallback } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signinSchema } from '@/lib/validationSchema';
import { useAuth } from '@reactivers/use-auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import LinkButton from '@/components/custom/LinkButton';

// Define the Zod schema for validation

const Login = () => {
  // Initialize react-hook-form with the Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signinSchema),
  });
  const router = useRouter();
  const { login, isLoggedIn } = useAuth();

  const handelSignIn = useCallback(
    async (data) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
          },
        );
        const result = await response.json();
        if (!response.ok) {
          toast.error(result.message || 'Login error');
          return;
        }
        console.log('Login result:', result.user);
        login(result.user);
        toast.success(result.message || 'Login successful');
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Login error');
      }
    },
    [login],
  );

  if (isLoggedIn) {
    router.push('/');
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Login
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(handelSignIn)}>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full font-bold">
            Login
          </Button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Signup
            </Link>
          </p>
          <LinkButton
            variant={'outline'}
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google/login`}
            className="mt-4 w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <FaGoogle className="mr-2" />
            Login with Google
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

export default Login;
