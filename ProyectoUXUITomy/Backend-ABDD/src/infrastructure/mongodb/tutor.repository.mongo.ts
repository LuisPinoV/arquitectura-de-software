import { ITutorRepository } from 'src/domain/repositories/tutor.repository';
import { Tutor } from 'src/domain/entities/tutor.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TutorMongo } from './schemas/tutor.schema';

export class TutorMongoRepository implements ITutorRepository {
  constructor(@InjectModel('Tutor') private tutorModel: Model<TutorMongo>) {}
  async CreateTutor(tutor: Tutor): Promise<void> {
    await new this.tutorModel({
      _id: tutor.getId(),
      nombre: tutor.getNombre(),
      idMascotas: tutor.getMascotas()
    }).save();
  }
  async FindById(id: string): Promise<Tutor | null> {
    const doc = await this.tutorModel.findById(id).exec();
  return doc
      ? new Tutor(
          doc.id,
          doc.nombre,
          doc.idMascotas
        )
      : null;
  }
  async UpdateTutor(tutor: Tutor): Promise<void> {

    await this.tutorModel.findByIdAndUpdate(tutor.getId(), {
      nombre: tutor.getNombre(),
      idMascotas: tutor.getMascotas()
    });
  }
  async DeleteTutor(id: string): Promise<string> {
    const query = await this.tutorModel.deleteOne({ _id: id });

    if (query.deletedCount == 1) return 'Patient removed';
    else return "Couldn't find patient to remove";
  }

  async DeleteAll(): Promise<string> {
      const query = await this.tutorModel.deleteMany();
      if(query.deletedCount > 0) return `Removed ${query.deletedCount} patients`;
      else return `No patients found on the databse`;
  }

  async FindAll() : Promise<Tutor[] | undefined>
  {
    const query = await this.tutorModel.find();
    if(query.length === 0) return undefined;

    else
    {
      const pacientes:Tutor[] = [];

      for(let i = 0; i < query.length; i++)
      {
        const doc = query[i];
        if(!doc) continue;
        pacientes.push(new Tutor(
          doc.id,
          doc.nombre,
          doc.idMascotas
        ))
      }

      return pacientes;
    }
  }

  async MascotasTotales(): Promise<Number[] | null> {
    const query = await this.tutorModel.find();
    if(query.length === 0) return null;

    const mascotas = query.map((item) => item.idMascotas.length);

    return mascotas;
  }
}
