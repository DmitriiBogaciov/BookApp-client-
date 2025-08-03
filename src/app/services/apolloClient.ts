"use client";

import { ApolloClient, InMemoryCache, ApolloLink, split } from "@apollo/client";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { HttpLink } from "@apollo/client/link/http";
import { getMainDefinition } from "@apollo/client/utilities";


const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_BAOBOOX_API_GRAPHQL}`,
});

const wsLink = typeof window !== "undefined"
  ? new GraphQLWsLink(
      createClient({
        url: `${process.env.NEXT_PUBLIC_BAOBOOX_API_GRAPHQL}`,
      })
    )
  : null;

/**
 * Функция, которая решает:
 * - Если это Subscription-операция, использовать WebSocket
 * - Иначе — HTTP
 */
const splitLink = typeof window !== "undefined" && wsLink !== null
  ? split(
      ({ query }) => {
        const def = getMainDefinition(query);
        return (
          def.kind === "OperationDefinition" && def.operation === "subscription"
        );
      },
      wsLink,
      httpLink
    )
  : httpLink;

/**
 * Инициализация Apollo Client
 */
export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
