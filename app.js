const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const logger = require('morgan');
const routes = require('./routes/index');
const books = require('./routes/books');

const app = express();

const { sequelize, Book } = require('./models');

(async () => {
    console.log('Testing the connection to the database...');
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  })();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/books', books);

// catch 404 and forward to error handler
app.use( (req, res, next) => {
    next(createError(404, 'This page could not be located'));
});

// error handler
app.use((err, req, res, next) => {
    //set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    if (err.status === 404) {
        res.render('./books/page-not-found', { err });
    } else {
        res.status(err.status || 500);
        res.render('error', { err })
    }
});

module.exports = app;