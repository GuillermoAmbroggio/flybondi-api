import { Router } from 'express';

import createOrder from './createOrder';
import searchOrder from './searchOrders';

const orders = Router();

orders.use('', createOrder);
orders.use('', searchOrder);

export default orders;
