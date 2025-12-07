export class InvalidateTokenUseCase
{
    constructor(tokenRepository)
    {
        this.tokenRepository = tokenRepository;
    }

    async execute(userId)
    {
        const invalidateToken = await this.tokenRepository.invalidateTokens(userId);

        if(!invalidateToken) throw new Error("Couldn't invalidate refresh token");

        return invalidateToken;
    }
}