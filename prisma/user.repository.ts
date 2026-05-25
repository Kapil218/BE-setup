import { prisma } from "../src/config/db/db";

export const createUser = (data: { email: string; name: string }) => {
  return prisma.user.create({
    data,
  });
};
