import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_API_URL;
const adminSecret = import.meta.env.VITE_HASURA_ADMIN_SECRET;

const httpLink = createHttpLink({
  uri: graphqlEndpoint,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'content-type': 'application/json',
      'x-hasura-admin-secret': adminSecret,
    }
  }
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

