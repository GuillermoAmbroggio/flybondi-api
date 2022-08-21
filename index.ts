import { sequelize } from './src/db/sequalize';
import { Trips } from './src/models';
import { TripsAttributes } from './src/models/trips/trips.types';
import 'dotenv/config';
import app from './src/app';
const { ENV } = process.env;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const dataJson: TripsAttributes[] = require('./src/db/dataset.json');
const port: number = Number(process.env.PORT) || 8000;

(async () => {
  await sequelize.sync({ force: ENV !== 'production' });
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
