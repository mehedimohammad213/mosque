import type { Request, Response } from 'express';
import * as paymentAccountService from '../services/paymentAccountService';
import asyncHandler from '../middleware/asyncHandler';
import type {
  CreatePaymentAccountInput,
  PaymentAccountFilters,
  UpdatePaymentAccountInput,
} from '../models/paymentAccountModel';

export const index = asyncHandler(async (req: Request, res: Response) => {
  const rows = await paymentAccountService.listPaymentAccounts(
    req.query as PaymentAccountFilters
  );
  res.json(rows);
});

export const show = asyncHandler(async (req: Request, res: Response) => {
  const row = await paymentAccountService.getPaymentAccount(
    req.params.id as string
  );
  res.json(row);
});

export const store = asyncHandler(async (req: Request, res: Response) => {
  const row = await paymentAccountService.createPaymentAccount(
    req.body as CreatePaymentAccountInput
  );
  res.status(201).json(row);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const row = await paymentAccountService.updatePaymentAccount(
    req.params.id as string,
    req.body as UpdatePaymentAccountInput
  );
  res.json(row);
});

export const destroy = asyncHandler(async (req: Request, res: Response) => {
  await paymentAccountService.deletePaymentAccount(req.params.id as string);
  res.status(204).send();
});
