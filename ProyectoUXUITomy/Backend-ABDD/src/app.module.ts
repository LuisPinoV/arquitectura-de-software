import { Module } from '@nestjs/common';
import { PacienteModule } from './presentation/paciente/paciente.module';
import { DBConfigModule } from './db-config.module';
import { TutorModule } from './presentation/tutor/tutor.module';
import { MedicoModule } from './presentation/medico/medico.module';
import { FichaMedicaModule } from './presentation/ficha-medica/ficha-medica.module';
import { PobladorModule } from './presentation/poblador/poblador.module';
import { QueriesModule } from './presentation/queries/queries.module';

@Module({
  imports: [
    DBConfigModule,
    PacienteModule,
    TutorModule,
    MedicoModule,
    FichaMedicaModule,
    PobladorModule,
    QueriesModule
  ],
})
export class AppModule {}