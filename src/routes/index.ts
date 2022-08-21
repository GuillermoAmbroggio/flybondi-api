import { Router } from 'express';

import {
  users,
  cookieAuth,
  home,
  tokenAuth,
  trips,
  orders,
} from './components';
import pruebas from './components/pruebas/pruebas';

const router = Router();

//Este eliminar:
router.use('/', pruebas);

router.use('/', cookieAuth);
router.use('/', tokenAuth);

router.use('/home', home);
router.use('/users', users);
router.use('/trips', trips);
router.use('/orders', orders);

export default router;
