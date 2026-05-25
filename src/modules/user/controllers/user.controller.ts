import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { userService } from "../services/user.service.js";
import type {
  CreateUserBody,
  ListUsersQuery,
  UpdateUserBody,
  UserParams,
} from "../types/user.types.js";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as CreateUserBody;
  const user = await userService.createUser(payload);

  return res
    .status(StatusCodes.CREATED)
    .json(
      new ApiResponse(StatusCodes.CREATED, user, "User created successfully"),
    );
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const query = (res.locals.validatedQuery ?? req.query) as ListUsersQuery;
  const result = await userService.listUsers(query);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, result, "Users fetched successfully"),
    );
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as UserParams;
  const user = await userService.getUserById(id);

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, user, "User fetched successfully"));
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as UserParams;
  const payload = req.body as UpdateUserBody;
  const user = await userService.updateUser(id, payload);

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, user, "User updated successfully"));
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as UserParams;
  const user = await userService.deleteUser(id);

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, user, "User deleted successfully"));
});
