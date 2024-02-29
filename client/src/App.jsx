import React, { useEffect, useMemo, useState } from 'react';
import { io } from "socket.io-client";

function App() {
  const socket = useMemo(()=> io("http://localhost:3000"), []);
  const [txt, setTxt] = useState("");
  const [msg, setMsg] = useState([]);
  const [SocketID, SetSocketID] = useState();
  const [roomID, setRoomID] = useState()
  useEffect(() => {
    socket.on("connect", () => {
      SetSocketID(socket.id)
      console.log("Connected", socket.id);
    });
    socket.on("to-everyone", (msg)=>{
      setMsg(msg)
    })
    socket.on("another-one", (msgs) => {
      setMsg((prevMsg) => [...prevMsg, msgs]);
    })
    socket.on("welcome", (msg) => {
      console.log(msg + " :" + socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const formHandler = (e) => {
    e.preventDefault();
    socket.emit("message", {txt, roomID})
    setTxt("");

  }

  return (
    <div>
        <h3>{SocketID}</h3>
        <input onChange={(e)=> setRoomID(e.target.value)} value={roomID} type="text" name="text"/>
        <input onChange={(e)=> setTxt(e.target.value)} value={txt} type="text" name="text"/>
        <button type='submit' onClick={formHandler}>Submit</button>
        <br />
        <h1>{msg}</h1>
    </div>
  );
}

export default App;
