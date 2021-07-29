import DataLoader from "dataloader";
import { User } from "../entities/User";

export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);
    const userIdToUser: Record<number, User> = {};

    for (let i = 0; i < users.length; i++) {
      userIdToUser[i] = users[i];
    }

    const sortedUsers = userIds.map((userId) => userIdToUser[userId]);
    return sortedUsers;
  });
