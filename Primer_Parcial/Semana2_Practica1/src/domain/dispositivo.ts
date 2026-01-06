import type cliente = require("./cliente");

export interface Idispositivo {
    id: number;
    tipo: string;
    marca: string;
    modelo: string;
    serial: string;
    cliente: cliente.Icliente;
}