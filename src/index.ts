import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import microConfig from './mikro-orm.config';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { MyContext } from './types';

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up();

  const app = express();

  // const RedisStore = connectRedis(session);
  // const redisClient = redis.createClient();

  // app.use(
  //   session({
  //     store: new RedisStore({
  //       client: redisClient as any,
  //       disableTTL: true,
  //       // ttl: 1000 * 60 * 60 * 24 * 7,
  //     }),
  //     cookie: {
  //       maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
  //       httpOnly: true,
  //       secure: __prod__, // only set secure cookies in production
  //       sameSite: 'lax', // csrf protection
  //     },
  //     secret: 'qwedasbngjfgvxadsqwddasdazxcee',
  //     resave: false,
  //     name: 'qid',
  //     saveUninitialized: false,
  //   })
  // );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('listening on port 4000');
  });
};

main().catch((err) => {
  console.error(err);
});
