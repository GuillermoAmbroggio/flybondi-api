import { Router, Request } from 'express';

import { validateEmptyField } from '../../../hooks/validations/useValidations';
import { Orders, Users } from '../../../models';
import isApiKey from '../../../hooks/authentication/isApiKey';
import { OrdersAttributes } from '../../../models/orders/orders.types';

const createOrder = Router();

// <---Crea clientes nuevos--->
createOrder.post(
  '',
  isApiKey,
  async (req: Request<{}, {}, OrdersAttributes>, res) => {
    try {
      const idUser = req.session?.user?.id;
      const {
        data_go,
        destination,
        goBack,
        origin,
        passengers,
        total,
        data_back,
      } = req.body;

      const objNotNull = {
        destination,
        data_go,
        origin,
        passengers,
        total,
      };

      /* Reviso los campos requeridos  */
      const errorResponse = validateEmptyField(objNotNull);
      if (errorResponse) {
        return res.status(404).send(errorResponse);
      }

      /* Si existe goBack tiene que venir fecha de regreso */
      if (goBack) {
        if (!data_back) {
          return res
            .status(404)
            .send(
              'Es necesario marcar fecha de retorno o seleccionar pasajes solo de ida',
            );
        }
      }

      /* Si recibo usuario reviso en la bd si existe, si no existe devuelvo un error y no se crea la orden */
      if (idUser) {
        const user = await Users.findOne({
          where: {
            id: idUser,
          },
        });
        /* si  existe el usuario, creo y le agrego la orden */
        if (user) {
          const newOrderUser = await Orders.create({
            origin,
            destination,
            data_go,
            passengers: JSON.stringify(passengers),
            total,
            goBack,
            data_back,
          });
          user.$add('orders', newOrderUser);
          newOrderUser.$set('user', user);

          /* Se creo la orden y la devuelvo*/
          return res.send({
            ...newOrderUser.toJSON(),
            passengers: JSON.parse(newOrderUser.passengers),
          });
        }
      }

      /* Si no se mando user_id entonces creo la orden pero no le asigno a ningun usuario */
      const newOrder = await Orders.create({
        origin,
        destination,
        data_go,
        passengers: JSON.stringify(passengers),
        total,
        goBack,
        data_back,
      });

      return res.send({
        ...newOrder.toJSON(),
        passengers: JSON.parse(newOrder.passengers),
      });
    } catch (error: any) {
      res.status(404).send(error.message);
    }
  },
);

export default createOrder;
