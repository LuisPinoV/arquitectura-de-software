export class PublishCreateUserUseCase
{
    constructor(snsRepository)
    {
        this.snsRepository = snsRepository;
    }

    async execute(username, userId)
    {
        const createUserMessage = await this.snsRepository.onCreatedUser(username, userId);

        if(!createUserMessage) throw new Error("Couldn't publish create user message");

        return createUserMessage;
    }
}