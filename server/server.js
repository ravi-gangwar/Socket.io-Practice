import Express from "express";
import Cors from "cors";

import { Server } from "socket.io";
import {createServer} from "http";
import { SocketAddress } from "net";

import jwt from "jsonwebtoken";

const PORT = 3000;

const app = Express();
const server = createServer(app);
app.use(Cors());
const io = new Server(server, {
    cors :{
        origin: "http://localhost:5173",
        methods : ["GET", "POST"],
        credentials : true
    }
})

// const user = false;
// io.use((socket, next)=> {
//     if(user) next();
// })

app.get("/", (req, res)=>{
    res.send("Hello")
})
const secretKeyJWT = "qwerty";
app.get("/login", (req, res)=>{
    const token = jwt.sign({_id: "qwerty"}, secretKeyJWT)
    res.cookie("token", token, {httpOnly: true, secure: true, sameSite: "none"})
    .json({
        message : "Login Success"
    })
})

io.on("connection", (socket)=> {
    console.log("User Connected and id is", socket.id);
    socket.emit("welcome", "Welcome to the server")
    // socket.broadcast.emit("welcome", `${socket.id} joined the server`)
    socket.on("message", ({txt, roomID})=> {
        console.log(txt)
        // io.emit("to-everyone", msg)
        // io.broadcast.emit("baki-sab-ko", msg)
        io.to(roomID).emit("another-one", txt)
    });


    socket.on("disconnect", ()=> {
        console.log("User Disconnected: ", socket.io);
    })
})







server.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})