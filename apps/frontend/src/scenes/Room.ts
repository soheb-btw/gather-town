import Phaser from "phaser";

export default class Room extends Phaser.Scene {
  private character!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private socket!: WebSocket;
  private games: Map<number, Phaser.Physics.Arcade.Sprite> = new Map();

  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.image('player', '/assets/bird.png');
    this.load.image('bg', '/assets/bg.png');
  }

  create() {
    this.socket = new WebSocket('ws://localhost:3001');
    const spaceId = 'cm33l1m6j000bull2horjt0sp';
    this.add.image(640, 1008, 'bg').setOrigin(0.5, 0.5);

    this.socket.onopen = () => {
      this.socket.send(JSON.stringify({
        type: 'join',
        payload: {
          spaceId,
          token: sessionStorage.getItem('token')
        }
      }));
      console.log('Connected to WebSocket server');
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'space-joined': {
          console.log('adding other people');
          const payload = message.payload;
          this.character = this.physics.add.sprite(message.payload.spawn.x, message.payload.spawn.y, 'player');
          this.games.set(message.payload.spawn.userId, this.character);
          // const tween = this.tweens.add({
          //   targets: this.character,
          //   x: 100,
          //   y: 1100,
          //   duration: 1000, // Adjust the duration as needed
          //   onComplete: () => {
          //     console.log('Movement complet123e!');
          //   }
          // });

          // tween.stop();

          if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
          }
          // const character = this.physics.add.sprite(payload.spawn.x, payload.spawn.y, 'player');  
          payload.users.forEach((user: { userId: number }) => {
            const character = this.physics.add.sprite(640, 1100, 'player');
            this.games.set(user.userId, character);
          });

          console.log(this.games);
          // gameManager.addPlayerToGame(spaceId);
          // gameManager.addPlayerToGame(this, character);

          // this.cameras.main.setBounds(0, 0, 2400, 2016);
          // this.cameras.main.startFollow(this.character);
          // this.addPlayer(message.playerId, message.x, message.y);
          break;
        }
        case 'user-joined': {
          console.log('user joined');
          const character = this.physics.add.sprite(message.payload.x, message.payload.y, 'player');
          this.games.set(message.payload.userId, character);
          console.log(this.games);

          // this.updatePlayerPosition(message.playerId, message.x, message.y);
          break;
        }
        case 'movement': {
          const payload = message.payload;
          console.log(payload);
          const character = this.games.get(payload.userId);
          if(character){
            console.log(character);
            character.x = payload.x;
            character.y = payload.y
          }
          // console.log(payload);
          break;
        }
        case "user-left" : {
          this.games.delete(message.payload.userId);
        }
      }
    };
  }

  update() {

    if (!this.character) return;

    if (this.cursors.left.isDown) {
      this.character.x -= 5;
      this.sendMovementData();
    }
    if (this.cursors.right.isDown) {
      this.character.x += 5;
      this.sendMovementData();
    }
    if (this.cursors.up.isDown) {
      this.character.y -= 5;
      this.sendMovementData();
    }
    if (this.cursors.down.isDown) {
      this.character.y += 5;
      this.sendMovementData();
    }
  }

  sendMovementData() {
    const movementData = {
      type: 'move',
      payload: {
        x: this.character.x,
        y: this.character.y
      }
    };

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(movementData));
    }
  }

}
