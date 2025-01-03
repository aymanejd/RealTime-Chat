

import authRoutes from './Routes/auth.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { Dbconnect } from './configue/db.js';
import cookieparser from 'cookie-parser';
import MessageRoute from './Routes/message.js';
import bodyParser from 'body-parser';
import { app, server, io, getReceiverSocketId } from './configue/socketio.js';
import express from 'express';
import Notification from './Routes/notifications.js';
import path from 'path';

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
