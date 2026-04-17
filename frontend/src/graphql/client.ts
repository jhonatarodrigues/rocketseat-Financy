import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3333/graphql'

export const graphqlClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: backendUrl,
  }),
})
