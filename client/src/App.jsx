import React from "react";
import { useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";


const App = () => {
  const socket = useMemo(
    () =>
      io("http://localhost:3000"),
    []
  );

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [id, setId] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUserName] = useState("");

  
  useEffect(() => {
    socket.on("connect", () => {
      setId(socket.id);
    });
    
    socket.on("receive-message", (data)=>{
      setMessages((messages) => [...messages,data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message",{ username,message,room });
    setMessage("");
  };

  const handleJoinRoom = (e) =>{
    e.preventDefault();
    socket.emit("join-room", room);
  }
  var i = 0;
  return (
    <Container>
      <Typography>Your id on current connection is {id}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          id="outlined-basic"
          label="User Name"
          variant="outlined"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />
        <TextField
          id="outlined-basic"
          label="Message"
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant="outlined" type="submit">
          Send
        </Button>
      </form>

      <form onSubmit={handleJoinRoom}>
      <TextField
          id="outlined-basic"
          label="Room"
          variant="outlined"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <Button variant="outlined" type="submit">
          Join
        </Button>
      </form>
      <Stack>
        {messages.map((message) => (
          <Typography key={i++} variant="h6" component="div" gutterBottom>
            {message.username}: {message.message}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
