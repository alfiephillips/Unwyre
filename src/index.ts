import "reflect-metadata";
import "dotenv-safe/config";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { createConnection, Connection } from "typeorm";
import path from "path";

const init = async () => {
  const connection: Connection = await createConnection({
    type: "mongodb",
    url: process.env.DATABASE_URL,
    logging: true,
    database: "unwyre",
  });
};
