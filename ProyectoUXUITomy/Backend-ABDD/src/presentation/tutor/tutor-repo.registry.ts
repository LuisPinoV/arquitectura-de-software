import { Injectable } from "@nestjs/common";
import { ITutorRepository } from "src/domain/repositories/tutor.repository";

@Injectable()
export class TutorRepositoryRegistry
{
    private readonly registry = new Map<string, ITutorRepository>;

    register(dbKey:string, repo: ITutorRepository)
    {
        this.registry.set(dbKey, repo);
    }

    get(dbKey: string) : ITutorRepository
    {
        const repo = this.registry.get(dbKey);
        if(!repo)
        {
            throw new Error(`No database repository found with key ${dbKey}`)
        }

        return repo;
    }
}