import { Injectable } from "@nestjs/common";
import { IFichaMedicaRepository } from "src/domain/repositories/ficha-medica.repository";

@Injectable()
export class FichaMedicaRepositoryRegistry
{
    private readonly registry = new Map<string, IFichaMedicaRepository>;

    register(dbKey:string, repo: IFichaMedicaRepository)
    {
        this.registry.set(dbKey, repo);
    }

    get(dbKey: string) : IFichaMedicaRepository
    {
        const repo = this.registry.get(dbKey);
        if(!repo)
        {
            throw new Error(`No database repository found with key ${dbKey}`)
        }

        return repo;
    }
}