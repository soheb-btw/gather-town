import { WebSocketServer } from 'ws';
import { User } from './User';
import doteng from 'dotenv'
import { RoomManager } from './RoomManager';

doteng.config()

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (ws) => {
  let user = new User(ws);
  ws.on('error', console.error);
  ws.on('close', () => {
    user?.destroy();
    console.log(RoomManager.getInstance().rooms);
  });
});