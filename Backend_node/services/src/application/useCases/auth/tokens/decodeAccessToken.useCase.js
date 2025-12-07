export class DecodeAccessTokenUseCase
{
    constructor(tokenRepository)
    {
        this.tokenRepository = tokenRepository;
    }

    execute(accessToken)
    {
        const decoded = this.tokenRepository.decodeAccessToken(accessToken);

        if(!decoded) throw new Error("Couldn't decode access token");

        return decoded;
    }
}