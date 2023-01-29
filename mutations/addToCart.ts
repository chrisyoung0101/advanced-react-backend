/* eslint-disable */ // not the best solution but works for what we need to do in this course
import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';
import { CartItem } from '../schemas/CartItem';

async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  console.log('ADDING TO CART!!'); // this logs in the cli

  // 1. Query the current user & see if they are signed in
  const sesh = context.session as Session;
  // if there is no user logged in - throw error
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this!');
  }
  // 2. Query the current users cart
  const allCartItems = await context.lists.CartItem.findMany({
    // this is passed in via args in addToCart()
    // find me an item where based on both the user and product
    where: { user: { id: sesh.itemId }, product: { id: productId } },
    // must be plural : resolveFields
    resolveFields: 'id, quantity',
  });
  const [existingCartItem] = allCartItems;
  if (existingCartItem) {
    console.log(
      `There are already ${existingCartItem.quantity}, in the cart, increment by 1!`
    );
    // 3. See if the current item is in their cart
    // 4. if item is in cart, increment by 1
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
    });
  }

  // 5. if item is NOT in cart, create a new cart item!
  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: sesh.itemId } },
    },
  });
}

export default addToCart;
