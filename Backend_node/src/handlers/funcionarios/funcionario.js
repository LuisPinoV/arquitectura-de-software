import { funcionarioRepository } from '../../infrastructure/db/funcionario.repository.js';

export const createFuncionario = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const nuevo = await funcionarioRepository.createFuncionario(body);

    return {
      statusCode: 201,
      body: JSON.stringify(nuevo),
    };
  } catch (error) {
    console.error('Error al crear funcionario:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al crear funcionario' }),
    };
  }
};

export const getFuncionario = async (event) => {
  try {
    const { funcionarioId } = event.pathParameters;
    const funcionario = await funcionarioRepository.getFuncionario(funcionarioId);

    if (!funcionario) {
      return { statusCode: 404, body: JSON.stringify({ message: 'Funcionario no encontrado' }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(funcionario),
    };
  } catch (error) {
    console.error('Error al obtener funcionario:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Error interno del servidor' }) };
  }
};

export const updateFuncionario = async (event) => {
  try {
    const { funcionarioId } = event.pathParameters;
    const updates = JSON.parse(event.body);
    const updated = await funcionarioRepository.updateFuncionario(funcionarioId, updates);

    return {
      statusCode: 200,
      body: JSON.stringify(updated),
    };
  } catch (error) {
    console.error('Error al actualizar funcionario:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Error interno del servidor' }) };
  }
};

export const deleteFuncionario = async (event) => {
  try {
    const { funcionarioId } = event.pathParameters;
    const eliminado = await funcionarioRepository.deleteFuncionario(funcionarioId);

    return {
      statusCode: 200,
      body: JSON.stringify(eliminado),
    };
  } catch (error) {
    console.error('Error al eliminar funcionario:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Error interno del servidor' }) };
  }
};

export const getFuncionarioAgendamientos = async (event) => {
  try {
    const { funcionarioId } = event.pathParameters;
    const funcionario = await funcionarioRepository.getFuncionario(funcionarioId);

    if (!funcionario) {
      return { statusCode: 404, body: JSON.stringify({ message: 'Funcionario no encontrado' }) };
    }

    const agendamientos = await funcionarioRepository.getAgendamientosByFuncionario(funcionarioId);

    return {
      statusCode: 200,
      body: JSON.stringify({ funcionario, agendamientos }),
    };
  } catch (error) {
    console.error('Error al obtener agendamientos del funcionario:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Error interno del servidor' }) };
  }
};
