import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['game-area'],
  consoleInput: "",
  chatInput: "",
  consoleMessages: [],
  gameChatMessages: [],
  currNode: "",
  operatorlocation: "engineering",
  // COMMANDS SHARED BY BOTH USERS

  sharedCommands: [
    {
      command: "--help",
      options: [],
      desc: "lists commands and options for given command, or lists all commands if given on its own.",
      run: (data)=>{
        data.readOut.pushObject(`${data.currNode.path} ${data.command}`)
        data.commandList.forEach((e)=>{
          data.readOut.pushObject(`${e.command} : ${e.desc}`);
        })
      },
    },
    {
      command: "whereami",
      options: [],
      desc: "prints out information on the server's information",
      run: (data)=>{
        data.readOut.pushObject(`${data.currNode.path} ${data.command}`);
        data.readOut.pushObject(`LOCATION = ${data.currlocation}`);
        data.readOut.pushObject(`PORT = ${data.port}`);
      }
    },

  ],

  // OPERATOR COMMANDS

  operatorCommands: Ember.computed(function(){
    let c = this;
    return c.get('sharedCommands').concat([
      {
        command: "whoami",
        options: [],
        desc: "prints information on the currently logged in user",
        run: (data)=>{
          let user = c.get('user')
          data.readOut.pushObject(`${data.currNode.path} ${data.command}`)
          data.readOut.pushObject(`USER = ${user}`)
          data.readOut.pushObject(`ROLE = engineer`)
          data.readOut.pushObject(`PASSWORD = ${data.gameData.operatorpassword}`)
        }
      },
    ])
  }),

  //OPERATIVE COMMANDS

  operativeCommands: Ember.computed(function(){
    let c = this;
    return c.get('sharedCommands').concat([
      {
        command: `door`,
        options: [
          `--open [password] : opens the door with supplied password`,
        ],
        desc: "access the door's operations, type door --help to get a list of options",
        run: (data)=>{
          data.readOut.pushObject(`${data.currNode.path} ${data.command}`)
          let operation = data.commandList.filter((e)=>{
            return e.command == data.command
          })[0]
          switch (data.option) {
            case "--open":
              if (data.optionParams[0] === data.gameData.operatorpassword) {
                data.readOut.pushObject('DOOR HAS OPENED YOU WIN!')
                return true;
              } else {
                data.readOut.pushObject("error: incorrect password")
              }
              break;
            case "--help":
              operation.options.forEach((e)=>{
                data.readOut.pushObject(e)
              })
              break;
            default:
            data.readOut.pushObject(`error: No option supplied, type --help to get a list of options and their descriptions`)
          }
        }
      }
    ])
  }),

  fixScroll: (targetDiv)=>{
    setTimeout(()=>{
      let objDiv = document.getElementsByClassName(targetDiv)[0]
      objDiv.scrollTop = objDiv.scrollHeight;
    })
  },
  init(){
    // Prepare game page

    let c = this
    c._super(...arguments);
    c.set('gameChatMessages', [])
    c.set('consoleMessages', [])
    c.set('timestamp', c.model.timestamp);
    c.set('room', c.model.timestamp);
    c.set('role',c.model.role);
    let timestamp = c.model.timestamp;
    let role = c.model.role
    let room = timestamp;

    // Check for game instance

    this.get('model').games.then((response)=>{
      let games = response.content.map((e)=>{
        return e.__data
      }).filter((e)=>{
        return e.timestamp == timestamp
      })
      if (games.length != 1) {
        location.href = "/"
      } else {
        return games[0];
      }
    })
    .then((game)=>{

      // Load game variables

      let url = c.get('url')
      let user = localStorage.user;
      let socket = c.get('socketIOService').socketFor(url)
      let gameChat = c.get('gameChatMessages');
      c.set('gameData', game);
      c.set('operativelocation', game.operativelocation);
      c.set('operativeport', game.operativeport);
      c.set('operatorpassword', game.operatorpassword);
      c.set('operatorport', game.operatorport);
      c.set('owner', game.owner);

      // Operator File Structure

      c.set('operatorFileStructure', {
        path: "C://",
        folders: ['bin', 'log', 'usr', 'docs'],
        files: [],
        bin: {
          dir: ['bin'],
          path: "C://bin",
          folders: [],
          files: [],
        },
        log: {
          dir: ['log'],
          path: "C://log",
          folders: [],
          files: [],
        },
        usr: {
          dir: ['usr'],
          path: "C://usr",
          folders: [`${user}`],
          files: [],
          [user]: {
            dir: ['usr', `${user}`],
            path: `C://usr/${user}`,
            folders: [],
            files: [{
              name: 'password.txt',
              content: c.get('operatorpassword'),
            }],

          }
        },
        docs: {
          dir: ['docs'],
          path: "C://docs",
          folders: [],
          files: [],
        },
      });

      // Operative File Structure

      c.set('operativeFileStructure', {
        dir: [],
        path: "C://",
        folders: ['bin', 'log', 'docs'],
        bin: {
          dir: ['bin'],
          path: "C://bin",
          door: {
            dir: ['bin', 'door'],
            path: `C://bin/door`,
            folders: [],
            files: ['door.exe'],
          }
        },
        log: {
          dir: ['log'],
          path: "C://log",
          folders: [],
          files: [],
        },
        docs: {
          dir: ['docs'],
          path: "C://docs",
          folders: [],
          files: [],
        },
      })

      c.set('currNode', c.get(`${role}FileStructure`))

      // Set up sockets

      socket.emit('open', [user,room]);
      socket.on('close', (message)=>{
        gameChat.pushObject(message)
        c.get('fixScroll')('chat-window')
      });
      socket.on('message', (message)=>{
        gameChat.pushObject(message)
        c.get('fixScroll')('chat-window')
      });
      socket.on('gameDeleted', ()=>{
        location.href = "/"
      })
      socket.on('gameConsole', (message)=>{
        let messageArray = message.split('~')
      })
    })
  },
  willDestroyElement(){
    // When leaving page

    let c = this
    c._super(...arguments);
    let url = c.get('url');
    let user = c.get('user');
    let room = c.get('room');
    let owner = c.get('gameData').owner;
    let timestamp = c.get('timestamp');
    if (owner != user) {
      // When guest leaving page

      c.get('store').queryRecord('game', {
        "timestamp": timestamp,
      }).then((data)=>{
        data.set('publicroom', true);
        return data.save();
      }).then(()=>{
        const socket = c.get('socketIOService').socketFor(url);
        socket.emit('close', [user,room]);
        socket.emit('updateGameList')
        c.set('gameChatMessages', []);
        c.get('socketIOService').closeSocketFor(url)
      })
    } else {
      // When owner leaving page

      c.get('store').queryRecord('game', { 'timestamp': timestamp, })
      .then((game)=>{
        game.deleteRecord();
        game.save().then(()=>{
          let url = c.get('url');
          const socket = c.get('socketIOService').socketFor(url);
          socket.emit('gameDelete');
        });
      });
    }
  },
  actions: {
    consoleEnter(){
      let c = this;
      let command = c.get('consoleInput').split(' ')[0];
      let option = c.get('consoleInput').split(' ')[1];
      let optionParams = c.get('consoleInput').split(' ').slice(2)
      let role = c.get('role');
      let currNode = c.get('currNode');
      let readOut = c.get('consoleMessages');
      let commandList = c.get(`${role}Commands`);
      let fileStructure = c.get(`${role}FileStructure`);
      let gameData = c.get('gameData');
      let port = gameData[`${role}port`]
      let currlocation = role == "operator" ? "engineering" : gameData[`operativelocation`]
      let room = c.get('room');
      let socketIOService = c.get('socketIOService');
      let data = {
        commandList,
        fileStructure,
        readOut,
        command,
        option,
        port,
        optionParams,
        currlocation,
        socketIOService,
        currNode
      }
      let operation = commandList.filter((e)=>{
        return e.command == command
      })[0]
      if (operation) {
        if (operation.run(data)) {
          const socket = c.get('socketIOService').socketFor(c.get('url'))
          socket.emit("message", [room, `YOU WIN!`])
          c.set('chatInput', '')
          c.get('fixScroll')('chat-window')
        }
      } else {
        readOut.pushObject(`${currNode.path} ${c.get('consoleInput')}`)
        readOut.pushObject("no such command exists")
      }
      c.set('consoleInput', '')
      c.get('fixScroll')('console-window')

    },
    chatEnter(){
      let c = this
      const socket = c.get('socketIOService').socketFor(c.get('url'));
      let room = c.get('room');
      let user = c.get('user');
      let chatInput = c.get('chatInput');
      socket.emit("message", [room, `${user}: ${chatInput}`]);
      c.set('chatInput', '');
      c.get('fixScroll')('chat-window');
    },
  },
});
