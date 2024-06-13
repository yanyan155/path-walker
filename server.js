const express = require('express');
const config = require('./config/index');
const { userServices } = require('./services/userServices');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const auth = require('./middleware/auth');
const { logger } = require('./libs/logger');
const { wss, WebSocket, broadcast } = require('./socket.js');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');
const compiler = webpack(webpackConfig);

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: 'secret',
    sameSite: true,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    genid: () => {
      return uuidv4();
    },
  })
);
wss;
app.get('/', auth.auth, function (req, res, next) {
  next();
});

app.post('/login', async (req, res, next) => {
  try {
    const data = await userServices.login(
      req.body.name,
      req.body.password,
      req.session
    );
    if (data?.isNewUser) {
      await broadcast(wss, WebSocket)('updateRoles', '', { users: data.users });
    }
    res.status(200);
    res.end();
  } catch (error) {
    logger.error(error);
    res.set('Content-Type', 'text/plain');
    res.status(403).send('wrong login / password').end();
  }
});

app.post('/logout', async (req, res, next) => {
  try {
    const name = req.session.name;
    req.session.destroy();
    await userServices.logoutUsers(name);

    let data = {
      users: [{ name: name }],
    };
    await broadcast(wss, WebSocket)('logout', '', data);

    res.status(200);
  } catch (error) {
    logger.error(error);
    res.status(403);
  }
  res.redirect('/');
});

app.post('/createFile', auth.adminAction, async (req, res, next) => {
  try {
    await userServices.createFile(
      req.body.isDirectory === 'true',
      req.body.text,
      req.body.path
    );
    broadcast(wss, WebSocket)(
      'added',
      findPath(req.body.path),
      findFileName(req.body.path)
    );
    res.status(200);
    res.end();
  } catch (error) {
    logger.error(error);
    res.status(403);
    res.end('wrong login / password');
  }
});

app.get(/^\/search/, async (req, res, next) => {
  let files;
  const check = await userServices.checkuser(req.session.id);
  try {
    if (decodeURIComponent(req.query.q) !== '/') {
      files = await userServices.getData(
        decodeURIComponent(req.query.q),
        req.query.type,
        check?.isAdmin
      );
    } else {
      files = await userServices.getDiscs(check?.isAdmin);
    }
    res.set('content-type', 'json; charset=utf-8');
    res.end(files);
  } catch (error) {
    logger.error(error);
    res.status(403);
    res.end('do not allowed access');
  }
});

app.get(/^\/stats/, async (req, res, next) => {
  try {
    const stats = await userServices.sendStats(decodeURIComponent(req.query.q));
    res.set('content-type', 'json; charset=utf-8');
    res.end(stats);
  } catch (error) {
    logger.error(error);
    res.status(403);
    res.end('do not allowed access');
  }
});

app.post(/^\/deleteFile/, auth.adminAction, async (req, res, next) => {
  try {
    await userServices.deleteFile(
      req.body.path,
      req.body.isDirectory === 'true'
    );

    broadcast(wss, WebSocket)(
      'deleted',
      findPath(req.body.path),
      findFileName(req.body.path)
    );

    res.end('success');
  } catch (error) {
    logger.error(error);
    res.status(403);
    res.end('something went wrong');
  }
});

app.post(/^\/updateRoles/, auth.adminAction, async (req, res, next) => {
  try {
    const changedRoleUsers = JSON.parse(req.body.users);
    const users = await userServices.updateRolesService(changedRoleUsers);
    let data = {
      users,
      usersToReload: changedRoleUsers,
    };
    await broadcast(wss, WebSocket)('updateRoles', '', data);
    res.end('success');
  } catch (error) {
    logger.error(error);
    res.status(403);
    res.end('something went wrong');
  }
});

app.get(/^\/receiveUsers/, auth.adminAction, async (req, res, next) => {
  try {
    const users = await userServices.receiveUsers();
    users.forEach(el => delete el.sessionId);
    res.set('content-type', 'json; charset=utf-8');
    res.end(JSON.stringify(users));
  } catch (error) {
    logger.error(error);
    res.status(403);
    res.end('something went wrong');
  }
});

// https://3body-net.medium.com/building-a-dev-server-with-express-and-webpack-761704f0c66a
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
  })
);
app.use(webpackHotMiddleware(compiler));
// app.use(express.static(`${__dirname}/dist`));

const server = app.listen(config.port);
server.once('connection', async () => {
  await userServices.logoutUsers();
});

app.use((err, req, res, next) => {
  if (err) {
    logger.error(err);
  }
  res.status(500);
  res.end('server error');
});

function findPath(path) {
  const index = path.lastIndexOf('/');
  if (path[index - 1] === ':') {
    return path.slice(0, index + 1);
  }
  return path.slice(0, index);
}

function findFileName(path) {
  const index = path.lastIndexOf('/');
  const name = path.slice(index + 1);
  return {
    name: name,
  };
}
