import {
  IsString,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RevisionMedica } from 'src/domain/entities/serializable-objects/revision-medica';
import { CarnetVacuna } from 'src/domain/entities/serializable-objects/carnet-vacuna';

export class CreateFichaMedicaDto {
  @IsString()
  @IsUUID()
  readonly idMascota: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RevisionMedica)
  readonly revisionesMedicas: RevisionMedica[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CarnetVacuna)
  readonly carnetVacuna: CarnetVacuna[];
}
