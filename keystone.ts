import 'dotenv/config'; // brings in our .env vars
import { config, createSchema } from '@keystone-next/keystone/schema'; // note: if stuff breaks they changed it to @keystone/whatever

const databaseURL =
  process.env.DATABASE_URL || 'mongodb://localhost/keystone=sick-fits-tutorial'; // second is a fallback

// authenticate users
const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // how long they are signed in
  secret: process.env.COOKIE_SECRET,
};

export default config({
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
  }),
  ui: {
    // TODO: change this for roles
    isAccessAllowed: () => true,
  },
  // TODO: add session variables here
});
