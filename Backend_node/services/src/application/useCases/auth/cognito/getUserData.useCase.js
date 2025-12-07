export class GetUserDataUseCase
{
    constructor(cognitoRepository)
    {
        this.cognitoRepository = cognitoRepository;
    }

    async execute(accessToken)
    {
        const userData = await this.cognitoRepository.getUserData(accessToken);

        if(!userData) throw new Error("Couldn't get user data");

        return userData;
    }
}