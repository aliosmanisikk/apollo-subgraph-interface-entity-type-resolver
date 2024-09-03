import { gql } from 'graphql-tag';
import { run } from './common';

// The GraphQL schema
const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.8", import: ["@key", "@shareable", "@interfaceObject"])

  type ShoppingList {
    items: [ShoppingListItem!]!
  }

  type ShoppingListItem {
    id: String!
    product: Product
  }

  type Product @key(fields: "slug", resolvable: false) @interfaceObject {
    slug: String!
  }

  extend type Query {
    myShoppingList: ShoppingList!
    myStaleShoppingList: ShoppingList!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    myShoppingList: () => ({
      items: [
        { id: '1', product: { slug: 'sunglass-exists' } },
        { id: '2', product: { slug: 'frame-exists' } },
      ],
    }),
    myStaleShoppingList: () => ({
      items: [
        { id: '1', product: { slug: 'sunglass-exists' } },
        { id: '2', product: { slug: 'frame-no-longer-exists' } },
      ],
    }),
  },
};

export const runB = () => run(typeDefs, resolvers, 3002, 'SubgraphB');
