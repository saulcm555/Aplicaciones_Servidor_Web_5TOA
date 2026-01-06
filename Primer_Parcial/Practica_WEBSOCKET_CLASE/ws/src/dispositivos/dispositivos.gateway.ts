import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { DispositivosService } from './dispositivos.service'; 
import {Server,Socket} from "socket.io"


@WebSocketGateway({cors:{origin:"*"}})
export class DispositivosGateway  implements OnGatewayConnection, OnGatewayDisconnect {
 
  @WebSocketServer ()
  server: Server
  constructor() {}
  handleConnection(socket:Socket){
    console.log(socket.id)
  }
  handleDisconnect(socket:Socket){
    console.log(socket.id)
  }
  emitirMensaje(evento:string, body:any){
    this.server.emit(evento, body)   
  }
  @SubscribeMessage('events')
handleEvent(
  @MessageBody() data: any,
  @ConnectedSocket() client: Socket,
): string {
  return data;
}
}
