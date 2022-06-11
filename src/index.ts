import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import microConfig from './mikro-orm.config';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
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
