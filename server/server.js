import express from 'express';
import { Server} from 'socket.io';
import {createServer} from 'http';

const port = 3000;
const app = express();
const server = createServer(app);

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    },
});


app.get('/', (req,res) =>{
    res.send("Hellow")
}) 

io.on("connection", (socket)=>{
    console.log("new socket connected");
    console.log(socket.id);

    socket.on("message", ({username, message, room})=>{
        io.to(room).emit("receive-message",{username, message});
    })

    socket.on("join-room", (room )=>{
        socket.join(room);
    })
    
})

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
})