import { integer, select, text, relationship } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';

/* 

Two way relationship : 
CartItem.ts Schema -      user: relationship({ ref: 'User.cart' }) <- the user is referenced to User.cart
User.ts Schema -          cart: relationship({ref: 'CartItem.user'...  <- the cart is referenced to CartItem.user 

*/

export const CartItem = list({
  ui: {
    listView: {
      initialColumns: ['product', 'quantity', 'user'],
    },
  },
  fields: {
    // TODO : custom label in here
    quantity: integer({
      defaultValue: 1,
      isRequired: true,
    }),
    product: relationship({ ref: 'Product' }),
    user: relationship({ ref: 'User.cart' }),
  },
});
