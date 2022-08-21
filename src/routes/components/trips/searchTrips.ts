import { Router, Request, Response } from 'express';
import { sequelize } from '../../../db/sequalize';
import { Trips } from '../../../models';

const searchTrips = Router();

// <---Busca y muestra todos los vuelos --->
searchTrips.get(
  '/' /* , isAuthenticate */,
  async (
    req: Request<
      {
        page: string;
        price_min: number;
        price_max: number;
        passengers: number;
        city_from: string;
        city_to: string;
        date_since: string;
        date_to: string;
        sort_by?: 'price' | 'data';
        sort_type?: 'ASC' | 'DESC';
      },
      {},
      {}
    >,
    res: Response,
  ) => {
    try {
      const { API_URL_DEV } = process.env;
      const {
        page,
        price_min,
        passengers,
        price_max,
        city_from,
        city_to,
        date_since,
        sort_by,
        sort_type,
      } = req.query;
      const url = API_URL_DEV;
      let trips: Trips[] | [] = [];
      let queryText = `SELECT * FROM "Trips" WHERE availability >= ${
        passengers && passengers !== 'undefined' ? passengers : 1
      } `;

      if (price_min) {
        queryText = queryText + `AND price >= ${price_min}`;
      }
      if (price_max) {
        queryText = queryText + ` AND price <= ${price_max}`;
      }

      if (city_from) {
        queryText = queryText + ` AND origin = '${city_from}'`;
      }

      if (city_to) {
        queryText = queryText + ` AND destination = '${city_to}'`;
      }

      if (date_since) {
        queryText = queryText + ` AND data >= '${date_since}'`;
      }

      if (sort_by) {
        queryText = queryText + ` ORDER BY ${sort_by} ${sort_type ?? 'ASC'}`;
      }

      if (
        price_max ||
        price_min ||
        passengers ||
        city_from ||
        city_to ||
        sort_by ||
        date_since
      ) {
        const values: any = await sequelize.query(queryText);
        trips = values[0];
      } else {
        trips = await Trips.findAll();
      }

      const resultsPerPage = 10; // maximo 10 por pagina.
      const totalPage = Math.ceil(trips.length / resultsPerPage) || 1;
      let selectPage = page && page !== 'undefined' ? Number(page) : 1;
      if (selectPage > totalPage) {
        selectPage = totalPage;
      }
      res.json({
        count: trips.length,
        next:
          selectPage === totalPage
            ? null
            : `${url}/trips?page=${selectPage + 1}`,
        previous:
          selectPage === 1 ? null : `${url}/trips?page=${selectPage - 1}`,
        last_page: totalPage,
        results: trips.slice(
          selectPage * resultsPerPage - resultsPerPage,
          selectPage * resultsPerPage,
        ),
      });
    } catch (e) {
      res.status(404).send(e);
    }
  },
);

// <---Busca y muestra el vuelo mas caro y el mas barato--->
searchTrips.get(
  '/min-max-price',
  /* isAuthenticate, */ async (req, res) => {
    try {
      const min = await Trips.min('price'); // db.Message.max('id');

      const max = await Trips.max('price'); // db.Message.max('id');
      res.send({ min, max });
    } catch (e) {
      res.status(404).send(e);
    }
  },
);

export default searchTrips;
