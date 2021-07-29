import "reflect-metadata";
import "dotenv-safe/config";

import { __prod__, COOKIE_NAME } from "./constants";

import chalk from "chalk";
import express from "express";
// import { ApolloServer } from "apollo-server-express";
// import { buildSchema } from "type-graphql";

import session from "express-session";

import { createConnection } from "typeorm";
import MongoStore from "connect-mongo";

import cors from "cors";
import path from "path";

const init = async () => {
  const connection = await createConnection({
    type: "mongodb",
    database: "unwyre",
    url: process.env.DATABASE_URL,
    logging: !__prod__,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [],
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
      origin: process.env.CORS_ORIGIN,
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

  app.listen(parseInt(process.env.PORT), () => {
    console.log(
      chalk.yellow(`Server started on http://localhost:${process.env.PORT}`)
    );
  });
};

init().catch((err) => {
  console.error(err);
});
