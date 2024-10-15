/*const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  },
});

let waitingPlayer = null;
let rooms = 0;

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  socket.on('join_game', (data) => {
    const playerName = data.playerName;

    if (waitingPlayer) {
      // Create a room and join both players
      rooms++;
      const roomId = `room-${rooms}`;
      socket.join(roomId);
      waitingPlayer.socket.join(roomId);

      // Notify both players they are in a room
      socket.emit('opponent-connected', { opponentName: waitingPlayer.name, roomId });
      waitingPlayer.socket.emit('opponent-connected', { opponentName: playerName, roomId });

      // Clear waiting player
      waitingPlayer = null;
    } else {
      // If no player is waiting, make this player the waiting one
      waitingPlayer = { socket, name: playerName };
      socket.emit('waiting_for_opponent');
    }
  });

  socket.on('player-move', (data) => {
    const { roomId, newGameStatus, nextPlayer } = data;
    // Emit the move to the opponent in the same room
    socket.to(roomId).emit('opponent-move', { newGameStatus, nextPlayer });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
    if (waitingPlayer && waitingPlayer.socket.id === socket.id) {
      waitingPlayer = null;  // Clear waiting player if they disconnect
    }
    // Notify the opponent if a player disconnects during a game
    const rooms = Object.keys(socket.rooms);
    rooms.forEach(room => {
      if (room !== socket.id) {
        socket.to(room).emit('opponent-disconnected');
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});*/
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  },
});

let waitingPlayer = null;
let rooms = 0;

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  socket.on('join_game', (data) => {
    const playerName = data.playerName;

    if (waitingPlayer) {
      // Create a room and join both players
      rooms++;
      const roomId = `room-${rooms}`;
      socket.join(roomId);
      waitingPlayer.socket.join(roomId);

      // Randomly decide who starts first
      const startFirst = Math.random() < 0.5;

      // Notify both players they are in a room
      socket.emit('opponent-connected', { opponentName: waitingPlayer.name, roomId, startFirst: startFirst });
      waitingPlayer.socket.emit('opponent-connected', { opponentName: playerName, roomId, startFirst: !startFirst });

      // Clear waiting player
      waitingPlayer = null;
    } else {
      // If no player is waiting, make this player the waiting one
      waitingPlayer = { socket, name: playerName };
      socket.emit('waiting_for_opponent');
    }
  });

  socket.on('player-move', (data) => {
    const { roomId, newGameStatus, nextPlayer } = data;
    // Emit the move to the opponent in the same room
    socket.to(roomId).emit('opponent-move', { newGameStatus, nextPlayer });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
    if (waitingPlayer && waitingPlayer.socket.id === socket.id) {
      waitingPlayer = null;  // Clear waiting player if they disconnect
    }
    // Notify the opponent if a player disconnects during a game
    const rooms = Object.keys(socket.rooms);
    rooms.forEach(room => {
      if (room !== socket.id) {
        socket.to(room).emit('opponent-disconnected');
      }
    });
  });
  
  socket.on('start_rematch', (data) => {
    const { roomId } = data;

    io.to(roomId).emit('rematch_start', {
        message: "The game is starting again!",
    });
});

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});