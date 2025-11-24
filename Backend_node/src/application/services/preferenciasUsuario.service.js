//Use Cases
import { CreateProfileUseCase } from "../useCases/preferenciasUsuario/createProfile.useCase.js";
import { DeleteProfileUseCase } from "../useCases/preferenciasUsuario/deleteProfile.useCase.js";
import { GetCurrentProfileUseCase } from "../useCases/preferenciasUsuario/getCurrentProfile.useCase.js";
import { GetProfilesUseCase } from "../useCases/preferenciasUsuario/getProfilesUseCase.js";
import { GetProfileUseCase } from "../useCases/preferenciasUsuario/getProfile.useCase.js";
import { SetCurrentProfileUseCase } from "../useCases/preferenciasUsuario/setCurrentProfile.useCase.js";
import { UpdateProfileUseCase } from "../useCases/preferenciasUsuario/updateProfile.useCase.js";
import { CreatedUserUseCase } from "../useCases/preferenciasUsuario/createdUser.useCase.js";


//Repositories
import { userPreferencesRepository } from "../../infrastructure/db/preferenciaUsuario.repository.js";


export class PreferenciasUsuarioService
{
    constructor()
    {
        this.preferencesRepository = userPreferencesRepository;
    }

    async createProfile(userId, profileType, preferences)
    {
        const createProfile = new CreateProfileUseCase(this.preferencesRepository);

        return await createProfile.execute(userId, profileType, preferences);
    }

    async getProfile(userId, profileType)
    {
        const getProfile = new GetProfileUseCase(this.preferencesRepository);

        return await getProfile.execute(userId, profileType);
    }

    async getProfiles(userId)
    {
        const getProfiles = new GetProfilesUseCase(this.preferencesRepository);

        return await getProfiles.execute(userId);
    }

    async updateProfile(userId, profileType)
    {
        const updateProfile = new UpdateProfileUseCase(this.preferencesRepository);

        return await updateProfile.execute(userId, profileType);
    }

    async deleteProfile(userId, profileType)
    {
        const deleteProfile = new DeleteProfileUseCase(this.preferencesRepository);

        return await deleteProfile.execute(userId, profileType);
    }

    async getCurrentProfile(userId)
    {
        const getCurrentProfile = new GetCurrentProfileUseCase(this.preferencesRepository);

        return await getCurrentProfile.execute(userId);
    }

    async setCurrentProfile(userId, profileType)
    {
        const setCurrentProfile = new SetCurrentProfileUseCase(this.preferencesRepository);

        return await setCurrentProfile.execute(userId, profileType);
    }

    async onCreatedUser(userId, username)
    {
        const onCreateUser = new CreatedUserUseCase(this.preferencesRepository);

        return await onCreateUser.execute(userId, username);
    }
}