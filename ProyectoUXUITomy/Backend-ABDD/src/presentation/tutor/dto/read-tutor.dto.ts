import { IsArray, IsString } from 'class-validator';

export class ReadTutorDto
{
    @IsString()
    readonly id:string;

    @IsString()
    readonly nombre:string;

    @IsArray()
    readonly idMascotas:string[];

    

    constructor(id, nombre, idMascotas)
    {
        this.id = id;
        this.nombre = nombre;
        this.idMascotas = idMascotas;
    }
}