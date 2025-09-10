import { IsString, IsNumber } from 'class-validator';

export class ReadPacienteDto
{
    @IsString()
    readonly id:string;
    
    @IsString()
    readonly nombre:string;

    @IsString()
    readonly tutor:string;

    @IsString()
    readonly raza:string;

    @IsNumber()
    readonly edad:Number;

    @IsString()
    readonly especie:string;

    @IsString()
    readonly genero:string;

    constructor(id, nombre, tutor, raza, edad, especie, genero)
    {
        this.id = id;
        this.nombre = nombre;
        this.tutor = tutor;
        this.raza = raza;
        this.edad = edad;
        this.especie = especie;
        this.genero = genero;
    }
}