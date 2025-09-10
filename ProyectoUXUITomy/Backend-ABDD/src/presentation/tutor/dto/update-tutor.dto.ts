import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateTutorDto
{
    @IsString()
    readonly id:string;

    @IsString()
    @IsOptional()
    readonly nombre:string;

    @IsArray()
    @IsOptional()
    readonly mascotas:string[];
}