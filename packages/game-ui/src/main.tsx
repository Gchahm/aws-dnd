import { useAuth } from 'react-oidc-context';
import CognitoAuth from './components/CognitoAuth';
import GameApiClientProvider from './components/GameApiClientProvider';
import QueryClientProvider from './components/QueryClientProvider';
import { useRuntimeConfig } from './hooks/useRuntimeConfig';
import RuntimeConfigProvider from './components/RuntimeConfig';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.en';
import '@cloudscape-design/global-styles/index.css';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type RouterProviderContext = {
  runtimeConfig?: ReturnType<typeof useRuntimeConfig>;
  auth?: ReturnType<typeof useAuth>;
};

const router = createRouter({
  routeTree,
  context: {
    runtimeConfig: undefined,
    auth: undefined,
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  const auth = useAuth();
  const runtimeConfig = useRuntimeConfig();
  return <RouterProvider router={router} context={{ runtimeConfig, auth }} />;
};

const root = document.getElementById('root');
root &&
  createRoot(root).render(
    <React.StrictMode>
      <I18nProvider locale="en" messages={[messages]}>
        <RuntimeConfigProvider>
          <CognitoAuth>
            <QueryClientProvider>
              <GameApiClientProvider>
                <App />
              </GameApiClientProvider>
            </QueryClientProvider>
          </CognitoAuth>
        </RuntimeConfigProvider>
      </I18nProvider>
    </React.StrictMode>,
  );
