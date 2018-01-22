var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.io.once('connection', function(socket){
    console.log('User connected: ' + socket.id);
    socket.broadcast.emit('userConnectIn', socket.id);

    socket.on('disconnect', function(){
      console.log('User disconnected: ' + socket.id);
      socket.broadcast.emit('userDisconnectIn', socket.id);
    });

    socket.on('brushDownOut', function(msg){
      console.log('brushDownOut -- ' + socket.id + ' -- ' + msg);
      socket.broadcast.emit('brushDownIn', socket.id + ',' + msg);
    });

    socket.on('brushMoveOut', function(msg){
      console.log('brushMoveOut -- ' + socket.id + ' -- ' + msg);
      socket.broadcast.emit('brushMoveIn', socket.id + ',' + msg);
    });

    // socket.on('brushUpOut', function(msg){
    //   console.log('brushUpOut -- ' + socket.id + ' -- ' + msg);
    //   socket.broadcast.emit('brushUpIn', socket.id + ',' + msg);
    // });
    
  });

  res.render('draw', { title: 'Draw' });
});

module.exports = router;
