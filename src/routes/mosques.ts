import { Router } from 'express';
import * as mosqueController from '../controllers/mosqueController';

const router = Router();

router.get('/', mosqueController.index);
router.get('/:id', mosqueController.show);
router.post('/', mosqueController.store);
router.put('/:id', mosqueController.update);
router.delete('/:id', mosqueController.destroy);

export default router;
