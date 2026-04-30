// import {
//     SubscribeMessage,
//     WebSocketGateway,
//     WebSocketServer,
// } from '@nestjs/websockets';
// import {
//     Server,
//     WebSocket,
// } from 'ws';

import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {origin: 'http://localhost:4200'},
    path: '/test',
})
export class TestGateway {
    @WebSocketServer()
    public server: Server;  // ← теперь this.server доступен
    
    @SubscribeMessage('message')
    public handleMessage(client: any, data: string) {
        // Широковещательная рассылка всем клиентам
        this.server.emit('echo', `Всем: ${data}`);
    }
}
