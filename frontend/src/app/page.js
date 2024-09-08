'use client';

import { useAuth } from '@reactivers/use-auth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  if (!isLoggedIn) {
    router.push('/login');
    return null;
  }
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}
