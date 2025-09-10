import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdatePacienteDto
{
    @IsString()
    readonly id:string;

    @IsString()
    @IsOptional()
    readonly nombre:string;

    @IsString()
    @IsOptional()
    readonly tutor:string;

    @IsString()
    @IsOptional()
    readonly raza:string;

    @IsNumber()
    @IsOptional()
    readonly edad:Number;

    @IsString()
    @IsOptional()
    readonly especie:string;

    @IsString()
    @IsOptional()
    readonly genero:string;
}