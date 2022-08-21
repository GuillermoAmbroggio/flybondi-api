import { Router } from 'express';
import createUser from './createUser';
import searchUser from './searchUser';

const users = Router();

users.use('', searchUser);
users.use('', createUser);

export default users;
