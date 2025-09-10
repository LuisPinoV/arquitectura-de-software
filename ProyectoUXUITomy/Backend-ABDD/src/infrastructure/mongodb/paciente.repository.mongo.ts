import { IPacienteRepository } from 'src/domain/repositories/paciente.repository';
import { Paciente } from 'src/domain/entities/paciente.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PacienteMongo } from './schemas/paciente.schema';

export class MongoPacienteRepository implements IPacienteRepository {
  constructor(@InjectModel('Paciente') private pacienteModel: Model<PacienteMongo>) {}

  async CreatePaciente(paciente: Paciente): Promise<void> {
    await new this.pacienteModel({
      _id: paciente.getId(),
      nombre: paciente.getNombre(),
      tutor: paciente.getTutor(),
      raza: paciente.getRaza(),
      edad: paciente.getEdad(),
      especie: paciente.getEspecie(),
      genero: paciente.getGenero(),
    }).save();
  }
  async FindById(id: string): Promise<Paciente | null> {
    const doc = await this.pacienteModel.findById(id).exec();
  return doc
      ? new Paciente(
          doc.id,
          doc.tutor,
          doc.nombre,
          doc.raza,
          doc.edad,
          doc.especie,
          doc.genero,
        )
      : null;
  }
  async UpdatePaciente(paciente: Paciente): Promise<void> {

    await this.pacienteModel.findByIdAndUpdate(paciente.getId(), {
      nombre: paciente.getNombre(),
      tutor: paciente.getTutor(),
      raza: paciente.getRaza(),
      edad: paciente.getEdad(),
      especie: paciente.getEspecie(),
      genero: paciente.getGenero(),
    });
  }
  async DeletePaciente(id: string): Promise<string> {
    const query = await this.pacienteModel.deleteOne({ _id: id });

    if (query.deletedCount == 1) return "Patient removed";
    else return "Couldn't find patient to remove";
  }

  async DeleteAll(): Promise<string> {
      const query = await this.pacienteModel.deleteMany();
      if(query.deletedCount > 0) return `Removed ${query.deletedCount} patients`;
      else return `No patients found on the database`;
  }

  async FindAll() : Promise<Paciente[] | undefined>
  {
    const query = await this.pacienteModel.find();
    if(query.length === 0) return undefined;

    else
    {
      const pacientes:Paciente[] = [];

      for(let i = 0; i < query.length; i++)
      {
        const doc = query[i];
        if(!doc) continue;
        pacientes.push(new Paciente(
          doc.id,
          doc.tutor,
          doc.nombre,
          doc.raza,
          doc.edad,
          doc.especie,
          doc.genero,
        ))
      }

      return pacientes;
    }
  }
}
