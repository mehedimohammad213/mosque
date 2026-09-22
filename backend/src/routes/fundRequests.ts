import { Router } from 'express';
import * as fundRequestController from '../controllers/fundRequestController';

const router = Router();

router.get('/', fundRequestController.index);
router.get('/:id', fundRequestController.show);
router.post('/', fundRequestController.store);
router.put('/:id', fundRequestController.update);
router.delete('/:id', fundRequestController.destroy);

export default router;
