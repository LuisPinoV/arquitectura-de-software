import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type PacienteDocument = HydratedDocument<PacienteMongo>;

@Schema({ collection: 'Paciente' })
export class PacienteMongo {
  @Prop({ type: String, default: uuidv4 })
  _id: String;

  @Prop()
  nombre: string;

  @Prop({ type: String, default: uuidv4, ref: 'Tutor' })
  tutor: string;

  @Prop()
  raza: string;

  @Prop()
  especie: string;

  @Prop()
  edad: Number;

  @Prop()
  genero: string;
}

export const PacienteSchema = SchemaFactory.createForClass(PacienteMongo);
