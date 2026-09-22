import { Router } from 'express';
import * as paymentAccountController from '../controllers/paymentAccountController';

const router = Router();

router.get('/', paymentAccountController.index);
router.get('/:id', paymentAccountController.show);
router.post('/', paymentAccountController.store);
router.put('/:id', paymentAccountController.update);
router.delete('/:id', paymentAccountController.destroy);

export default router;
