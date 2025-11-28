export class SaveResfreshTokenUseCase
{
    constructor(tokenRepository)
    {
        this.tokenRepository = tokenRepository;
    }

    async execute(userId, token, expireTime)
    {
        const saveRefreshToken = await this.tokenRepository.saveRefreshToken(userId, token, expireTime);

        if(!saveRefreshToken) throw new Error("Couldn't save refresh token");

        return saveRefreshToken;
    }
}