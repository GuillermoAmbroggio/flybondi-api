import app from './src/app';
import { sequelize } from './src/db/sequalize';
import { Trips } from './src/models';
import dataJson from '../dataset.json';

import dotenv from 'dotenv';
dotenv.config();

const port: number = Number(process.env.PORT) || 8000;

(async () => {
  await sequelize.sync({ force: true });
  const loadData = async () => {
    const trips = await Trips.findAll();
    if (!trips.length) {
      console.log('Intento cargar la base de datos');
      await dataJson.forEach((element) => {
        Trips.create(element);
      });
      return console.log('La base de datos se cargo exitosamente');
    } else {
      return console.log('La base de datos ya estaba cargada');
    }
  };
  app.listen(port, async () => {
    await loadData();
    console.log(`
    ###############################
    ###### listening at ${port} ######
    ###############################
    `);
  });
})();
