import { AppRouter } from ':dungeon-adventure/game-api';
import { useQueryClient } from '@tanstack/react-query';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { FC, PropsWithChildren, useMemo } from 'react';
import { useRuntimeConfig } from '../hooks/useRuntimeConfig';
import { HTTPLinkOptions, createTRPCClient, httpLink } from '@trpc/client';
import { useSigV4 } from '../hooks/useSigV4';

export const GameApiTRPCContext: ReturnType<
  typeof createTRPCContext<AppRouter>
> = createTRPCContext<AppRouter>();

export const GameApiClientProvider: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = useQueryClient();
  const runtimeConfig = useRuntimeConfig();
  const apiUrl = runtimeConfig.apis.GameApi;

  const sigv4Client = useSigV4();

  const trpcClient = useMemo(() => {
    const linkOptions: HTTPLinkOptions<any> = {
      url: apiUrl,
      fetch: sigv4Client,
    };

    return createTRPCClient<AppRouter>({
      links: [httpLink(linkOptions)],
    });
  }, [apiUrl, sigv4Client]);

  return (
    <GameApiTRPCContext.TRPCProvider
      trpcClient={trpcClient}
      queryClient={queryClient}
    >
      {children}
    </GameApiTRPCContext.TRPCProvider>
  );
};

export default GameApiClientProvider;
