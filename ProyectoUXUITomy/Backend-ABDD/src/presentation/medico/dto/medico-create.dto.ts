import { IsString } from "class-validator";

export class CreateMedicoDto
{
    @IsString()
    public readonly nombre:string;

    @IsString()
    public readonly especialidad:string;
}