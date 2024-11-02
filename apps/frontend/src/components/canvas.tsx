import { useEffect } from "react"
import Room from "../scenes/Room";
import Phaser from "phaser";
import '../App.css'

const config: Phaser.Types.Core.GameConfig = {
    parent: 'canvas-container',
    type: Phaser.AUTO,
    backgroundColor: '#333333',
    width: 1280,
    height: 2016,
    scene: Room,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { x: 0, y: 0 }
        }
    },
}

export default function Canvas() {
    useEffect(() => {
        const game = new Phaser.Game(config);

        return () => {
            game.destroy(true);
        }
    }, [])
    return <div id="canvas-container"></div>    
}