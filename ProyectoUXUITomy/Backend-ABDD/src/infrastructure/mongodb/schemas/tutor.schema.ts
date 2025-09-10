import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type TutorDocument = HydratedDocument<TutorMongo>

@Schema({collection:'Tutor'})
export class TutorMongo{
  @Prop({ type: String, default: uuidv4 })
  _id: String;

  @Prop()
  nombre: string;

  @Prop({ type: [{ type: String, default:uuidv4, ref: 'Paciente' }]})
  idMascotas: string[];
}

export const TutorSchema = SchemaFactory.createForClass(TutorMongo);