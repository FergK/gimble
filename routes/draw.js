var express = require('express');
var router = express.Router( {mergeParams: true} );

var rooms = {};
router.get(['/', '/:roomId'], function(req, res, next) {

  var room = req.params.roomId;

  if ((room === 'new') || (room === undefined) ){

    var roomIdLength = 6;
    var roomIdChars = 'ABCDEFGHJIKLMNOPQRSTUVWXYZ';
    var newRoomId;

    while ( true ) {
      newRoomId = '';

      for (var i = 0; i < roomIdLength; i++) {
        newRoomId += roomIdChars[Math.floor(Math.random() * roomIdChars.length)];
      }

      if (rooms[newRoomId] === undefined) {
        break;
      }
    }

    room = newRoomId;
    rooms[room] = { users: {} };

    console.log('Created room: ' + room);

    res.redirect('/draw/' + room);

  } else if (rooms[room] === undefined) {

    res.redirect('/roomNotFound/' + room);

  } else {

    var users = rooms[room].users;

    res.io.once('connection', function(socket){

      users[socket.id] = { name: 'Cool Person' };
      socket.join(room);
      
      socket.broadcast.to(room).emit('userConnectIn', socket.id);

      console.log(room + ' - ' + socket.id + ' - Connect');

      socket.on('disconnect', function(){
        socket.broadcast.to(room).emit('userDisconnectIn', socket.id);
        delete users[socket.id];
        console.log(room + ' - ' + socket.id + ' - Disconnect');

        // if ( Object.keys(users).length === 0 ) {
        //   delete rooms[room];
        //   console.log('Destroyed room: ' + room);
        // }
      });

      socket.on('brushDownOut', function(msg){
        socket.broadcast.to(room).emit('brushDownIn', socket.id + ',' + msg);
        console.log(room + ' - ' + socket.id + ' - brushDownOut - ' + msg);
      });

      socket.on('brushMoveOut', function(msg){
        socket.broadcast.to(room).emit('brushMoveIn', socket.id + ',' + msg);
        console.log(room + ' - ' + socket.id + ' - brushMoveOut - ' + msg);
      });
      
    });

    var roomLink = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log("roomLink" + roomLink)

    res.render('draw', { title: 'Draw', room: room, roomLink: roomLink });

  }

});

module.exports = router;
