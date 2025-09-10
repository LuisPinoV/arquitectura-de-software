import { Injectable } from "@nestjs/common";
import { IPacienteRepository } from "src/domain/repositories/paciente.repository";

@Injectable()
export class PacienteRepositoryRegistry
{
    private readonly registry = new Map<string, IPacienteRepository>;

    register(dbKey:string, repo: IPacienteRepository)
    {
        this.registry.set(dbKey, repo);
    }

    get(dbKey: string) : IPacienteRepository
    {
        const repo = this.registry.get(dbKey);
        if(!repo)
        {
            throw new Error(`No database repository found with key ${dbKey}`)
        }

        return repo;
    }
}