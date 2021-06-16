/* eslint-disable prefer-destructuring */
/*
 * Require
 */
const express = require('express');
const bodyParser = require('body-parser');
const Server = require('http').Server;
const socket = require('socket.io');


/*
 * Vars
 */
const app = express();
const server = Server(app);
const io = socket(server);
const port = 3001;

const deleteAccents = (str) => {
  var accent = [
  /[\300-\306]/g, /[\340-\346]/g, // A, a
  /[\310-\313]/g, /[\350-\353]/g, // E, e
  /[\314-\317]/g, /[\354-\357]/g, // I, i
  /[\322-\330]/g, /[\362-\370]/g, // O, o
  /[\331-\334]/g, /[\371-\374]/g, // U, u
  /[\321]/g, /[\361]/g, // N, n
  /[\307]/g, /[\347]/g, // C, c
];
var noaccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];


for(var i = 0; i < accent.length; i++){
  str = str.replace(accent[i], noaccent[i]);
}

return str;
}



/*
 * Socket.io
 */
const keywords = [
  {
  id: 1,
  name:'telephone',
  text:'Voulez vous me contacter par téléphone ?'
  },
  {
  id: 2,
  name:'message',
  text:'Voulez vous me laisser un message ?',
  },
  {
  id: 3,
  name:'github',
  text:"Voici l'adresse de mon repo Github : http://www.google.fr",
  }
]

let id = 0;
io.on('connection', (ws) => {
  var users = {};
  users['USER_NAME'] = socket.id;
  console.log(ws.id);
  console.log('>> socket.io - connected');
  io.to(ws.id).emit('private_message', `Bonjour, Voila la liste des fonctions disponibles : 'Message' 'Téléphone' 'Github'`);
  ws.on('client_message', (message) => {
    // eslint-disable-next-line no-plusplus
    message.id = ++id;
    messages = message.toLowerCase();
    message = deleteAccents(messages);
    console.log(message);
    
    console.log('ok', message)
    let ask = keywords.find(aks => aks.name === message);
    console.log(ask);
    io.to(ws.id).emit('private_message', `${ask.text}`);
  });
});

io.on('client_message', (msg) => {
  console.log(msg);
  io.broadcast.emit("Salut");
})
/*
 * Server
 */
server.listen(port, () => {
  console.log(`listening on *:${port}`);
});