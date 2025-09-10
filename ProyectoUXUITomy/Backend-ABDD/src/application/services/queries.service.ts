import { Injectable } from '@nestjs/common';
import { GetProceduresAndMoneyFichaMedicaUseCase } from 'src/domain/use-cases/queries/get-procedures-cost.usecase';
import { FindPetAllDBsUseCase } from 'src/domain/use-cases/queries/find-pet.usecase';
import { FichaMedicaRepositoryRegistry } from 'src/presentation/ficha-medica/ficha-medica.registry';
import { MedicoRepositoryRegistry } from 'src/presentation/medico/medico-repo.registry';
import { PacienteRepositoryRegistry } from 'src/presentation/paciente/paciente-repo.registry';
import { TutorRepositoryRegistry } from 'src/presentation/tutor/tutor-repo.registry';
import { MostUsedVaccinesUseCase } from 'src/domain/use-cases/queries/most-used-vaccines.usecase';
import { AveragePetsUseCase } from 'src/domain/use-cases/queries/promedio-mascotas.usecase';
import { AllMedsDBsUseCase } from 'src/domain/use-cases/queries/all-meds.usecase';
import { GetMedicsWithNameUseCase } from 'src/domain/use-cases/queries/get-medics.usecase';
import { PaidVisitsUseCase } from 'src/domain/use-cases/queries/paid-visit.usecase';
import { promises as fs } from 'fs';

//This backend was made on a week, using a combination of blood, sweat and tears, mostly tears, mostly blood, hope you like it :) -TS with love <3
@Injectable()
export class QueriesService {
  constructor(
    private readonly pacienteRegistry: PacienteRepositoryRegistry,
    private readonly medicoRegistry: MedicoRepositoryRegistry,
    private readonly tutorRegistry: TutorRepositoryRegistry,
    private readonly fichaRegistry: FichaMedicaRepositoryRegistry,
  ) {}

  async SearchMascota(dbs: string[], idMascota: string) {
    for (let i = 0; i < dbs.length; i++) {
      const curDB = dbs[i];

      const fichaRepo = this.fichaRegistry.get(curDB);
      const pacienteRepo = this.pacienteRegistry.get(curDB);

      const useCase = new FindPetAllDBsUseCase(fichaRepo, pacienteRepo);

      const pet = await useCase.execute(idMascota);

      if (pet !== null && pet !== undefined) return pet;
    }
  }

  async RankByAveragePrice(dbs: string[]) {
    let procedures: { procedimiento: string; costo: Number }[] = [];

    for (let i = 0; i < dbs.length; i++) {
      const curDB = dbs[i];
      const fichaRepo = this.fichaRegistry.get(curDB);

      const useCase = new GetProceduresAndMoneyFichaMedicaUseCase(fichaRepo);

      let curProcedures;

      await this.logDuration(`RankByAveragePrice-${curDB}`, async () => {
          curProcedures = await useCase.execute();
      })

      if (curProcedures !== null && curProcedures !== undefined) {
        procedures = procedures.concat(curProcedures);
      }
    }

    const groupedWithAvg = this.groupByAvg(procedures);
    return this.sortByCostDesc(
      groupedWithAvg.map((item) => ({
        procedimiento: item.procedimiento,
        costo: item.promedioCosto,
      })),
    );
  }

  async GetVacunasMasFrecuentes(dbs: string[]) {
    let vacunas: string[] = [];

    for (let i = 0; i < dbs.length; i++) {
      const curDB = dbs[i];
      const fichaRepo = this.fichaRegistry.get(curDB);

      const useCase = new MostUsedVaccinesUseCase(fichaRepo);

      //const curVacunas = await useCase.execute();

      let curVacunas;

      await this.logDuration(`GetVacunasMasFrecuentes-${curDB}`, async () => {
          curVacunas = await useCase.execute();
      })

      if (curVacunas !== null && curVacunas !== undefined) {
        vacunas = vacunas.concat(curVacunas);
      }
    }

    return this.sortByFrecuencyDesc(this.groupByFrecuencyVacunas(vacunas));
  }

  async GetPromedioMascotasPorTutor(dbs: string[]) {
    let mascotas: Number[] = [];

    for (let i = 0; i < dbs.length; i++) {
      const curDB = dbs[i];
      const tutorRepo = this.tutorRegistry.get(curDB);

      const useCase = new AveragePetsUseCase(tutorRepo);

      let curMascotas:Number[] | null = [];

      await this.logDuration(`GetPromedioMascotasPorTutor-${curDB}`, async () => {
          curMascotas = await useCase.execute();
      })
      
      //const curMascotas = await useCase.execute();

      if (curMascotas !== null && curMascotas !== undefined) {
        mascotas = mascotas.concat(curMascotas);
      }
    }

    const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

    return { promedioMascotas: average(mascotas) };
  }

  async GetAverageAmountOfMeds(dbs: string[]) {
    let meds: { medicamento: string; cantidad: Number }[] = [];

    for (let i = 0; i < dbs.length; i++) {
      const curDB = dbs[i];
      const fichaRepo = this.fichaRegistry.get(curDB);

      const useCase = new AllMedsDBsUseCase(fichaRepo);

      //const curMeds = await useCase.execute();

      let curMeds;

      await this.logDuration(`GetAverageAmountOfMeds-${curDB}`, async () => {
          curMeds = await useCase.execute();
      })

      if (curMeds !== null && curMeds !== undefined) {
        meds = meds.concat(curMeds);
      }
    }

    const avg = this.groupByFrecuencyMeds(meds);

    return this.sortByAvgMedsDesc(avg);
  }

  async GetMedicsSortedByWork(dbs: string[]) {
    let medicos: string[] = [];

    for (let i = 0; i < dbs.length; i++) {
      const curDB = dbs[i];

      const fichaRepo = this.fichaRegistry.get(curDB);
      const medicoRepo = this.medicoRegistry.get(curDB);

      const useCase = new GetMedicsWithNameUseCase(fichaRepo, medicoRepo);
      //const curMedicos = await useCase.execute();

      let curMedicos;

      await this.logDuration(`GetMedicsSortedByWork-${curDB}`, async () => {
          curMedicos = await useCase.execute();
      })

      if (curMedicos !== null && curMedicos !== undefined) {
        medicos = medicos.concat(curMedicos);
      }
    }

    return this.sortByMedicsFrecuency(this.groupByFrecuencyMedics(medicos));
  }

  async GetVisitsPaid(dbs: string[]) {
    let pagados: boolean[] = [];

    for (let i = 0; i < dbs.length; i++) {
      const curDB = dbs[i];

      const fichaRepo = this.fichaRegistry.get(curDB);

      const useCase = new PaidVisitsUseCase(fichaRepo);
      //const curPagado = await useCase.execute();

      let curPagado;

      await this.logDuration(`GetVisitsPaid-${curDB}`, async () => {
          curPagado = await useCase.execute();
      })

      if (curPagado !== null && curPagado !== undefined) {
        pagados = pagados.concat(curPagado);
      }
    }

    return this.groupByPaidVisit(pagados);
  }

  private groupByAvg(
    procedimientos: { procedimiento: string; costo: Number }[],
  ) {
    const grouped: Record<string, { total: number; count: number }> = {};

    for (const procedimiento of procedimientos) {
      if (!grouped[procedimiento.procedimiento]) {
        grouped[procedimiento.procedimiento] = { total: 0, count: 0 };
      }
      grouped[procedimiento.procedimiento].total +=
        procedimiento.costo.valueOf();
      grouped[procedimiento.procedimiento].count += 1;
    }

    const avgList = Object.entries(grouped).map(
      ([procedimiento, statistics]) => ({
        procedimiento,
        promedioCosto: Math.round(statistics.total / statistics.count),
      }),
    );
    return avgList;
  }

  private groupByFrecuencyMeds(
    meds: { medicamento: string; cantidad: Number }[],
  ) {
    const grouped: Record<string, { amount: number; count: number }> = {};

    for (const med of meds) {
      if (!grouped[med.medicamento]) {
        grouped[med.medicamento] = { amount: 0, count: 0 };
      }
      grouped[med.medicamento].amount += med.cantidad.valueOf();
      grouped[med.medicamento].count += 1;
    }

    const avgList = Object.entries(grouped).map(([med, stats]) => ({
      nombreMedicamento: med,
      promedio: stats.amount / stats.count,
    }));
    return avgList;
  }

  private groupByFrecuencyMedics(medicos: string[]) {
    const grouped: Record<string, { count: number }> = {};

    for (const medico of medicos) {
      if (!grouped[medico]) {
        grouped[medico] = { count: 0 };
      }
      grouped[medico].count += 1;
    }

    const avgList = Object.entries(grouped).map(([medico, stats]) => ({
      nombre: medico,
      cantidadTrabajo: stats.count,
    }));
    return avgList;
  }

  private groupByPaidVisit(pagados: boolean[]) {
    const grouped: Record<string, { count: number }> = {};

    for (const pagado of pagados) {
      const pagadoStr = pagado ? 'Pagado' : 'No Pagado';
      if (!grouped[pagadoStr]) {
        grouped[pagadoStr] = { count: 0 };
      }
      grouped[pagadoStr].count += 1;
    }

    const avgList = Object.entries(grouped).map(([pagadoStr, stats]) => ({
      nombre: pagadoStr,
      cantidad: stats.count,
    }));
    return avgList;
  }

  private groupByFrecuencyVacunas(vacunas: string[]) {
    const grouped: Record<string, { count: number }> = {};

    for (const vacuna of vacunas) {
      if (!grouped[vacuna]) {
        grouped[vacuna] = { count: 0 };
      }
      grouped[vacuna].count += 1;
    }

    const avgList = Object.entries(grouped).map(([vacuna, stats]) => ({
      nombreVacuna: vacuna,
      frecuencia: stats.count,
    }));
    return avgList;
  }

  private sortByAvgMedsDesc(
    meds: { nombreMedicamento: string; promedio: Number }[],
  ) {
    return [...meds].sort(
      (a, b) => b.promedio.valueOf() - a.promedio.valueOf(),
    );
  }

  private sortByMedicsFrecuency(
    medicos: { nombre: string; cantidadTrabajo: Number }[],
  ) {
    return [...medicos].sort(
      (a, b) => b.cantidadTrabajo.valueOf() - a.cantidadTrabajo.valueOf(),
    );
  }

  private sortByCostDesc(
    procedimientos: { procedimiento: string; costo: Number }[],
  ) {
    return [...procedimientos].sort(
      (a, b) => b.costo.valueOf() - a.costo.valueOf(),
    );
  }

  private sortByFrecuencyDesc(
    vacunas: { nombreVacuna: string; frecuencia: Number }[],
  ) {
    return [...vacunas].sort(
      (a, b) => b.frecuencia.valueOf() - a.frecuencia.valueOf(),
    );
  }

  //Function from the internet to get logs on js
  async logDuration(label: string, fn: () => Promise<any>) {
    const start = Date.now();
    const result = await fn();
    const duration = Date.now() - start;
    const logEntry = `[${new Date().toISOString()}] ${label}: ${duration} ms\n`;

    await fs.appendFile('logs.txt', logEntry);
    return result;
  }
}
