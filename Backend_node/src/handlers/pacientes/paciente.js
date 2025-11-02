import { pacienteRepository } from '../../infrastructure/db/paciente.repository.js';

export const createPaciente = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const nuevoPaciente = await pacienteRepository.createPaciente(body);

    return {
      statusCode: 201,
      body: JSON.stringify(nuevoPaciente),
    };
  } catch (error) {
    console.error('Error al crear paciente:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al crear paciente' }),
    };
  }
};


export const getPaciente = async (event) => {
  try {
    const { pacienteId } = event.pathParameters;
    const paciente = await pacienteRepository.getPaciente(pacienteId);

    if (!paciente) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Paciente no encontrado' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(paciente),
    };
  } catch (error) {
    console.error('Error al obtener paciente:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al obtener paciente' }),
    };
  }
};


export const getPacienteAgendamientos = async (event) => {
  try {
    const { pacienteId } = event.pathParameters;

    const paciente = await pacienteRepository.getPaciente(pacienteId);
    if (!paciente) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Paciente no encontrado' }),
      };
    }

    const agendamientos = await pacienteRepository.getAgendamientosByPaciente(pacienteId);

    return {
      statusCode: 200,
      body: JSON.stringify({ paciente, agendamientos }),
    };
  } catch (error) {
    console.error('Error al obtener paciente con agendamientos:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor' }),
    };
  }
};


export const updatePaciente = async (event) => {
  try {
    const { pacienteId } = event.pathParameters;
    const updates = JSON.parse(event.body);

    const actualizado = await pacienteRepository.updatePaciente(pacienteId, updates);

    return {
      statusCode: 200,
      body: JSON.stringify(actualizado),
    };
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al actualizar paciente' }),
    };
  }
};


export const deletePaciente = async (event) => {
  try {
    const { pacienteId } = event.pathParameters;
    console.log("Handler -> pacienteId:", pacienteId);

    if (!pacienteId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Falta el parámetro pacienteId en la ruta" }),
      };
    }

    const eliminado = await pacienteRepository.deletePaciente(pacienteId);

    return {
      statusCode: 200,
      body: JSON.stringify(eliminado),
    };
  } catch (error) {
    console.error("Error al eliminar paciente:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error al eliminar paciente" }),
    };
  }
};



export const createAgendamiento = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const nuevo = await pacienteRepository.createAgendamiento(body);

    return {
      statusCode: 201,
      body: JSON.stringify(nuevo),
    };
  } catch (error) {
    console.error('Error al crear agendamiento:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al crear agendamiento' }),
    };
  }
};
