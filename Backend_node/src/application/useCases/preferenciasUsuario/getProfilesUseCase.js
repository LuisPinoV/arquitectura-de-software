export class GetProfilesUseCase
{
    constructor(preferencesRepository)
    {
        this.preferencesRepository = preferencesRepository;
    }

    async execute(userId)
    {
        const userProfiles = await this.preferencesRepository.getProfilesByUserId(userId);

        if(!userProfiles) throw new Error("Couldn't get user profiles");

        return userProfiles;
    }
}