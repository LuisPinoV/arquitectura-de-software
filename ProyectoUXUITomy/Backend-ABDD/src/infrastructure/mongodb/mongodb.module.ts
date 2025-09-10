import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PacienteSchema } from './schemas/paciente.schema';
import { MongoPacienteRepository } from './paciente.repository.mongo';
import { TutorMongoRepository } from './tutor.repository.mongo';
import { MongoMedicoRepository } from './medico.repository.mongo';
import { TutorSchema } from './schemas/tutor.schema';
import { MedicoSchema } from './schemas/medico.schema';
import { FichaMedicaSchema } from './schemas/ficha-medica.schema';
import { MongoFichaMedicaRepository } from './ficha-medica.repository.mongo';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Paciente', schema: PacienteSchema },
      { name: 'Tutor', schema: TutorSchema },
      { name: 'Medico', schema: MedicoSchema },
      { name: 'FichaMedica', schema: FichaMedicaSchema}

    ]),
  ],
  providers: [MongoPacienteRepository, TutorMongoRepository, MongoMedicoRepository, MongoFichaMedicaRepository],
  exports: [MongoPacienteRepository, TutorMongoRepository, MongoMedicoRepository, MongoFichaMedicaRepository],
})
export class MongoDBModule {}
