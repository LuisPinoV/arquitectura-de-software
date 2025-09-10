import { IsString } from "class-validator";

export class ReadMedicoDto
{
    @IsString()
    readonly id:string;

    @IsString()
    readonly nombre:string;

    @IsString()
    readonly estado:string;

    @IsString()
    readonly especialidad:string;

    constructor(id, nombre, estado, especialidad)
    {
        this.id = id;
        this.nombre = nombre;
        this.estado = estado;
        this.especialidad = especialidad;
    }
}