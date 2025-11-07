export class CreateUserUseCase
{
    constructor(cognitoRepository)
    {
        this.cognitoRepository = cognitoRepository;
    }

    async execute(username, password)
    {
        const newAccount = await this.cognitoRepository.createUser(username, password);

        if(!newAccount) throw new Error("Couldn't create user");

        return newAccount;
    }
}