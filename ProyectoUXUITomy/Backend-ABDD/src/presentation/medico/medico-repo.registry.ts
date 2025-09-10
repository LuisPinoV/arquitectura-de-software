import { Injectable } from "@nestjs/common";
import { IMedicoRepository } from "src/domain/repositories/medico.repository";

@Injectable()
export class MedicoRepositoryRegistry
{
    private readonly registry = new Map<string, IMedicoRepository>;

    register(dbKey:string, repo: IMedicoRepository)
    {
        this.registry.set(dbKey, repo);
    }

    get(dbKey: string) : IMedicoRepository
    {
        const repo = this.registry.get(dbKey);
        if(!repo)
        {
            throw new Error(`No database repository found with key ${dbKey}`)
        }

        return repo;
    }
}