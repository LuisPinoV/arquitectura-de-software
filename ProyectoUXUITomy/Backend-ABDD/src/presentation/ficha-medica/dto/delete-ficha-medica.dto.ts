import {
  IsString,
  IsUUID,
} from 'class-validator';

export class DeleteFichaMedicaDto {
  @IsString()
  @IsUUID()
  readonly id: string;
}
