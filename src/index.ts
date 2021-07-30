import "reflect-metadata";
import "dotenv/config";
import { createConnection } from "typeorm";
import { ApolloServer, UserInputError } from "apollo-server-express";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";

import { __prod__, COOKIE_NAME } from "./constants";

import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import User from "./entity/User";

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }: any) => ({
      req,
      res,
    }),
  });

  await createConnection({
    type: "mongodb",
    database: "unwyre",
    url: process.env.DATABASE_URL,
    logging: !__prod__,
    synchronize: true,
    entities: [User],
  });

  const app = express();

  app.use(
    session({
      name: COOKIE_NAME,
      secret: "cat",
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({
        mongoUrl: process.env.DATABASE_URL,
        collectionName: "session",
      }),
    })
  );

  await server.start();

  await server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: "*",
    },
  }); // app is from an existing express app

  app.listen({ port: process.env.PORT || 4000 }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT || 4000}${
        server.graphqlPath
      }`
    )
  );
};

startServer().catch((err) => {
  console.error(err);
});
