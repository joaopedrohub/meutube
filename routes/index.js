var express = require('express');
var router = express.Router();

joaop0504 = [
    "joaop0504fasdjcuiasouioasoncassndc",
    "#459323",
    
]

canal2 = [
  "canal2",
  "#49c221",

]

var videos = [

  {
    title: "Acabei de criar o melhor jogo de todos!",
    thumbnail: "/thumb1.png",
    by: joaop0504,
    views: 32190,
    id: "fd89as0uc8"
  },
  {
    title: "Esse é o melhor jogo que já joguei!",
    thumbnail: "/thumb2.png",
    by: canal2,
    views: 11,
    id: "afdsa780ch0"
  },

]


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {videos: videos});
});

module.exports = router;
