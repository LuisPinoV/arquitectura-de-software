import AWS from "aws-sdk";
import { faker } from "@faker-js/faker";
const dynamodb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE || "Agendamiento";

class Especialidad {
  constructor(id, nombre) {
    this.id = id;
    this.nombre = nombre;
  }

  toItem() {
    return {
      PK: `ESPECIALIDAD#${this.id}`,
      SK: "METADATA",
      tipo: "EspecialidadBox",
      idEspecialidadBox: this.id,
      especialidad: this.nombre
    };
  }
}

class Box {
  constructor(id, especialidad) {
    this.id = id;
    this.especialidad = especialidad;
    this.pasillo = faker.string.alpha({ count: 1, casing: "upper" });
    this.capacidad = faker.number.int({ min: 1, max: 3 });
    this.disponible = faker.datatype.boolean({ probability: 0.95 });
  }

  toItem() {
    return {
      PK: `BOX#${this.id}`,
      SK: "METADATA",
      tipo: "Box",
      idBox: this.id,
      especialidad: this.especialidad.nombre,
      pasillo: this.pasillo,
      capacidad: this.capacidad,
      disponible: this.disponible
    };
  }
}

class Funcionario {
  constructor(id, tipo) {
    this.id = id;
    this.tipoFuncionario = tipo;
    this.nombre = faker.person.fullName();
    this.rut = `${70000000 + id}-${faker.number.int({ min: 0, max: 9 })}`;
  }

  toItem() {
    return {
      PK: `FUNCIONARIO#${this.id}`,
      SK: "PROFILE",
      tipo: "Funcionario",
      idFuncionario: this.id,
      nombre: this.nombre,
      rut: this.rut,
      tipoFuncionario: this.tipoFuncionario
    };
  }
}

class Paciente {
  constructor(id) {
    this.id = id;
    this.nombre = faker.person.firstName();
    this.apellido = faker.person.lastName();
    this.rut = `${80000000 + id}-${faker.number.int({ min: 0, max: 9 })}`;
  }

  toItem() {
    return {
      PK: `PACIENTE#${this.id}`,
      SK: "PROFILE",
      tipo: "Paciente",
      idPaciente: this.id,
      nombre: this.nombre,
      apellido: this.apellido,
      rut: this.rut
    };
  }
}

class Agendamiento {
  constructor(id, paciente, funcionario, box, estado, fecha, horaEntrada) {
    this.id = id;
    this.paciente = paciente;
    this.funcionario = funcionario;
    this.box = box;
    this.fecha = fecha; 
    this.horaEntrada = horaEntrada;
    this.horaSalida = Agendamiento.addMinutes(horaEntrada, 30);
    this.estado = estado;
  }

  static addMinutes(time, mins) {
    const [h, m] = time.split(":").map(Number);
    const date = new Date(2000, 0, 1, h, m);
    date.setMinutes(date.getMinutes() + mins);
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  toItems() {
    const agendamiento = {
      PK: `AGENDAMIENTO#${this.id}`,
      SK: "METADATA",
      PacienteId: `PACIENTE#${this.paciente.id}`,
      FechaPaciente: `FECHA#${this.fecha}`,
      FuncionarioId: `FUNCIONARIO#${this.funcionario.id}`,
      FechaFuncionario: `FECHA#${this.fecha}`,
      BoxId: `BOX#${this.box.id}`,
      FechaBox: `FECHA#${this.fecha}`,
      tipo: "Agendamiento",
      idConsulta: this.id,
      idPaciente: this.paciente.id,
      idFuncionario: this.funcionario.id,
      idBox: this.box.id,
      fecha: this.fecha,
      horaEntrada: this.horaEntrada,
      horaSalida: this.horaSalida
    };

    const estadoItem = {
      PK: `AGENDAMIENTO#${this.id}`,
      SK: `ESTADO#${Date.now()}#${Math.floor(Math.random() * 1000)}`,
      tipo: "EstadoAgendamiento",
      estado: this.estado,
      fechaEstado: new Date().toISOString()
    };

    let resultadoItem = null;
    if (this.estado === "Completada") {
      resultadoItem = {
        PK: `AGENDAMIENTO#${this.id}`,
        SK: "RESULTADO",
        tipo: "ResultadoConsulta",
        vino: faker.datatype.boolean({ probability: 0.85 }),
        atendido: faker.datatype.boolean({ probability: 0.95 }),
        horaLlegada: Agendamiento.addMinutes(this.horaEntrada, -5),
        vinoDate: faker.date.recent().toISOString(),
        llamadoDate: faker.date.recent().toISOString()
      };
    }

    return [agendamiento, estadoItem, resultadoItem].filter(Boolean);
  }
}

export const poblarDynamo = async () => {
  // CONFIG
  const NUM_AGENDAMIENTOS = parseInt(process.env.NUM_AGENDAMIENTOS) || 5000;
  const NUM_BOXES = parseInt(process.env.NUM_BOXES) || 120;
  const NUM_FUNCIONARIOS = parseInt(process.env.NUM_FUNCIONARIOS) || 50;
  const NUM_PACIENTES = parseInt(process.env.NUM_PACIENTES) || 100;

  const especialidades = ["Cardiología", "Pediatría", "Dermatología", "Traumatología", "MedicinaGeneral", "Ginecología", "Neurología"];
  const tiposFuncionario = ["MedicoGeneral", "Enfermero", "EncargadoDePasillo"];
  const estadosAgendamiento = ["Completada", "Cancelada"];

  const especialidadObjs = especialidades.map((e, i) => new Especialidad(i + 1, e));
  const boxObjs = Array.from({ length: NUM_BOXES }).map((_, i) =>
    new Box(i + 1, faker.helpers.arrayElement(especialidadObjs))
  );
  const funcionarioObjs = Array.from({ length: NUM_FUNCIONARIOS }).map((_, i) =>
    new Funcionario(i + 1, faker.helpers.arrayElement(tiposFuncionario))
  );
  const pacienteObjs = Array.from({ length: NUM_PACIENTES }).map((_, i) =>
    new Paciente(i + 1)
  );

  const START_HOUR = 8;
  const END_HOUR = 17;
  const bloques = [];
  for (let h = START_HOUR; h < END_HOUR; h++) {
    bloques.push(`${String(h).padStart(2, "0")}:00`);
    bloques.push(`${String(h).padStart(2, "0")}:30`);
  }

  const SLOTS_PER_DAY = bloques.length;

  const boxScheduleState = {};
  for (const b of boxObjs) {
    boxScheduleState[b.id] = { slotIndex: 0, dayOffset: 0 };
  }

  const fechaBaseStart = faker.date.soon({ days: 7 });
  fechaBaseStart.setHours(0, 0, 0, 0);

  const items = [];
  let agendamientosCount = 0;

  for (let i = 0; i < NUM_AGENDAMIENTOS; i++) {
    const box = boxObjs[i % boxObjs.length];
    const state = boxScheduleState[box.id];
    const fechaObj = new Date(fechaBaseStart);
    fechaObj.setDate(fechaObj.getDate() + state.dayOffset);
    const fecha = fechaObj.toISOString().split("T")[0];
    const slotIdx = state.slotIndex % SLOTS_PER_DAY;
    const horaEntrada = bloques[slotIdx];
    state.slotIndex++;
    if (state.slotIndex >= SLOTS_PER_DAY) {
      state.slotIndex = 0;
      state.dayOffset++;
    }
    const paciente = faker.helpers.arrayElement(pacienteObjs);
    const funcionario = faker.helpers.arrayElement(funcionarioObjs.filter(f => ["MedicoGeneral", "Enfermero"].includes(f.tipoFuncionario)));
    const estado = faker.helpers.arrayElement(estadosAgendamiento);
    const ag = new Agendamiento(i + 1, paciente, funcionario, box, estado, fecha, horaEntrada);
    const agItems = ag.toItems();
    for (const it of agItems) items.push(it);
    agendamientosCount++;
  }

  const masterItems = [
    ...especialidadObjs.map(e => e.toItem()),
    ...boxObjs.map(b => b.toItem()),
    ...funcionarioObjs.map(f => f.toItem()),
    ...pacienteObjs.map(p => p.toItem())
  ];

  const allItems = [...masterItems, ...items];

  for (let i = 0; i < allItems.length; i += 25) {
    const batch = allItems.slice(i, i + 25);
    const params = {
      RequestItems: {
        [TABLE_NAME]: batch.map(item => ({ PutRequest: { Item: item } }))
      }
    };
    await dynamodb.batchWrite(params).promise();
  }

  // ======================================================
  // AGREGAR COLOR A LOS USUARIOS (90% blue, 10% green)
  // ======================================================
  function assignDeploymentColor() {
    const rand = Math.random();
    return rand < 0.9 ? "blue" : "green";
  }

  const TABLE_USER_PREFERENCES = "UserPreferences";

  const userPreferences = pacienteObjs.map((p) => ({
    userId: `PACIENTE#${p.id}`,
    profileType: "DEFAULT",
    color: assignDeploymentColor(),
  }));

  for (let i = 0; i < userPreferences.length; i += 25) {
    const batch = userPreferences.slice(i, i + 25);
    const params = {
      RequestItems: {
        [TABLE_USER_PREFERENCES]: batch.map((item) => ({ PutRequest: { Item: item } })),
      },
    };
    await dynamodb.batchWrite(params).promise();
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Se poblaron datos de agendamiento y colores de usuarios",
      stats: {
        especialidades: especialidadObjs.length,
        boxes: boxObjs.length,
        funcionarios: funcionarioObjs.length,
        pacientes: pacienteObjs.length,
        agendamientos: agendamientosCount
      }
    })
  };
};
