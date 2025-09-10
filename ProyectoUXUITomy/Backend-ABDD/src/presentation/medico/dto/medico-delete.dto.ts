import { IsString } from "class-validator";

export class DeleteMedicoDto
{
    @IsString()
    public readonly id:string;
}