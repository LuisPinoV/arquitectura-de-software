import {
  IsString,
  IsUUID,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RevisionMedica } from 'src/domain/entities/serializable-objects/revision-medica';
import { CarnetVacuna } from 'src/domain/entities/serializable-objects/carnet-vacuna';

export class UpdateFichaMedicaDto {
  @IsString()
  @IsUUID()
  readonly id: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  readonly idMascota: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RevisionMedica)
  @IsOptional()
  readonly revisionesMedicas: RevisionMedica[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CarnetVacuna)
  @IsOptional()
  readonly carnetVacuna: CarnetVacuna[];
}
