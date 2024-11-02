import Phaser from "phaser";

export default class Room extends Phaser.Scene {
  private character!: Phaser.Physics.Arcade.Sprite; // Use '!' to assert it will be initialized
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.image('player', '/assets/bird.png'); // Load your character sprite
    this.load.image('bg', '/assets/bg.png'); // Load your character sprite
  }

  create() {

    this.add.image(640, 1008, 'bg').setOrigin(0.5,0.5);
    this.character = this.physics.add.sprite(640, 1008, 'player');

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    // this.cameras.main.setBounds(0, 0, 1350, 2016);
    // this.cameras.main.startFollow(this.character); // Follow the character with smooth motion

  }

  update() {
    // Handle character movement and any game logic here
    // Example: moving the character with arrow keys

    if (this.cursors.left.isDown) {
      this.character.setVelocityX(-300);
    } else if (this.cursors.right.isDown) {
      this.character.setVelocityX(300);
    } else {
      this.character.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
      this.character.setVelocityY(-300);
    } else if (this.cursors.down.isDown) {
      this.character.setVelocityY(300);
    } else {
      this.character.setVelocityY(0);
    }

  }
}