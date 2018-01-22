var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.io.once('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
      console.log('user disconnected');
    });

    socket.on('msgOut', function(msg){
      console.log('msgOut -- ' + socket.id + ' -- ' + msg);
      socket.broadcast.emit('msgIn', msg);
    });
    
  });

  res.render('truth', { title: 'Truth' });
});

module.exports = router;
