import { Idispositivo } from "../domain/dispositivo";
import { Icliente } from "../domain/cliente";

const dispositivos: Idispositivo[] = [];
export class Dispositivo  {
    id:number=1;
    tipo:string="";
    marca:string="Iphone 16";
    modelo:string="Pro Max";

    cliente:Icliente={
        id: 1,
        nombre: "Saul",
        apellido: "Castro",
        edad: 20,
        direccion: "Calle 123",
        telefono: "123456789",
        email: "saucastrocm@hotmail.com",
        servicios: [] // Array vacío de servicios
    };

    constructor(
        
    ) {}
    crear() {
        
        // Lógica para crear un dispositivo
    }
    modificar(dispositivo:Idispositivo){
        const dispositivoEncontrado=dispositivos.find((elemento:Idispositivo)=>elemento.id===dispositivo.id)
        if(!dispositivoEncontrado){
            throw new Error(`❌ No se encontró ningún dispositivo con ID: ${dispositivo.id}`);
        }
        // Lógica para modificar un dispositivo
    }
    eliminar(dispositivo:Idispositivo) {
        const dispositivoIndex = dispositivos.findIndex((elemento:Idispositivo) => elemento.id === dispositivo.id);
        if (dispositivoIndex === -1) {
            console.log(`❌ No se encontró ningún dispositivo con ID: ${dispositivo.id}`);
            return null;
        }
        dispositivos.splice(dispositivoIndex, 1);
        console.log(`✅ Dispositivo con ID: ${dispositivo.id} eliminado correctamente.`);
    }

    consultar(id:number) {
        const dispositivoEncontrado = dispositivos.find((elemento: Idispositivo) => elemento.id === id)
        if (!dispositivoEncontrado) {
            throw new Error(` No se encontró ningún dispositivo con ID: ${id}`);
        }
        
        console.log(`✅ Dispositivo encontrado: ${dispositivoEncontrado.marca} ${dispositivoEncontrado.modelo}`);
        return dispositivoEncontrado;
    }
}