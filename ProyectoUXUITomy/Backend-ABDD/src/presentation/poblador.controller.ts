import { Controller, Headers, Post } from '@nestjs/common';
import { PobladorService } from 'src/application/services/poblador.service';

@Controller('poblador')
export class PobladorController {
  constructor(
    private readonly pobladorService:PobladorService,
  ) {}

  @Post('poblar-todo')
  create() 
  {
    const repos = ["mongo", "dynamo", "cassandra"];
    return this.pobladorService.CreateEverything(repos); 
  }

  @Post('poblar-todo-por-db')
  createByDB(@Headers('db') dbKey:string) 
  {
    return this.pobladorService.CreateEverything([dbKey]); 
  }

  @Post('borrar-todo')
  deleteAll() 
  {
    const repos = ["mongo", "dynamo", "cassandra"];
    return this.pobladorService.DeleteEverything(repos); 
  }
}
