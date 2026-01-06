import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

/**
 * WebSocket Gateway para emitir notificaciones en tiempo real
 * - No usa rooms, emite eventos globales a todos los clientes conectados
 * - Puerto: 3001 (separado del REST que usa 3000)
 * - CORS habilitado para desarrollo
 */
@WebSocketGateway(3001, {
  cors: {
    origin: '*', // En producción, especificar dominios permitidos
  },
  transports: ['websocket', 'polling'], // Soportar WebSocket puro y polling
  allowEIO3: true, // Compatibilidad con clientes antiguos
})
export class NotificacionesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('NotificacionesGateway');
  private clientesConectados = 0;

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway inicializado en puerto 3001');
    this.logger.log('Los clientes pueden conectarse usando: http://localhost:3001');
  }

  handleConnection(client: Socket) {
    this.clientesConectados++;
    this.logger.log(`Cliente conectado: ${client.id}`);
    this.logger.log(`Total de clientes conectados: ${this.clientesConectados}`);

    // Enviar mensaje de bienvenida al cliente
    client.emit('conexion', {
      mensaje: 'Conectado al servidor de notificaciones',
      clienteId: client.id,
      timestamp: new Date().toISOString(),
    });
  }

  handleDisconnect(client: Socket) {
    this.clientesConectados--;
    this.logger.log(`Cliente desconectado: ${client.id}`);
    this.logger.log(`Total de clientes conectados: ${this.clientesConectados}`);
  }

  /**
   * Emite una notificación global a todos los clientes conectados
   * @param evento Nombre del evento (ej: 'notificacion', 'actualizacion')
   * @param datos Datos de la notificación
   */
  emitirNotificacionGlobal(evento: string, datos: any) {
    this.logger.log(`Emitiendo evento "${evento}" a ${this.clientesConectados} clientes`);
    this.logger.debug(`Datos del evento: ${JSON.stringify(datos)}`);

    // Emitir a todos los clientes conectados (sin rooms)
    this.server.emit(evento, {
      ...datos,
      timestamp: new Date().toISOString(),
      totalClientes: this.clientesConectados,
    });
  }

  /**
   * Obtiene el número de clientes conectados
   */
  getClientesConectados(): number {
    return this.clientesConectados;
  }
}
