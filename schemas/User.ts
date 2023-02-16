import { list } from '@keystone-next/keystone/schema';
import { text, password, relationship } from '@keystone-next/fields';

export const User = list({
  // these props are part of access & roles
  // access:

  fields: {
    name: text({ isRequired: true }),
    email: text({ isRequired: true, isUnique: true }),
    password: password(),
    cart: relationship({
      ref: 'CartItem.user',
      many: true, // allows tou to have many things in your cart
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    orders: relationship({ ref: 'Order.user', many: true }),
  },
});

/* Two way relationship : 
CartItem.ts Schema -      user: relationship({ ref: 'User.cart' }) <- the user is referenced to User.cart
User.ts Schema - cart: relationship({ref: 'CartItem.user'...  <- the cart is referenced to CartItem.user 

*/
