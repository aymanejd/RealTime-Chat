

const authRoutes = require('./Routes/auth.js');
const cors =require('cors')
const dotenv = require('dotenv');
const { Dbconnect } = require('./configue/db.js');
const cookieparser= require('cookie-parser')
const MessageRoute = require('./Routes/message.js');
const bodyParser = require('body-parser');
const { app, server, io, getReceiverSocketId } = require('./configue/socketio');
const express = require("express");
const Notification = require('./Routes/notifications.js');
const path =require('path');

dotenv.config()
const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../Frontend-Part/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../Frontend-Part", "dist", "index.html"));
    });
  }
const port = process.env.PORT;
app.use(express.json({
    limit: '5mb'
    }));app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(cookieparser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}))

app.get('/test', (req, res) => res.send("Server is working"));

app.use('/api/auth', authRoutes)
app.use('/api/messages', MessageRoute)
app.use('/api/notifications', Notification)

server.listen(port, () => {
    Dbconnect()
    console.log('server run test')
})
