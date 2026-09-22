import type { Request, Response } from 'express';
import * as fundRequestService from '../services/fundRequestService';
import asyncHandler from '../middleware/asyncHandler';
import type {
  CreateFundRequestInput,
  FundRequestFilters,
  UpdateFundRequestInput,
} from '../models/fundRequestModel';

export const index = asyncHandler(async (req: Request, res: Response) => {
  const rows = await fundRequestService.listFundRequests(
    req.query as FundRequestFilters
  );
  res.json(rows);
});

export const show = asyncHandler(async (req: Request, res: Response) => {
  const row = await fundRequestService.getFundRequest(req.params.id as string);
  res.json(row);
});

export const store = asyncHandler(async (req: Request, res: Response) => {
  const row = await fundRequestService.createFundRequest(
    req.body as CreateFundRequestInput
  );
  res.status(201).json(row);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const row = await fundRequestService.updateFundRequest(
    req.params.id as string,
    req.body as UpdateFundRequestInput
  );
  res.json(row);
});

export const destroy = asyncHandler(async (req: Request, res: Response) => {
  await fundRequestService.deleteFundRequest(req.params.id as string);
  res.status(204).send();
});
