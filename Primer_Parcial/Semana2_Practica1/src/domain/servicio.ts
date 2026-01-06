export interface Iservicio {
    id: number;
    descripcion: string;
    precio: number;
    clienteId: number; // Relación con el cliente
    dispositivoId: number; // Relación con el dispositivo
    tecnicoId: number; // Relación con el técnic
}
