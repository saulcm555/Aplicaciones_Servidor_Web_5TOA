import type dispositivo = require("./dispositivo");
import type servicio = require("./servicio");

export interface Icliente {
    id: number;
    nombre: string;
    apellido: string;
    edad: number;
    direccion: string;
    telefono: string;
    email: string;
    dispositivos?: dispositivo.Idispositivo[]; // Relación con dispositivos
    servicios:servicio.Iservicio[]; // Relación con servicios
}
