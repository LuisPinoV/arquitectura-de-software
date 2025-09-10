import { Controller, Get, Param, Post } from '@nestjs/common';
import { QueriesService } from 'src/application/services/queries.service';

@Controller('queries')
export class QueriesController {
  constructor(
    private readonly queriesService:QueriesService,
  ) {}

  @Get('search-ficha-mascota/:id')
  SearchPet(@Param('id') idMascota:string) 
  {
    const repos = ["mongo", "dynamo", "cassandra"];
    return this.queriesService.SearchMascota(repos, idMascota);
  }

  @Get('ranking-monetario-procedimientos')
  RankProceduresByMoney() 
  {
    const repos = ["mongo", "dynamo", "cassandra"];
    return this.queriesService.RankByAveragePrice(repos);
  }

  @Get('ranking-vacunas-frecuencia')
  RankVaccinesByFrecuency() 
  {
    const repos = ["mongo", "dynamo", "cassandra"];
    return this.queriesService.GetVacunasMasFrecuentes(repos);
  }

  @Get('promedio-mascotas')
  AveragePets() 
  {
    const repos = ["mongo", "dynamo", "cassandra"];
    return this.queriesService.GetPromedioMascotasPorTutor(repos);
  }

  @Get('medicinas-cantidad-promedio')
  AverageMeds() 
  {
    const repos = ["mongo", "dynamo", "cassandra"];
    return this.queriesService.GetAverageAmountOfMeds(repos);
  }

  @Get('medicos-trabajo-cantidad')
  AmountMedicWork()
  {
    const repos = ["mongo", "dynamo", "cassandra"];
    return this.queriesService.GetMedicsSortedByWork(repos);
  }

  @Get('cantidad-visitas-pagadas')
  PaidVisits()
  {
    const repos = ["mongo", "dynamo", "cassandra"];
    return this.queriesService.GetVisitsPaid(repos);
  }
}
