'use client';

import { FetchProvider } from '@reactivers/use-fetch';
import { AuthProvider } from '@reactivers/use-auth';
import { LocalStorageProvider } from '@reactivers/use-local-storage';

function Providers({ children }) {
  return (
    <LocalStorageProvider>
      <AuthProvider>
        <FetchProvider url={process.env.NEXT_PUBLIC_API_URL}>
          {children}
        </FetchProvider>
      </AuthProvider>
    </LocalStorageProvider>
  );
}

export default Providers;
