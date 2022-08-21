import { Router } from 'express';

import searchTrips from './searchTrips';

const trips = Router();

trips.use('', searchTrips);

export default trips;
