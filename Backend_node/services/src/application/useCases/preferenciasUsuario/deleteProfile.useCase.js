export class DeleteProfileUseCase
{
    constructor(preferencesRepository)
    {
        this.preferencesRepository = preferencesRepository;
    }

    async execute(userId, profileType)
    {
        const deleted = await this.preferencesRepository.deleteProfile(userId, profileType);

        if(!deleted) throw new Error("Couldn't delete profile");
        
        return deleted;
    }
}