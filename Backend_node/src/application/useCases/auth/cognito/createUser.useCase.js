export class CreateUserUseCase
{
    constructor(cognitoRepository)
    {
        this.cognitoRepository = cognitoRepository;
    }

    async execute(username, password, name = null, companyName = null, spaceName = null)
    {
        const newAccount = await this.cognitoRepository.createUser(username, password, name, companyName, spaceName);

        if(!newAccount) throw new Error("Couldn't create user");

        return newAccount;
    }
}