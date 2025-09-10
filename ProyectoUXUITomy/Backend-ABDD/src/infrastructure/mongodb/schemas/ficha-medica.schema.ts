import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { RevisionMedica } from 'src/domain/entities/serializable-objects/revision-medica';
import { CarnetVacuna } from 'src/domain/entities/serializable-objects/carnet-vacuna';

@Schema({collection:'FichaMedica'})
export class FichaMedicaMongo {
  @Prop({ type: String, default: uuidv4 })
  _id: String;

  @Prop({ required: true })
  idMascota: string;

  @Prop({ type: [RevisionMedica], required: true })
  revisionesMedicas: RevisionMedica[];

  @Prop({ type: [RevisionMedica], required: true })
  carnetVacuna: CarnetVacuna[];
}

export const FichaMedicaSchema = SchemaFactory.createForClass(FichaMedicaMongo);