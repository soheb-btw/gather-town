import { User } from "./User";

class GameManager {
    private games: Map<Phaser.Scene, Phaser.Physics.Arcade.Sprite[]> = new Map();
    private static instance: GameManager;
    private constructor() {

    }

    static getInstance() {
        if (!GameManager.instance) {
            return this.instance = new GameManager();
        }
        return this.instance;
    }

    addPlayerToGame(Room: Phaser.Scene, character: Phaser.Physics.Arcade.Sprite) {
        if (!this.games.has(Room)) {
            return;
        }
        this.games.set(spaceId, [...(this.games.get(spaceId) ?? []), character]);
    }
}

const gameManager = GameManager.getInstance();
export default gameManager;