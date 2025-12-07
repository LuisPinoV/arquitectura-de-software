export class GetCurrentProfileUseCase
{
    constructor(preferencesRepository)
    {
        this.preferencesRepository = preferencesRepository;
    }

    async execute(userId)
    {
        const curProfile = await this.preferencesRepository.getCurrentProfile(userId);

        if(!curProfile) throw new Error("Couldn't get current profile");
        
        return curProfile;
    }
}