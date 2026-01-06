import type proveedor = require("./proveedor");

export interface Irepuesto {
    id: number;
    descripcion: string;
    precio: number;
    stock: number;
    proveedor: proveedor.Iproveedor[];
    
}
