import { Router } from 'express';
import isAuthenticate from '../../../hooks/authentication/isAuthenticate';
import { Orders, Users } from '../../../models';

const searchOrder = Router();

// <---Busca y muestra todos las ordenes--->
searchOrder.get('/all', isAuthenticate, async (req, res) => {
  try {
    const orders = await Orders.findAll({
      include: {
        model: Users,
        attributes: ['id', 'name', 'lastname'],
      },
    });
    if (orders) {
      return res.send(orders);
    }
  } catch (e: any) {
    res.status(404).send(e.message);
  }
});

// <---Busca y muestra una orden especifica por id--->
searchOrder.get('/:id', isAuthenticate, async (req, res) => {
  const orderId = req.params.id;
  const order = await Orders.findOne({
    where: { id: orderId },
    include: {
      model: Users,
      attributes: ['id', 'name', 'lastname'],
    },
  });

  if (order) {
    return res.send({
      ...order.toJSON(),
      passengers: JSON.parse(order.passengers),
    });
  }
  return res.status(404).send('Orden no encontrada');
});

// <---Busca y muestra todos las ordenes de un usuario--->
searchOrder.get('/', isAuthenticate, async (req, res) => {
  try {
    const idUser = req.session.user.id;
    if (idUser) {
      const orders = await Orders.findAll({
        where: { user_id: idUser },
        include: {
          model: Users,
          attributes: ['id', 'name', 'lastname'],
        },
      });

      if (orders.length) {
        const newOrderSend = await orders.map((e: Orders) => {
          return { ...e.toJSON(), passengers: JSON.parse(e.passengers) };
        });
        return res.send(newOrderSend);
      }

      return res.send(orders);
    } else {
      res.status(401).send('No existe usuario');
    }
  } catch (e: any) {
    res.status(404).send(e.message);
  }
});

export default searchOrder;
