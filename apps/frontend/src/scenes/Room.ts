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
    // this.load.image('player', '/assets/bird.png');
    this.load.image('bg', '/assets/bg.png');
    this.load.atlas('knight','/assets/knight/knight.png', '/assets/knight/knight_atlas.json');
    this.load.animation('knight_anim', '/assets/knight/knight_anim.json');
  }

  create() {
    this.socket = new WebSocket('ws://localhost:3001');
    const spaceId = 'cm33l1m6j000bull2horjt0sp';
    // this.cameras.main.setBounds(0,0, 1280, 2016);
    this.add.image(0, 0, 'bg').setOrigin(0);
    
    // this.createGrid(this);
    
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
          this.character = this.physics.add.sprite(message.payload.spawn.x, message.payload.spawn.y, 'knight');
          console.log('player x ', message.payload.spawn.x);
          console.log('player y ', message.payload.spawn.y);
          this.character.setCollideWorldBounds(true);
          this.character.setScale(2);
          // this.character = this.physics.add.sprite(0, 0, 'player');
          // this.character = this.physics.add.sprite(640,10, 'player');
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
          payload.users.forEach((user: { userId: number, x: number, y:number }) => {
            const character = this.physics.add.sprite(user.x, user.y, 'player');
            console.log('other players - ',user)
            this.games.set(user.userId, character);
          });

          console.log(this.games);
          // gameManager.addPlayerToGame(spaceId);
          // gameManager.addPlayerToGame(this, character);

          // this.cameras.main.startFollow(this.character);
          // this.cameras.main.setDeadzone(1000, 1800);  // Keeps the camera from shaking
          // this.cameras.main.setBounds(0, 0, 1280, 2016);
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
          const payload = message.payload;
          const character = this.games.get(payload.userId);
          this.games.delete(message.payload.userId);
          character?.destroy();
        }
      }
    };
  }

  update() {
    if (!this.character) return;
    console.log(this.character.x,'-character x');
    console.log(this.character.y,'-character y');
    console.log(window.innerWidth);
    console.log(window.innerHeight);
    if (this.cursors.left.isDown) {
      this.character.x -= 1;
      if(this.character.anims)this.character.anims.play('knight_walk', true);
      this.sendMovementData();
    }
    if (this.cursors.right.isDown) {
      this.character.x += 1;
      if(this.character.anims)this.character.anims.play('knight_walk', true)
      this.sendMovementData();
    }
    if (this.cursors.up.isDown) {
      this.character.y -= 1;
      if(this.character.anims)this.character.anims.play('knight_walk', true);
      this.sendMovementData();
    }
    if (this.cursors.down.isDown) {
      this.character.y += 1;
      if(this.character.anims)this.character.anims.play('knight_walk', true);
      this.sendMovementData();
    }

    // if(this.character.anims)this.character.anims.play('knight_walk', false);

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


 createGrid(scene: Phaser.Scene): void {
  const graphics = scene.add.graphics();
  graphics.lineStyle(1, 0xcccccc, 1); // Light gray lines with 1px thickness

  const width = scene.sys.game.config.width as number;
  const height = scene.sys.game.config.height as number;

  // Draw vertical grid lines
  for (let x = 0; x < width; x += 10) {
    graphics.moveTo(x, 0);
    graphics.lineTo(x, height);
  }

  // Draw horizontal grid lines
  for (let y = 0; y < height; y += 10) {
    graphics.moveTo(0, y);
    graphics.lineTo(width, y);
  }

  graphics.strokePath();
}


}
