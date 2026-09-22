import { Router } from 'express';
import * as mosqueController from '../controllers/mosqueController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.get('/', mosqueController.index);
router.get('/:id', mosqueController.show);
router.post('/', requireAuth, mosqueController.store);
router.put('/:id', requireAuth, mosqueController.update);
router.delete('/:id', requireAuth, mosqueController.destroy);

export default router;
