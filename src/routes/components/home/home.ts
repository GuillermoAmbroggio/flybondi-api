import { Router } from 'express';
import redoc from 'redoc-express';

const home = Router();

home.get('/swagger.json', (req, res) => {
  if (req.session.user && req.session.user.role !== 'client') {
    res.sendFile('swagger.json', { root: '.' });
  } else {
    res.sendStatus(404);
  }
});

home.get('/docs', async (req, res, next) => {
  if (req.session.user && req.session.user.role !== 'client') {
    next();
  } else {
    res.render('home', { user: req.session.user });
  }
});

home.get(
  '/docs',
  redoc({
    title: 'API Docs',
    specUrl: '/home/swagger.json',
  }),
);

home.get('/', async (req, res) => {
  console.log(
    '################## HOME REQ SESSION USER',
    req.session,
    req.session.user,
  );
  if (req.session.user && req.session.user.role !== 'client') {
    res.redirect('/home/docs');
  } else {
    res.render('home', { user: req.session.user });
  }
});

export default home;
