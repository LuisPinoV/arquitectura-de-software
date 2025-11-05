export class RefreshUseCase
{
    constructor(cognitoRepository)
    {
        this.cognitoRepository = cognitoRepository;
    }

    async execute(refreshToken)
    {
        const loggedOut = await this.cognitoRepository.refresh(refreshToken);

        if(!loggedOut) throw new Error("Couldn't log out user");

        return loggedOut;
    }
}