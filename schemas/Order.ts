import {
  integer,
  select,
  text,
  relationship,
  virtual,
} from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import formatMoney from '../lib/formatMoney';

export const Order = list({
  fields: {
    label: virtual({
      graphQLReturnType: 'String',
      resolver(item) {
        // custom label in keystone Orders ui reads : Wilber shakes trees $10.00
        return `Wilber shakes trees ${formatMoney(item.total)}`;
      },
    }),
    total: integer(),
    items: relationship({ ref: 'OrderItem.order', many: true }),
    user: relationship({ ref: 'User.orders' }),
    charge: text(),
  },
});
