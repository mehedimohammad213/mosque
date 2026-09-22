import type { Request, Response } from 'express';
import * as weeklyCollectionService from '../services/weeklyCollectionService';
import asyncHandler from '../middleware/asyncHandler';
import type {
  CreateWeeklyCollectionInput,
  UpdateWeeklyCollectionInput,
  WeeklyCollectionFilters,
} from '../models/weeklyCollectionModel';

export const index = asyncHandler(async (req: Request, res: Response) => {
  const rows = await weeklyCollectionService.listWeeklyCollections(
    req.query as WeeklyCollectionFilters
  );
  res.json(rows);
});

export const show = asyncHandler(async (req: Request, res: Response) => {
  const row = await weeklyCollectionService.getWeeklyCollection(
    req.params.id as string
  );
  res.json(row);
});

export const store = asyncHandler(async (req: Request, res: Response) => {
  const row = await weeklyCollectionService.createWeeklyCollection(
    req.body as CreateWeeklyCollectionInput
  );
  res.status(201).json(row);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const row = await weeklyCollectionService.updateWeeklyCollection(
    req.params.id as string,
    req.body as UpdateWeeklyCollectionInput
  );
  res.json(row);
});

export const destroy = asyncHandler(async (req: Request, res: Response) => {
  await weeklyCollectionService.deleteWeeklyCollection(req.params.id as string);
  res.status(204).send();
});
