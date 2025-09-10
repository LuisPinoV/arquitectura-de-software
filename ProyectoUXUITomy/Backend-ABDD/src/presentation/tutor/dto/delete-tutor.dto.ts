import { IsString } from 'class-validator';

export class DeleteTutorDto
{
    @IsString()
    readonly id:string;
}