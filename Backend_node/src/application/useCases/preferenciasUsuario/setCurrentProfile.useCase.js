export class SetCurrentProfileUseCase
{
    constructor(preferencesRepository)
    {
        this.preferencesRepository = preferencesRepository;
    }

    async execute(userId, profileType)
    {
        
        const setCurProfile = await this.preferencesRepository.setCurrentProfile(userId, profileType);

        if(!setCurProfile) throw new Error("Couldn't set user's current profile");
        
        return setCurProfile;
    }
}