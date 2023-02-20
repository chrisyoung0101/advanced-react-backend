/* eslint-disable */ // not the best solution but works for what we need to do in this course
import {
  CartItemCreateInput,
  OrderCreateInput,
} from '../.keystone/schema-types';
import { KeystoneContext, SessionStore } from '@keystone-next/types';
import { CartItem } from '../schemas/CartItem';
import stripeConfig from '../lib/stripe';

const graphql = String.raw;

// Could write this below as well:  { token }: Arguments = { token }: { token: string },
interface Arguments {
  token: string;
}

async function checkout(
  root: any,
  { token }: Arguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // 1. Make sure they are signed in
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error('Sorry! You must be signed in to create an order!');
  }
  // 1.5 Query the current user
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql` 
      id
      name 
      email 
      cart {
        id
        quantity 
        product {
          name 
          price 
          description 
          id 
          photo {
            id 
            image {
              id 
              publicUrlTransformed
            }
          }
        }
      }
    `,
  });
  // console.log(user);
  // console.dir(user, { depth: null });

  // 2. Calculate the total price for their order
  // if this returns an object, it will be true.  If it returns null it will be false.
  const cartItems = user.cart.filter((cartItem) => cartItem.product);
  const amount = cartItems.reduce(function (
    tally: number,
    cartItem: CartItemCreateInput
  ) {
    return tally + cartItem.quantity * cartItem.product.price;
  },
  0);
  // console.log(amount);

  // 3. create the charge with the Stripe library
  // confirm: true allows us to just charge the card without extra steps
  // payment method is the token that got passed into our browser
  const charge = await stripeConfig.paymentIntents
    .create({
      amount,
      currency: 'USD',
      confirm: true,
      payment_method: token,
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err.message);
    });
  // 4. Convert the cartItems to OrderItems
  // 5. Create the order and return it
}

export default checkout;