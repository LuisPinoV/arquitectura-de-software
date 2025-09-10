import { IsString, IsNumber } from 'class-validator';

export class CreatePacienteDto
{
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
}