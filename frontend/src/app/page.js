'use client';

import KanbanBoard from '@/components/KanbanBoard';
import { useAuth } from '@reactivers/use-auth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  if (!isLoggedIn) {
    router.push('/login');
    return null;
  }
  return <KanbanBoard />;
}
