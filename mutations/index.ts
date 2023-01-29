import { graphQLSchemaExtension } from '@keystone-next/keystone/schema';
import addToCart from './addToCart';

// we are extending the graphql schema with our own custom mutation

// make a fake graphql tagged template literal so the String (elsewhere not a string but a declared var or something) to get syntax highlighting
const graphql = String.raw;

export const extendGraphqlSchema = graphQLSchemaExtension({
  // name of the method, what args it takes, what does it return as in playground docs
  typeDefs: graphql`
    type Mutation {
      addToCart(productId: ID): CartItem
    }
  `,
  // links to node.js functions that will run "when those things are requested upon via the graphql api" <-?
  resolvers: {
    Mutation: {
      addToCart,
    },
  },
});
