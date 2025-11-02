import { boxRepository } from '../../infrastructure/db/box.repository.js';

export const createBox = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const box = await boxRepository.createBox(body);
    return {
      statusCode: 201,
      body: JSON.stringify(box),
    };
  } catch (error) {
    console.error("Error al crear box:", error);
    return { statusCode: 500, body: JSON.stringify({ message: "Error interno" }) };
  }
};

export const getBox = async (event) => {
  try {
    const { idBox } = event.pathParameters;
    const box = await boxRepository.getBox(idBox);
    if (!box)
      return { statusCode: 404, body: JSON.stringify({ message: "Box no encontrado" }) };
    return { statusCode: 200, body: JSON.stringify(box) };
  } catch (error) {
    console.error("Error al obtener box:", error);
    return { statusCode: 500, body: JSON.stringify({ message: "Error interno" }) };
  }
};

export const getAllBoxes = async () => {
  try {
    const boxes = await boxRepository.getAllBoxes();
    return { statusCode: 200, body: JSON.stringify(boxes) };
  } catch (error) {
    console.error("Error al obtener boxes:", error);
    return { statusCode: 500, body: JSON.stringify({ message: "Error interno" }) };
  }
};

export const updateBox = async (event) => {
  try {
    const { idBox } = event.pathParameters;
    const updates = JSON.parse(event.body);
    const updated = await boxRepository.updateBox(idBox, updates);
    return { statusCode: 200, body: JSON.stringify(updated) };
  } catch (error) {
    console.error("Error al actualizar box:", error);
    return { statusCode: 500, body: JSON.stringify({ message: "Error interno" }) };
  }
};

export const deleteBox = async (event) => {
  try {
    const { idBox } = event.pathParameters;
    const deleted = await boxRepository.deleteBox(idBox);
    return { statusCode: 200, body: JSON.stringify(deleted) };
  } catch (error) {
    console.error("Error al eliminar box:", error);
    return { statusCode: 500, body: JSON.stringify({ message: "Error interno" }) };
  }
};

export const getBoxAgendamientos = async (event) => {
  try {
    const { idBox } = event.pathParameters;
    const box = await boxRepository.getBox(idBox);
    if (!box)
      return { statusCode: 404, body: JSON.stringify({ message: "Box no encontrado" }) };

    const agendamientos = await boxRepository.getAgendamientosByBox(idBox);
    return {
      statusCode: 200,
      body: JSON.stringify({ box, agendamientos }),
    };
  } catch (error) {
    console.error("Error al obtener agendamientos del box:", error);
    return { statusCode: 500, body: JSON.stringify({ message: "Error interno" }) };
  }
};
