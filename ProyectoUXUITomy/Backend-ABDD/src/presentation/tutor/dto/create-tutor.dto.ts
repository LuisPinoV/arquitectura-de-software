import { IsString } from "class-validator";

export class CreateTutorDto
{
    @IsString()
    readonly nombre:string;

    @IsString()
    readonly mascotas:string[];
}