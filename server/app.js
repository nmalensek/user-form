//const createError = require('http-errors');
const path = require('path');
const bodyParser = require('body-parser');
const winston = require('winston');
const fse = require('fs-extra');
const validation = require('express-validator');

const logger = new winston.createLogger({
  level: 'debug',
  transports: [
    new (winston.transports.File)({ filename: 'user_form.log', maxsize: 10000000}),
  ]
});

// log to console during dev
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const loggerWrapper = require('./errorWrapper')(logger);

//using a file as a simple database for the moment, make sure the file's there.
const dataPath = './model/user-entries/user.entries.json';
fse.ensureFileSync(dataPath);

const express = require('express');
const app = express();

//user page will be the index.
const userModel = require('./model/user.model')(dataPath, fse, loggerWrapper);
const usersRouter = require('./routes/users')(
                    userModel, express, validation, loggerWrapper);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public', 'index.html')));

app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const server = app.listen(8080);
console.log('server initialized and listening...');

process.on('SIGINT', () => {
  loggerWrapper.error('closing server');
  process.exit();
});

module.exports = app;
