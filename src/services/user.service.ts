import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/ApiError.js";
import {
  type CreateUserInput,
  type UpdateUserInput,
  type UserListQuery,
  userRepository,
} from "../repositories/user.repository.js";

const buildSearchWhere = (search?: string): Prisma.UserWhereInput => {
  if (!search) {
    return {};
  }

  return {
    OR: [
      { email: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
    ],
  };
};

export const userService = {
  async createUser(payload: CreateUserInput) {
    const existingUser = await userRepository.findByEmail(payload.email);

    if (existingUser) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "A user with this email already exists",
      );
    }

    return userRepository.create(payload);
  },

  async listUsers(query: UserListQuery) {
    const where = buildSearchWhere(query.search);
    const skip = (query.page - 1) * query.limit;

    const [users, total] = await Promise.all([
      userRepository.findMany(where, skip, query.limit),
      userRepository.count(where),
    ]);

    return {
      users,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
      },
    };
  },

  async getUserById(id: string) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    return user;
  },

  async updateUser(id: string, payload: UpdateUserInput) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    if (payload.email && payload.email !== user.email) {
      const existingUser = await userRepository.findByEmail(payload.email);

      if (existingUser && existingUser.id !== id) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          "A user with this email already exists",
        );
      }
    }

    return userRepository.updateById(id, payload);
  },

  async deleteUser(id: string) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    await userRepository.deleteById(id);

    return user;
  },
};
