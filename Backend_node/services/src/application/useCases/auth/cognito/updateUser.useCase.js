export class UpdateUserUseCase
{
    constructor(cognitoRepository)
    {
        this.cognitoRepository = cognitoRepository;
    }

    async execute(username, attrs)
    {
        const userData = await this.cognitoRepository.updateUserAttributes(username, attrs);

        if(!userData) throw new Error("Couldn't update user");

        return userData;
    }
}