// Helpers

import "reflect-metadata";
import "dotenv-safe/config";

// Constants

import { __prod__, COOKIE_NAME } from "./constants";

// Basic Imports
import chalk from "chalk";
import express from "express";
import session from "express-session";
import cors from "cors";
import path from "path";

// Server Imports

import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

// Entities
import { Url } from "./entities/Url";
import { User } from "./entities/User";

// Loaders

import { createUserLoader } from "./utils/createUserLoader";

// Database Imports
// import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import MongoStore from "connect-mongo";
import { HelloResolver } from "./resolvers/HelloResolver";
import { UserResolver } from "./resolvers/UserResolver";

const init = async () => {
  const connection = await createConnection({
    type: "mongodb",
    database: "unwyre",
    url: process.env.DATABASE_URL,
    logging: !__prod__,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [User, Url],
  })
    .then(() => {
      console.log(chalk.green("Database connected."));
    })
    .catch((err) => {
      console.error(err);
    });

  const app = express();

  const store = MongoStore.create({
    mongoUrl: process.env.DATABASE_URL,
    dbName: "unwyre",
    collectionName: "sessions",
    autoRemove: "native",
    stringify: true,
  });

  app.set("trust proxy", 1);
  app.use(
    cors({
      credentials: true,
    })
  );
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      name: COOKIE_NAME,
      store: store,
      cookie: {
        maxAge: 1000 * 60 * 8, // 8 hours
        httpOnly: true,
        sameSite: "lax", // csrf protection
        secure: __prod__,
        domain: undefined,
      },
      saveUninitialized: false,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      userLoader: createUserLoader(),
    }),
  });

  await apolloServer.start();

  await apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(parseInt(process.env.PORT), () => {
    console.log(
      chalk.yellow(`Server started on http://localhost:${process.env.PORT}`)
    );
  });
};

init().catch((err) => {
  console.error(err);
});
