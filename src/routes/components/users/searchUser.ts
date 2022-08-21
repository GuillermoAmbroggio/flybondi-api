import { Router } from 'express';
import isAuthenticate from '../../../hooks/authentication/isAuthenticate';
import { Users } from '../../../models';

const searchUser = Router();

// <---Busca y muestra todos los usuarios--->
searchUser.get('/allusers', isAuthenticate, async (req, res) => {
  const { ENV, API_URL_DEV, API_URL_PROD } = process.env;
  const url = ENV === 'development' ? API_URL_DEV : API_URL_PROD;
  const users = await Users.findAll();
  const resultsPerPage = 10; // maximo 10 por pagina.
  const totalPage = Math.ceil(users.length / resultsPerPage) || 1;
  let selectPage = req.query.page ? Number(req.query.page) : 1;
  if (selectPage > totalPage) {
    selectPage = totalPage;
  }
  res.json({
    count: users.length,
    next:
      selectPage === totalPage ? null : `${url}/users?page=${selectPage + 1}`,
    previous: selectPage === 1 ? null : `${url}/users?page=${selectPage - 1}`,
    results: users
      .slice(
        selectPage * resultsPerPage - resultsPerPage,
        selectPage * resultsPerPage,
      )
      .map((user) => {
        return { ...user.toJSON(), password: undefined, role: undefined }; // Con esto se evita mostrar password & role.
      }),
  });
});

// <---Busca y muestra un usuario especifico--->
searchUser.get('', isAuthenticate, async (req, res) => {
  const idUser = req.session.user.id;
  const user = await Users.findByPk(idUser);

  if (user) {
    return res.send({ ...user.toJSON(), password: undefined, role: undefined });
  }
  return res.status(404).send('User not found');
});

export default searchUser;
