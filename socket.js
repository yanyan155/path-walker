const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8079 });
const { userServices } = require('./services/userServices');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const { logger } = require('./libs/logger');

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

wss.on('connection', async function connection(ws, req) {
  let cookiesParsed = cookie.parse(req.headers.cookie);
  const sid = cookieParser.signedCookie(cookiesParsed['connect.sid'], 'secret');

  try {
    const users = await userServices.receiveUsers();
    const user = users.find(el => el.sessionId?.some(elem => elem === sid));
    ws.name = user.name;
    ws.isAlive = true;
    ws.on('pong', heartbeat);

    ws.on('message', function incoming(message) {
      ws.send(message);
    });
  } catch (err) {
    logger.error(err);
    ws.terminate();
  }
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);

wss.on('close', function close() {
  clearInterval(interval);
});

function broadcast(wss, WebSocket) {
  return async function (type, path = '', data) {
    const tosend = {
      path: path,
      updateType: type,
    };
    if (data.users) {
      tosend.users = data.users;
      const isAdmins = data.users.filter(el => el.isAdmin);
      try {
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            if (
              (data?.usersToReload &&
                data?.usersToReload.some(el => el.name === client.name)) ||
              (type === 'logout' &&
                data.users.some(el => el.name === client.name))
            ) {
              tosend.updateType = 'reloadPage';
              client.send(JSON.stringify(tosend));
            } else if (isAdmins.some(el => el.name === client.name)) {
              client.send(JSON.stringify(tosend));
            }
          }
        });
      } catch (err) {
        logger.error(err);
      }
    } else if (type === 'added' || type === 'deleted') {
      tosend.name = data.name;
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(tosend));
        }
      });
    }
  };
}

module.exports.wss = wss;
module.exports.WebSocket = WebSocket;
module.exports.broadcast = broadcast;

// https://learn.javascript.ru/screencast/nodejs#nodejs-2-mongo-install
// https://github.com/yanyan155/express-chat/commit/206acfc2d76ec06a8403e7df74846018311a2a9f
// https://github.com/yanyan155/express-chat/commit/25953e629283070b0c7e0828419524038d7945c8
// https://github.com/yanyan155/express-chat/commit/2c00e6f76d02a75fbe35778ae4156c461c2a3d5c
// https://github.com/yanyan155/express-chat/commit/6814aee3b19d8931beb27182aa37afc1c93a1bc6

// https://www.npmjs.com/package/ws
// https://learn.javascript.ru/websocket
