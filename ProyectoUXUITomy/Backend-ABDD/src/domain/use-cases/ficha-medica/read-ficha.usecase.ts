import { IFichaMedicaRepository } from "src/domain/repositories/ficha-medica.repository";

export class ReadFichaMediaUseCase 
{
    constructor(private readonly fichaoRepo: IFichaMedicaRepository)
    {}

    async execute(id:string)
    {
        const ficha = await this.fichaoRepo.FindById(id);

        if(ficha === null) return "";

        return ficha.getJSONFichaMedica();
    }
}