import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3333/graphql'
const AUTH_TOKEN_STORAGE_KEY = '@financy:token'

type GraphQLResponse<T> = {
  data?: T
  errors?: { message: string }[]
}

const authLink = new ApolloLink((operation, forward) => {
  const token = getAuthToken()

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }))

  return forward(operation)
})

const httpLink = new HttpLink({
  uri: backendUrl,
})

export const graphqlClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
})

export function getAuthToken() {
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
}

export function persistAuthToken(token: string) {
  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
}

export function clearAuthToken() {
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
}

export async function graphqlRequest<TData, TVariables extends Record<string, unknown> = Record<string, unknown>>(
  query: string,
  variables?: TVariables,
) {
  const token = getAuthToken()
  const response = await fetch(backendUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const json = (await response.json()) as GraphQLResponse<TData>

  if (!response.ok || json.errors?.length) {
    throw new Error(json.errors?.[0]?.message ?? 'Erro ao comunicar com a API.')
  }

  if (!json.data) {
    throw new Error('A API não retornou dados.')
  }

  return json.data
}
