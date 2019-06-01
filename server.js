const express = require("express");
const app = express();
const namespaces = require('./data/namespaces');

app.use(express.static(__dirname + '/public'));


const socketio = require('socket.io');
const port = process.env.PORT || 8080;

const server = app.listen(port);
const io = socketio(server);

io.on('connection',(socket)=>{
  let nsData = namespaces.map((ns)=>{
    return {
      img:ns.img,
      endpoint:ns.endpoint
    }
  });
//console.log(nsData);
//will send data to this client so we connect to socket not io
  socket.emit('namespaces',nsData);
});

namespaces.forEach((namespace)=>{
  io.of(namespace.endpoint).on('connection',(nsSocket)=>{
    //console.log(`${nsSocket.id} has join ${namespace.endpoint}` );

    nsSocket.emit('nsLoadRoom',namespaces[0].rooms);

    nsSocket.on('joinRoom',(roomtoJoin,noOfUsersCb)=>{
      nsSocket.join(roomtoJoin);
      // io.of('/wiki').in(roomtoJoin).clients((err,clients)=>{
      //   noOfUsersCb(clients.length)
      // })

      const nsRoomServer = namespaces[0].rooms.find((room)=>{
        return room.roomTitle === roomtoJoin;
      });
      console.log("NsRoom ",nsRoomServer);
      nsSocket.emit('roomHistoryCatchUp',nsRoomServer.history);
      //we need to send no of users in this room to all sockets connected to this room
      io.of('/wiki').in(roomtoJoin).clients((err,clients)=>{
        console.log(clients.length);
        io.of('/wiki').in(roomtoJoin).emit('updateClientsNumber',clients.length);
      })

    })

    nsSocket.on('newMessageToServer',(msg)=>{
      const fullMsg = {
        text:msg.text,
        time:Date.now(),
        username:'sai',
        avatar:'https://via.placeholder.com/30'
      }
     // console.log(msg);
      const roomTitle = Object.keys(nsSocket.rooms)[1];
      //we need to find the room object for this room
      const nsRoom = namespaces[0].rooms.find((room)=>{
        return room.roomTitle === roomTitle;
      });
      nsRoom.addMessage(fullMsg);
      //console.log("nsRoom tets",nsRoom);
      io.of('/wiki').to(roomTitle).emit('msgToCLients',fullMsg);
    })
    //A socket has connected to one of chat group name spaces
    //send the ns group info back 
    //socket always joins its own room on connection

  })
})


