export class LogoutUseCase
{
    constructor(cognitoRepository)
    {
        this.cognitoRepository = cognitoRepository;
    }

    async execute(accessToken)
    {
        const loggedOut = await this.cognitoRepository.logout(accessToken);

        if(!loggedOut) throw new Error("Couldn't log out user");

        return loggedOut;
    }
}