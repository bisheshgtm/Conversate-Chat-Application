const express = require('express');
const dotenv = require('dotenv');
const connectdb = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const path = require('path');


// creating an instance of express
dotenv.config();
connectdb();
const app = express();

app.use(express.json()); // to accept json data in the body from the frontend

app.get('/', (req, res) => {
    res.send('API is running');
});

// app.get('/api/chat', (req, res) => {
//     res.send(chats);
// });

// // get chat by id
// app.get('/api/chat/:id', (req, res) => {
//     const chat = chats.find((c) => c._id === req.params.id);
//     res.send(chat);
// });

// creating endpoint for user 
app.use('/api/user', userRoutes);
// chat routes
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);




// error handling 
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 1000; // if port is not defined in .env file, then use 3000

const server = app.listen(1000, () => {
    console.log(`Server is running on port ${port}`.yellow.bold);
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    }

});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});

/*
express to run the server
dotenv to read the environment variables
nodemon to run the server automatically when we make changes to the code
*/
