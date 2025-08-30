var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let multer = require("multer")
require("dotenv").config()

var indexRouter = require('./routes/index');
var theaterRouter = require("./routes/theater");
var studioRouter = require("./routes/studio");
var gateRouter = require("./routes/gate")
var channelRouter = require("./routes/channel")
let configurationsRouter = require("./routes/configurations")

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
app.use("/configurations", configurationsRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Middleware de captura de erros

app.use((error, req, res, next) => { // caso seja um erro multer, esse middleware vai lidar
  if (error instanceof multer.MulterError) {
    return res.status(400).json({reason: error.message})
  }
 
  next(error) // caso não seja um erro multer, apssa pro middleware de erro genérico
}) 


app.use((err, req, res, next) => {
  console.error("🔴 Erro capturado no middleware de erro:");
  console.error(err); // log completo do erro

  // Tente renderizar uma view de erro, mas com fallback
  try {
    res.status(err.status || 500).render('error', { message: err.message || "Erro interno do servidor", error: err });
  } catch (e) {
    console.error("⚠️ Falha ao renderizar a view de erro:", e);
    res.status(500).send("Erro interno ao processar o erro.");
  }
});


module.exports = app;
