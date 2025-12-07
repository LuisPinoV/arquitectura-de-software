export class CreateProfileUseCase
{
    constructor(preferencesRepository)
    {
        this.preferencesRepository = preferencesRepository;
    }

    async execute(userId, profileType, preferences)
    {
        const created = await this.preferencesRepository.createProfile(userId, profileType, preferences);

        if(!created) throw new Error("Couldn't create profile");

        return created;
    }
}