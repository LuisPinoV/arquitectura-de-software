export class RefreshUseCase
{
    constructor(cognitoRepository)
    {
        this.cognitoRepository = cognitoRepository;
    }

    async execute(refreshToken)
    {
        const refresh = await this.cognitoRepository.refreshSession(refreshToken);

        if(!refresh) throw new Error("Couldn't refresh user");

        return refresh;
    }
}