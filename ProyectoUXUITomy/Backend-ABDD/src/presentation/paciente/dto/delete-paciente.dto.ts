import { IsString } from 'class-validator';

export class DeletePacienteDto
{
    @IsString()
    readonly id:string;
}