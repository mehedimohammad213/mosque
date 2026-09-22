import { Router } from 'express';
import * as fundRequestController from '../controllers/fundRequestController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.get('/', fundRequestController.index);
router.get('/:id', fundRequestController.show);
router.post('/', requireAuth, fundRequestController.store);
router.put('/:id', requireAuth, fundRequestController.update);
router.delete('/:id', requireAuth, fundRequestController.destroy);

export default router;
