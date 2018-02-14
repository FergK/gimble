var express = require('express');
var router = express.Router();

/* GET home page. */

router.get(['/', '/:roomId'], function(req, res, next) {
  var room = req.params.roomId;
  console.log('Room not found: ' + room);
  res.render('index', { title: 'Gimble', roomNotFound: room });
});

module.exports = router;
