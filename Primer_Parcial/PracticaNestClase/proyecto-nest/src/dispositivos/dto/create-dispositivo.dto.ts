import { IsNumber, IsString } from "class-validator";

export class CreateDispositivoDto {
    @IsString()
    nombre: string;
    @IsNumber()
    valor: number;
    @IsString()
    tipo: string;
}
