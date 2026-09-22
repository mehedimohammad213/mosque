import type { Request, Response } from 'express';
import * as userService from '../services/userService';
import asyncHandler from '../middleware/asyncHandler';
import type {
  CreateUserInput,
  UpdateUserInput,
  UserFilters,
} from '../models/userModel';

export const index = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.listUsers(req.query as UserFilters);
  res.json(users);
});

export const show = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUser(req.params.id as string);
  res.json(user);
});

export const store = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body as CreateUserInput);
  res.status(201).json(user);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateUser(
    req.params.id as string,
    req.body as UpdateUserInput
  );
  res.json(user);
});

export const destroy = asyncHandler(async (req: Request, res: Response) => {
  await userService.deleteUser(req.params.id as string);
  res.status(204).send();
});
