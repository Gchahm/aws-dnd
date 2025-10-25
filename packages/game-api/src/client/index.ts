import { createTRPCClient, httpLink, HTTPLinkOptions } from '@trpc/client';
import { AwsClient } from 'aws4fetch';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { AppRouter } from '../router.js';

const credentialProvider = fromNodeProviderChain();

const sigv4Fetch = (async (...args) => {
  const client = new AwsClient(await credentialProvider());
  return client.fetch(...args);
}) satisfies AwsClient['fetch'];

export interface GameApiClientConfig {
  readonly url: string;
}

export const createGameApiClient = (config: GameApiClientConfig) => {
  const linkOptions: HTTPLinkOptions<any> = {
    url: config.url,
    fetch: sigv4Fetch,
  };
  return createTRPCClient<AppRouter>({
    links: [httpLink(linkOptions)],
  });
};
