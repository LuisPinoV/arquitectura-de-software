export class UpdateResfreshTokenUseCase
{
    constructor(tokenRepository)
    {
        this.tokenRepository = tokenRepository;
    }

    async execute(userId, newToken, newExpireTime)
    {
        const saveRefreshToken = await this.tokenRepository.updateRefreshToken(userId, newToken, newExpireTime);

        if(!saveRefreshToken) throw new Error("Couldn't update refresh token");

        return saveRefreshToken;
    }
}