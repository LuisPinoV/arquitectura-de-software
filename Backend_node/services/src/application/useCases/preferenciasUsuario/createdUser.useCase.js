export class CreatedUserUseCase
{
    constructor(preferencesRepository)
    {
        this.preferencesRepository = preferencesRepository;
    }

    async execute(userId, username)
    {
        const created = await this.preferencesRepository.onCreatedNewUser(userId, username);

        if(!created) throw new Error("Couldn't create profile");

        return created;
    }
}