import { gql } from 'graphql-tag';
import { run } from './common';

// The GraphQL schema
const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.8", import: ["@key"])

  enum ProductType {
    SUNGLASS
    FRAME
  }

  interface Product @key(fields: "slug") {
    type: ProductType!
    slug: String!
  }

  type SunglassProduct implements Product @key(fields: "slug") {
    type: ProductType!
    slug: String!
    brand: String!
  }

  type FrameProduct implements Product @key(fields: "slug") {
    type: ProductType!
    slug: String!
    color: String!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Product: {
    __resolveReference: async ({ slug }: { slug: string }) => {
      if (slug === 'sunglass-exists') {
        return {
          type: 'SUNGLASS',
          slug,
          brand: 'RayBan',
        };
      } else if (slug === 'frame-exists') {
        return {
          type: 'FRAME',
          slug,
          color: 'Green',
        };
      } else {
        return null;
      }
    },
    __resolveType: async (entity: { type: 'SUNGLASS' | 'FRAME' }) => {
      switch (entity.type) {
        case 'SUNGLASS':
          return 'SunglassProduct';
        case 'FRAME':
          return 'FrameProduct';
        default:
          throw new Error('Unknown type');
      }
    },
  },
};

export const runA = () => run(typeDefs, resolvers, 3001, 'SubgraphA');
