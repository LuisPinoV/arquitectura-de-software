import { IMedicoRepository } from 'src/domain/repositories/medico.repository';
import { Medico } from 'src/domain/entities/medico.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MedicoMongo } from './schemas/medico.schema';

export class MongoMedicoRepository implements IMedicoRepository {
  constructor(@InjectModel('Medico') private medicoModel: Model<MedicoMongo>) {}

  async CreateMedico(medico: Medico): Promise<void> {
    await new this.medicoModel({
      _id: medico.getId(),
      nombre: medico.getNombre(),
      estado: medico.getEstado(),
      especialidad: medico.getEspecialidad(),
    }).save();
  }
  async FindById(id: string): Promise<Medico | null> {
    const doc = await this.medicoModel.findById(id).exec();
  return doc
      ? new Medico(
          doc.id,
          doc.nombre,
          doc.estado,
          doc.especialidad
        )
      : null;
  }
  async UpdateMedico(paciente: Medico): Promise<void> {

    await this.medicoModel.findByIdAndUpdate(paciente.getId(), {
      nombre: paciente.getNombre(),
      estado: paciente.getEstado(),
      especialidad: paciente.getEspecialidad(),
    });
  }
  async DeleteMedico(id: string): Promise<string> {
    const query = await this.medicoModel.deleteOne({ _id: id });

    if (query.deletedCount == 1) return 'Medico removed';
    else return "Couldn't find medico to remove";
  }

  async DeleteAll(): Promise<string> {
      const query = await this.medicoModel.deleteMany();
      if(query.deletedCount > 0) return `Removed ${query.deletedCount} medicos`;
      else return `No medicos found on the database`;
  }

  async FindAll() : Promise<Medico[] | undefined>
  {
    const query = await this.medicoModel.find();
    if(query.length === 0) return undefined;

    else
    {
      const medicos:Medico[] = [];

      for(let i = 0; i < query.length; i++)
      {
        const doc = query[i];
        if(!doc) continue;
        medicos.push(new Medico(
          doc.id,
          doc.nombre,
          doc.estado,
          doc.especialidad
        ))
      }

      return medicos;
    }
  }
}
