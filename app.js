var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var theaterRouter = require("./routes/theater");
var studioRouter = require("./routes/studio");
var gateRouter = require("./routes/gate")
var channelRouter = require("./routes/channel")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', indexRouter);
app.use('/theater', theaterRouter);
app.use('/studio', studioRouter);
app.use('/gate', gateRouter)
app.use('/channel', channelRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.log("Erro capturado: " + err.message)
  console.log(err.stack)
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
