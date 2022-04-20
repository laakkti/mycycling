const express = require('express');
const mongoose = require('mongoose');


const cors = require('cors');
require('dotenv').config();
const logger = require('./utils/logger')

const app = express();

//----------------------------------------------------------------
const http = require("http");
const server = http.createServer(app);
//const socketIo = require("socket.io")(server, {cors: {origin: "*"}});
//const io = socketIo(server);

//const io=require("socket.io")(server, {cors: {origin: "*"}});

const socketIo = require("socket.io");

const io=socketIo(server, {cors: {origin: "*"}});

io.on('connection', socket => {

  //app.set('socketio',socket)
  /*
  app.ioall = io.sockets
  app.iox = socket  
  */
   // otetaan clientin "socket-osoite" talteen
  app.socket=socket;
  //app.set('socket', socket); 
  //global.socket=socket;
  


  console.info('New client connected ' + socket.id.toString())
  // vastaan heti uudelle asiakkaalle
  
  // socket on clientin socket, johin vastataan emitillä
  socket.emit("connected", socket.id)

  socket.on('disconnect', () => console.log('Client disconnected'));

  // Android lähettää myös ideen joka on selaimen id, saatu emaililla
  socket.on('gtwmob.notify', (data, id) => {

    if (id) {
      console.log('Client sent message: ' + data + "  id=" + id)

      socket.broadcast.to(id).emit('Ready2Start', data);
    }

  });

  socket.on('client', (data, id) => {
    console.log('Client sent message: ' + data + "   id= " + id)
    socket.emit('FromAPI', 'tervetulloo')
  }
  );

}
);

//----------------------------------------------------------------


app.use(cors())

app.use(express.json());

app.use(express.static('build'))

//---------------------
const usersRouter = require('./routes/users-routes')
app.use('/api/user', usersRouter);

const dataRouter = require('./routes/data-routes')
app.use('/api/data', dataRouter);
//---------------------


app.use((req, res, next) => {

  res.send('wrong address');
});


app.use((error, req, res, next) => {
  if (res.headersSent) {

    return next(error);
  }

  res.status(error.code || 500)
    .send({ message: error.message || 'Unknown error' });
});


const password = process.env.mongoPsw;
const uri = `mongodb+srv://AA4598:${password}@clusteraa4598.jpjh8.mongodb.net/cyclingdb?retryWrites=true&w=majority`;

const options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true };

mongoose
  .connect(uri, options)
  .then(() => {
    logger.info('connected to MongoDB and the server started')
    //app.listen(5000);
    const PORT = process.env.PORT || 5000
      
    //app.listen(PORT, () => {
   server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })

  })
  .catch((error) => {

    logger.error('error connection to MongoDB:', error.message)
  });

