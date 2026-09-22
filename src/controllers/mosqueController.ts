import type { Request, Response } from 'express';
import * as mosqueService from '../services/mosqueService';
import asyncHandler from '../middleware/asyncHandler';
import type {
  CreateMosqueInput,
  MosqueFilters,
  UpdateMosqueInput,
} from '../models/mosqueModel';

export const index = asyncHandler(async (req: Request, res: Response) => {
  const mosques = await mosqueService.listMosques(req.query as MosqueFilters);
  res.json(mosques);
});

export const show = asyncHandler(async (req: Request, res: Response) => {
  const mosque = await mosqueService.getMosque(req.params.id as string);
  res.json(mosque);
});

export const store = asyncHandler(async (req: Request, res: Response) => {
  const mosque = await mosqueService.createMosque(req.body as CreateMosqueInput);
  res.status(201).json(mosque);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const mosque = await mosqueService.updateMosque(
    req.params.id as string,
    req.body as UpdateMosqueInput
  );
  res.json(mosque);
});

export const destroy = asyncHandler(async (req: Request, res: Response) => {
  await mosqueService.deleteMosque(req.params.id as string);
  res.status(204).send();
});
