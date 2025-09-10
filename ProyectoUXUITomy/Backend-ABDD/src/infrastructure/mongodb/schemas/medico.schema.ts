import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type MedicoDocument = HydratedDocument<MedicoMongo>

@Schema({collection:'Medico'})
export class MedicoMongo{
  @Prop({ type: String, default: uuidv4 })
  _id: String;

  @Prop()
  nombre: string;

  @Prop()
  estado: string;

  @Prop()
  especialidad: string;
}

export const MedicoSchema = SchemaFactory.createForClass(MedicoMongo);