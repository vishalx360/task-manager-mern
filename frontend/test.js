import { useGet, usePost, FetchProvider } from '@reactivers/use-fetch';
import { useAuth, AuthProvider } from '@reactivers/use-auth';
import { LocalStorageProvider } from '@reactivers/use-local-storage';
import { useCallback, useEffect, useState } from 'react';

const Banner = () => {
  return (
    <div style={{ position: 'fixed', bottom: 8, left: 8 }}>
      <h1>@reactivers/hooks</h1>
      <h3>
        You can find detailed docs and more{' '}
        <a href="https://hooks.reactivers.com" target="_blank">
          here
        </a>
      </h3>
    </div>
  );
};

const UseFetchAuthSignInExample = () => {
  const { token, isLoggedIn, login, logout } = useAuth();
  const { request } = useGet();

  useEffect(() => {
    if (token) {
      if (isLoggedIn) {
        //show application
      } else {
        //get user info
        request({
          endpoint: '/users/current',
          onSuccess: (response) => {
            delete response.result.token;
            login(response.result);
          },
        });
      }
    } else {
      if (isLoggedIn) {
        //old session -> logout
        logout();
      } else {
        //showSignIn page
      }
    }
  }, [token, isLoggedIn, login, request, logout]);

  if (token) {
    if (isLoggedIn) {
      return <Application />;
    } else {
      return <p>Loading...</p>;
    }
  } else {
    if (isLoggedIn) {
      return <p>Logging out...</p>;
    } else {
      return <SignInPage />;
    }
  }
};

const Application = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <h1>Awesome application</h1>
      <p style={{ whiteSpace: 'pre-line' }}>{JSON.stringify(user, null, 2)}</p>
      <button onClick={logout}>Log out</button>
    </div>
  );
};

const SignInPage = () => {
  const [info, setInfo] = useState({});
  const { login } = useAuth();
  const { request } = usePost();

  const signIn = useCallback(() => {
    request({
      endpoint: `/users/sign-in`,
      body: info,
      onSuccess: (response) => {
        login(response.result);
      },
    });
  }, [request, info, login]);

  return (
    <div className="sample-page center">
      <Banner />
      <div className="card">
        <h2>Use Auth Example</h2>
        <input
          type="text"
          placeholder="Any username"
          onChange={(e) => {
            setInfo((old) => ({ ...old, username: e.target.value }));
          }}
        />
        <input
          type="password"
          placeholder="Any password"
          onChange={(e) => {
            setInfo((old) => ({ ...old, password: e.target.value }));
          }}
        />
        <button onClick={signIn}>Sign in</button>
      </div>
    </div>
  );
};

const AppWrapper = () => {
  return (
    <LocalStorageProvider>
      <AuthProvider>
        <FetchProvider url="https://yd37o.mocklab.io/api">
          <UseFetchAuthSignInExample />
        </FetchProvider>
      </AuthProvider>
    </LocalStorageProvider>
  );
};

export default AppWrapper;
