import type servicio = require("./servicio");
import type dispositivo = require("./dispositivo");

export interface Isoporte {
    id: number;
    fecha: Date;
    descripcion: string;
    estado: boolean;
    servicios: servicio.Iservicio; // Relación con el servicio
    dispositivos: dispositivo.Idispositivo[]; // Relación con los dispositivos
}

