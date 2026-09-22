import { Router } from 'express';
import * as weeklyCollectionController from '../controllers/weeklyCollectionController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.get('/', weeklyCollectionController.index);
router.get('/:id', weeklyCollectionController.show);
router.post('/', requireAuth, weeklyCollectionController.store);
router.put('/:id', requireAuth, weeklyCollectionController.update);
router.delete('/:id', requireAuth, weeklyCollectionController.destroy);

export default router;
