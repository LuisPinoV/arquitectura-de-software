import { userPreferencesRepository } from '../../infrastructure/preferenciasUsuario/preferenciaUsuario.repository.js';

export const createProfile = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { userId, profileType, preferences } = body;

    const profile = await userPreferencesRepository.createProfile(
      userId, 
      profileType, 
      preferences
    );

    return {
      statusCode: 201,
      body: JSON.stringify({ 
        message: "Perfil creado correctamente",
        profile 
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const getProfile = async (event) => {
  try {
    const { userId, profileType } = event.pathParameters;
    const profile = await userPreferencesRepository.getProfile(userId, profileType);

    if (!profile) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Perfil no encontrado" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(profile),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const getProfiles = async (event) => {
  try {
    const { userId } = event.pathParameters;
    const profiles = await userPreferencesRepository.getProfilesByUserId(userId);

    if (profiles.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Usuario no encontrado" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(profiles),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const updateProfile = async (event) => {
  try {
    const { userId, profileType } = event.pathParameters;
    const body = JSON.parse(event.body);

    const updatedProfile = await userPreferencesRepository.updateProfile(
      userId, 
      profileType, 
      body.preferences
    );

    return {
      statusCode: 200,
      body: JSON.stringify(updatedProfile),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const deleteProfile = async (event) => {
  try {
    const { userId, profileType } = event.pathParameters;
    await userPreferencesRepository.deleteProfile(userId, profileType);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Perfil eliminado correctamente" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const getCurrentProfile = async (event) => {
  try {
    const { userId } = event.pathParameters;
    const currentProfile = await userPreferencesRepository.getCurrentProfile(userId);

    return {
      statusCode: 200,
      body: JSON.stringify(currentProfile),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const setCurrentProfile = async (event) => {
  try {
    const { userId, profileType } = event.pathParameters;
    await userPreferencesRepository.setCurrentProfile(userId, profileType);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Perfil marcado como actual" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};