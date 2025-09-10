import { IsOptional, IsString } from "class-validator";

export class UpdateMedicoDto
{
    @IsString()
    readonly id:string;

    @IsString()
    @IsOptional()
    readonly nombre:string;

    @IsString()
    @IsOptional()
    readonly estado:string;

    @IsString()
    @IsOptional()
    readonly especialidad:string;
}