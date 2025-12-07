export class UpdateProfileUseCase
{
    constructor(preferencesRepository)
    {
        this.preferencesRepository = preferencesRepository;
    }

    async execute(userId, profileType, preferences)
    {
        const updated = await this.preferencesRepository.updateProfile(userId, profileType, preferences);

        if(!updated) throw new Error("Couldn't update profile");

        return updated;
    }
}