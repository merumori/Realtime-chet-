require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: '*' },
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Real-time Chat Logic
let onlineUsers = {};          // { userId: socketId }
const onlineUserSet = new Set(); // [userId, userId, ...]

io.on('connection', (socket) => {
  console.log('New client connected');

  // When user joins
  socket.on('join', (userId) => {
    onlineUsers[userId] = socket.id;
    socket.userId = userId;
    onlineUserSet.add(userId);

    console.log(`User ${userId} joined`);
    io.emit('onlineUsers', Array.from(onlineUserSet)); // Broadcast online users
  });

  // When user sends a message
  socket.on('sendMessage', (msg) => {
    const to = onlineUsers[msg.receiverId];
    if (to) {
      io.to(to).emit('receiveMessage', msg);
    }
  });

  // When user disconnects
  socket.on('disconnect', () => {
    console.log('Client disconnected');

    for (const id in onlineUsers) {
      if (onlineUsers[id] === socket.id) {
        delete onlineUsers[id];
        onlineUserSet.delete(id);
        break;
      }
    }

    io.emit('onlineUsers', Array.from(onlineUserSet)); // Update all clients
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
