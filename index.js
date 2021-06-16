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


app.get('/', (request, response) => {
  response.send(`
    <div style="margin: 5em auto; width: 400px; line-height: 1.5">
      <h1 style="text-align: center">Hello!</h1>
      <p>Si tu vois ce message, c'est que ton serveur est bien lancé !</p>
      <div>Désormais, tu dois venir utiliser l'API</div>
      <ul style="display: inline-block; margin-top: .2em">
        <li><code>POST http://localhost:${port}/login</code></li>
        <li><code>POST http://localhost:${port}/forgot</code></li>
        <li><code>GET http://localhost:${port}/theme/{email}</code></li>
      </ul>
    </div>
  `);
});

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
  text:'Tapez la commande `send votre message`',
  },
  {
  id: 12,
  name:'mail',
  text:'Mon adresse mail est : mibmae@gmail.com',
  },
  {
  id: 13,
  name:'disponibilite',
  text:'Bonjour, je suis actuellement disponible en ce moment, je vous laisse mon adresse mail afin de pouvoir me contacter "mibmae@gmail.com". Cordialement, Guilhem.',
  },
  {
  id: 3,
  name:'github',
  text:'Voici l\'adresse de mon repo Github : http://github.com/mibmae' ,
  },
  {
  id: 3,
  name:'help',
  text:"Voici la liste des fonctions disponibles : 'Message' 'Téléphone' 'Github'",
  }
]

let id = 0;
io.on('connection', (ws) => {
  var users = {};
  users['USER_NAME'] = socket.id;
  console.log(ws.id);
  console.log('>> socket.io - connected');
  io.to(ws.id).emit('private_message', `Bonjour, Voici la liste des fonctions disponibles : "Message" "Téléphone" "Github"`);
  ws.on('client_message', (message) => {
    console.log(message);
    // eslint-disable-next-line no-plusplus
    message.id = ++id;
    messages = message.toLowerCase();
    message = deleteAccents(messages);
    
    let ask = keywords.find(aks => aks.name === message);
    console.log(ask);

    if (ask === undefined) {
      io.to(ws.id).emit('private_message', `!!!!! Cette commande n'existe pas !!!!!, tapez "help" pour avoir la liste des commandes.`);
    } else {
      io.to(ws.id).emit('private_message', `${ask.text}`);
    }
    
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