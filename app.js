const config = require('./config/config');
const express = require('express');
const corsHelper = require('./helpers/cors.helper');
const gracefulExit = require('express-graceful-exit');
const port = process.env.PORT || 8080;
const ip = config.ip;
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('./helpers/logger.helper');
const routes = require('./routes');
const spreadSheet = require('./utils/spreadsheets/init');

//defining middle-wares
app.use(express.json());
app.use(corsHelper);

// Sanity route to check if backend is up
app.get('/sanity', (req, res) => {
  res.send("YAY it's working");
});

// Initialise routes
app.use('/', routes);

//Start listning to server
server.listen(port, ip, () => {
  logger.info(`Listening to server at ${ip}:${port}`);
});

spreadSheet();

// CHECKME : initialise graceful shutdown
(gracefulShutdown = app => {
  app.use(gracefulExit.middleware(app));
  process.on('SIGINT', () => {
    logger.info('Server recieved stop signal ... :[ ');
    gracefulExit.gracefulExitHandler(app, server, {
      socketio: app.settings.socketio,
      suicideTimeout: 10 * 1000,
      logger: logger.info,
      log: true,
    });
  });

  process.on('SIGTERM', () => {
    logger.info('Server recieved stop signal ... :[ ');
    gracefulExit.gracefulExitHandler(app, server, {
      socketio: app.settings.socketio,
      suicideTimeout: 10 * 1000,
      logger: logger.info,
      log: true,
    });
  });
})(app);
