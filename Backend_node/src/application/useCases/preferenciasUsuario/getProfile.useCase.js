export class GetProfileUseCase
{
    constructor(preferencesRepository)
    {
        this.preferencesRepository = preferencesRepository;
    }

    async execute(userId, profileType)
    {
        const profile = await this.preferencesRepository.getProfile(userId, profileType);

        if(!profile) throw new Error("Couldn't get user profile");

        return profile;
    }
}