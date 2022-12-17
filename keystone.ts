import 'dotenv/config'; // brings in our .env vars
import { config, createSchema } from '@keystone-next/keystone/schema'; // note: if stuff breaks they changed it to @keystone/whatever
import { createAuth } from '@keystone-next/auth';
import {
  withItemData,
  statelessSessions,
} from '@keystone-next/keystone/session';
import { User } from './schemas/User';

const databaseURL =
  process.env.DATABASE_URL || 'mongodb://localhost/keystone=sick-fits-tutorial'; // second is a fallback

// authenticate users
const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // how long they are signed in
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  // Needs to know which schema is going to be the user
  listKey: 'User',
  // user name, etc
  identityField: 'email',
  // password
  secretField: 'password',
  // because an issue with auth is the catch 22 of authorizing a new user when the new user doesn't pre-exist
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO add in initial roles
  },
});

// keystone server config
export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: 'mongoose',
      url: databaseURL,
      // TODO : add data seeding here
    },
    lists: createSchema({
      // schema items go here
      // in JS, when the prop and the value are the same we just write the name
      User,
    }),
    ui: {
      // show the ui only for the people who pass this test
      isAccessAllowed: ({ session }) => {
        // this will? log to the terminal
        console.log(session);
        // if there is a session and there is a session.data then return true they are logged in otherwise they are not logged in.
        // !! because we need to coerce into a boolean
        return !!session?.data;
      },
    },
    session: withItemData(statelessSessions(sessionConfig), {
      // pass the id and any other data we query along with every single session & anytime we want to access a session we have access the user's name, email, etc.
      // graphql query
      User: 'id',
    }),
  })
);
