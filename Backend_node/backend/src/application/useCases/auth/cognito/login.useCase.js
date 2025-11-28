export class LoginUseCase
{
    constructor(cognitoRepository)
    {
        this.cognitoRepository = cognitoRepository;
    }

    async execute(username, password)
    {
        const userData = await this.cognitoRepository.login(username, password);

        if(!userData) throw new Error("Couldn't authorize user");

        return userData;
    }
}