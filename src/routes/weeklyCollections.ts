import { Router } from 'express';
import * as weeklyCollectionController from '../controllers/weeklyCollectionController';

const router = Router();

router.get('/', weeklyCollectionController.index);
router.get('/:id', weeklyCollectionController.show);
router.post('/', weeklyCollectionController.store);
router.put('/:id', weeklyCollectionController.update);
router.delete('/:id', weeklyCollectionController.destroy);

export default router;
