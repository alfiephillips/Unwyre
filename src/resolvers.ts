import { IResolvers } from "graphql-tools";
import * as bcrypt from "bcrypt";
import User from "./entity/User";

const resolvers: IResolvers = {
  Query: {
    me: (_, __, { req }) => {
      if (!req.session.userId) {
        return null;
      }

      return User.findOne(req.session.userId);
    },
  },
  Mutation: {
    logout: async (_, __, { req, res }) => {
      await new Promise<void>((res) => req.session.destroy(() => res()));
      res.clearCookie("connect.sid");
      return true;
    },
    register: async (_, { email, password }) => {
      const salt = 10;
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({
        email,
        password: hashedPassword,
      }).save();

      return user;
    },
    login: async (_, { email, password }, { req }) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        return null;
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return null;
      }

      req.session.userId = user.id;

      return user;
    },
  },
};

export default resolvers;
