//Use Cases
import { CreateProfileUseCase } from "../useCases/preferenciasUsuario/createProfile.useCase";
import { DeleteProfileUseCase } from "../useCases/preferenciasUsuario/deleteProfile.useCase";
import { GetCurrentProfileUseCase } from "../useCases/preferenciasUsuario/getCurrentProfile.useCase";
import { GetProfilesUseCase } from "../useCases/preferenciasUsuario/getProfilesUseCase";
import { GetProfileUseCase } from "../useCases/preferenciasUsuario/getProfile.useCase";
import { SetCurrentProfileUseCase } from "../useCases/preferenciasUsuario/setCurrentProfile.useCase";
import { UpdateProfileUseCase } from "../useCases/preferenciasUsuario/updateProfile.useCase";

//Repositories
import { userPreferencesRepository } from "../../infrastructure/db/preferenciaUsuario.repository";


export class PreferenciasUsuarioService
{
    constructor()
    {
        this.preferencesRepository = userPreferencesRepository;
    }

    async createProfile(userId, profileType, preferences)
    {
        const createProfile = new CreateProfileUseCase(userId, profileType, preferences);

        return await createProfile.execute();
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
        const getCurrentProfile = GetCurrentProfileUseCase(this.preferencesRepository);

        return await getCurrentProfile.execute(userId);
    }

    async setCurrentProfile(userId, profileType)
    {
        const setCurrentProfile = SetCurrentProfileUseCase(this.preferencesRepository);

        return await setCurrentProfile.execute(userId, profileType);
    }
}