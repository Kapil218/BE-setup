import { Prisma, type User } from "@prisma/client";
import { prisma } from "../../../config/db.config.js";

export type CreateUserInput = {
  email: string;
  name: string;
};

export type UpdateUserInput = {
  email?: string | undefined;
  name?: string | undefined;
};

export type UserListQuery = {
  page: number;
  limit: number;
  search?: string | undefined;
};

export type UserWhereInput = Prisma.UserWhereInput;

export const userRepository = {
  create(data: CreateUserInput): Promise<User> {
    return prisma.user.create({ data });
  },

  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  findMany(where: UserWhereInput, skip: number, take: number): Promise<User[]> {
    return prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  },

  count(where: UserWhereInput): Promise<number> {
    return prisma.user.count({ where });
  },

  updateById(id: string, data: UpdateUserInput): Promise<User> {
    const updateData: Prisma.UserUpdateInput = {};

    if (data.email !== undefined) {
      updateData.email = data.email;
    }

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
    });
  },

  deleteById(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  },
};
