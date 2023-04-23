require('dotenv').config();
//console.log(process.env.HARPERDB_URL);

const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const leaveRoom = require('./utils/leave-room');
const harperSaveMessage = require('./services/harper-save-message');
const harperGetMessages = require('./services/harper-get-messages');
const harperRegisterUser = require('./services/harper-register-user');
const harperGetUsername = require('./services/harper-get-username');
const harperGetUserPass = require('./services/harper-get-user-pass');

app.use(cors()); // Add cors middleware

const server = http.createServer(app);



const ioServer = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

const CHAT_BOT = 'ChatBot';

let chatRoom = ''
let allUsers = [];


const { response } = require('express');

ioServer.on('connection', (socket) =>{
    console.log(`User connected ${socket.id}`);
    // Add user to a room
    socket.on('join_room', (data) => {
        const { username, room } = data;
        
        socket.join(room);

        let __createdtime__ = Date.now();

        socket.emit('receive_message', {
            message: `Welcome to ${room} room, ${username}`,
            username: CHAT_BOT,
            __createdtime__,

        });

        chatRoom = room;
        allUsers.push({ id: socket.id, username, room});
        chatRoomUsers = allUsers.filter((user) => user.room === room);
        socket.to(room).emit('chatroom_users', chatRoomUsers);
        socket.emit('chatroom_users', chatRoomUsers);

        harperGetMessages(room)
            .then((last10Messages) => {
                socket.emit('last_100_messages', last10Messages)
            })
            .catch((error) => console.log(error));
  });
  //for login
  socket.on('login_check_user', (data) =>{
    const { username, password } = data;
    harperGetUserPass(username, password)
        .then((response) => {
            const parsedData = JSON.parse(response)
            const userName = parsedData[0].username
            const passWord = parsedData[0].password
            console.log('login', parsedData.length)
            if(parsedData.length > 0){
                console.log('if block')
                socket.emit("change_directory_to_room_lobby", (userName))
            }else{
                return
            }
        })
        .catch((err) => console.log(err))


  })
  //for registration
  socket.on('check_for_user', (data) =>{
        //TODO
        const { username, password } = data;
        harperGetUsername(username)
        .then((response) => {
            //const data = JSON.parse(response);
            //const username = data["username"]
            const parsedData = JSON.parse(response);
            //const userName = parsedData[0].username;
            //console.log(typeof(userName))
            console.log('hello', parsedData.length)

            if(parsedData.length === 0){
                console.log("if block")
                //socket.emit('register_user', data); //make a socket.on inside register index and compare them
                harperRegisterUser(username, password)
                .then((response) => {
                    socket.emit("change_directory_to_login", (response));
                    console.log(response)})
                .catch((err) => console.log(err));


            }else{
                return
            }
            
        })
        //.then((data) => console.log('You are here: ', data.username))
        .catch((err) => console.log(err));
  })

  /*
  socket.on('register_user', (data) => {
    const { username, password } = data;
    //store socket.id into a variable then pass it into the function
    const id = socket.id;

    console.log(`Your id is ${socket.id}, username is ${username}, and password is ${password} `);

    //call the services function here...
    
   
        

    harperGetUsername(username)
        .then((response) => {
            //const data = JSON.parse(response);
            //const username = data["username"]
            //const parsedData = JSON.parse(response);
            //const userName = parsedData.username;
            console.log(response)
            socket.emit('registered_username', response); //make a socket.on inside register index and compare them
        })
        //.then((data) => console.log('You are here: ', data.username))
        .catch((err) => console.log(err));

        

    
  }) */
  

  socket.on('send_message', (data) => {
    const { message, username, room, __createdtime__ } = data;
    ioServer.in(room).emit('receive_message', data);
    harperSaveMessage(message, username, room, __createdtime__)
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
  });

  socket.on('leave_room', (data) => {
    const { username, room } = data;
    socket.leave(room);
    const __createdtime__ = Date.now();

    allUsers = leaveRoom(socket.id, allUsers);
    socket.to(room).emit('chatroom_users', allUsers);
    socket.to(room).emit('receive_message', {
        username: CHAT_BOT,
        message: `${username} has left the chat`,
        __createdtime__,
    });
    console.log(`${username} has left the chat`);
  })

  socket.on('disconnect', () => {
    //const { username, room} = data;
    //console.log(`${username} has been disconnected(${room} room)`)

    const user = allUsers.find((user) => user.id == socket.id);
    if(user?.username) {
        allUsers = leaveRoom(socket.id, allUsers);
        socket.to(chatRoom).emit('chatroom_users', allUsers);
        socket.to(chatRoom).emit('receive_message', {
            //username: CHAT_BOT,
            message: `${user.username} has been disconnected from the chat room(${user.room} room)`,
            //__createdtime__,
        });
    }
  } )
});



server.listen(4000, () => 'Server is running on port 4000');