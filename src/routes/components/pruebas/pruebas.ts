import { Router } from 'express';
import useHashPassword from '../../../hooks/authentication/useHashPassword';
import { Users } from '../../../models';
import bcrypt from 'bcrypt';

const pruebas = Router();

pruebas.get('/cargarBD', async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('Asd12345', salt);

    //CREO DATOS SOLO PARA PROBRAR:
    const user1 = await Users.create({
      name: 'guille',
      lastname: 'ambroggio',
      email: 'guille@gmail.com',

      password: hash, // "Asd12345",
      role: 'admin',
    });

    res.send('ok');
  } catch (e: any) {
    res.status(404).send(e.message);
  }
});

export default pruebas;
