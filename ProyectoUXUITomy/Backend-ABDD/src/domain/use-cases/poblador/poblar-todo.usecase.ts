import { FichaMedica } from 'src/domain/entities/ficha-medica.entity';
import { Medico } from 'src/domain/entities/medico.entity';
import { Paciente } from 'src/domain/entities/paciente.entity';
import { CarnetVacuna } from 'src/domain/entities/serializable-objects/carnet-vacuna';
import { Medicamento } from 'src/domain/entities/serializable-objects/medicamento';
import { Procedimiento } from 'src/domain/entities/serializable-objects/procedimiento';
import { RevisionMedica } from 'src/domain/entities/serializable-objects/revision-medica';
import { VacunaAdministrada } from 'src/domain/entities/serializable-objects/vacuna';
import { Tutor } from 'src/domain/entities/tutor.entity';
import { IFichaMedicaRepository } from 'src/domain/repositories/ficha-medica.repository';
import { IMedicoRepository } from 'src/domain/repositories/medico.repository';
import { IPacienteRepository } from 'src/domain/repositories/paciente.repository';
import { ITutorRepository } from 'src/domain/repositories/tutor.repository';
import { v4 as uuidv4 } from 'uuid';

export class CreateAllUseCase {
  constructor(
    private readonly pacienteRepository: IPacienteRepository,
    private readonly medicoRepository: IMedicoRepository,
    private readonly tutorRepository: ITutorRepository,
    private readonly fichaRepository: IFichaMedicaRepository,
  ) {}

  nombresMascotasMacho: string[] = [
    'Rocky',
    'Thor',
    'Max',
    'Bruno',
    'Toby',
    'Jack',
    'Lucas',
    'León',
    'Copito',
    'Zeus',
    'Balto',
    'Rex',
    'Bronco',
    'Almendra',
  ];

  nombresMascotasHembra: string[] = [
    'Luna',
    'Bella',
    'Daisy',
    'Lola',
    'Nina',
    'Molly',
    'Maya',
    'Kiara',
    'Chloe',
  ];

  nombresMujeres: string[] = [
    'Sofía',
    'Valentina',
    'Isabella',
    'Camila',
    'Valeria',
    'Martina',
    'Lucía',
    'Cecilia',
    'Alejandra',
    'Diana',
    'Ángela',
    'Ámbar',
    'Sonia',
    'Luciana',
    'Rosa',
    'Carmen',
  ];

  nombresHombres: string[] = [
    'Mateo',
    'Santiago',
    'Sebastián',
    'Leonardo',
    'Matías',
    'Martín',
    'Alejandro',
    'Lucas',
    'Nicolás',
    'Samuel',
    'Benjamín',
    'Thiago',
    'Emiliano',
    'Diego',
    'Tomás',
    'Joaquín',
    'Gabriel',
    'David',
    'Miguel',
    'Isaac',
    'Pablo',
    'Ángel',
    'Adrián',
    'Bruno',
  ];

  apellidos: string[] = [
    'Alvarado',
    'Guerrero',
    'Farias',
    'Jara',
    'Donoso',
    'Rojas',
    'Muñoz',
    'Medina',
    'Poblete',
    'Pino',
    'Toro',
    'Carvajal',
    'Bustos',
  ];

  especialidades: string[] = [
    'Medicina Interna',
    'Urgencias Veterinarias',
    'Cirugía',
    'Dermatología',
    'Fisioterapia',
    'Oftalmología',
    'Oncología',
    'Radiología',
    'Nutricion Animal',
  ];

  estados: string[] = [
    'Disponible',
    'Con licencia',
    'De negocios',
    'No Disponible',
  ];

  razaPerros: string[] = [
    'Affenpinscher',
    'Afghan Hound',
    'Aidi',
    'Airdale Terrier',
    'Akita Inu',
    'Alapaha Blue Blood Bulldog',
    'American Akita',
    'American Bulldog',
    'American Cocker Spaniel',
  ];

  razaGatos: string[] = [
    'Abyssinian',
    'American Bobtail',
    'American Burmese',
    'American Wirehair',
    'American Curl',
    'American Shorthair',
    'Bengal',
    'Balinese',
  ];

  especies: string[] = ['Canino', 'Felino'];

  getRazas: Map<string, string[]> = new Map([
    ['Canino', this.razaPerros],
    ['Felino', this.razaGatos],
  ]);

  procedimientos: string[] = [
    'Tomar la presión',
    'Revisar temperatura',
    'Revisar peso',
    'Revisión órgano sexual',
    'Revisión vista',
    'Revisión reflejos',
    'Revisión pulgas',
    'Ingesta de medicamento',
    'Cirugia de castración',
    'Sutura heridas',
    'Escaneo de rayos X',
    'Ingreso nutrientes y suplementos',
    'Vacunación',
  ];

  vacunas: string[] = [
    'Pfizer1',
    'Pfizer2',
    'Pfizer3',
    'MelabelaBombolia',
    'RabiNot',
    'Tralalero',
    'Tralala',
    'Tangananica',
    'Tanganana',
    'BombomChicken',
    'BaraBaraNoMi',
    'SUTAHPURATINUM',
    'AntiCobraG',
  ];

  medicamentos: string[] = [
    'Viagra',
    'Paracetamol',
    'Morfina',
    'Parafina',
    'Hemoglobina',
    'Saranfina',
    'Folifina',
    'Tapsin',
    'MataMuertos2000',
    'MataBacterias4000',
    'LaRecetaDeLaAbuela',
    'MataVirus80000',
    'redbull',
    'monster',
  ];

  enfermedades: string[] = [
    'PicaduraCobraG',
    'MataMamiferos',
    'Rabia',
    'Cancer de higado',
    'Cancer de vesicula',
    'Cancer de intestinos',
    'Resfriado',
    'Cataratas',
    'Sordo',
    'Resaca',
    'Higado cochino',
    'Higado grueso',
    'Diabetes',
  ];

  async execute(nPacientes: number, nMedicos: number, nTutores: number) {
    const pacientes: Paciente[] = [];
    const medicos: Medico[] = [];
    const tutores: Tutor[] = [];
    const fichas: FichaMedica[] = [];

    

    //Medicos
    for (let i = 0; i < nMedicos; i++) {
      const medico = this.GetRandomMedico();
      medicos.push(medico);
    }

    //Tutores
    for (let i = 0; i < nTutores; i++) {
      const tutor = this.GetRandomTutor();
      tutores.push(tutor);
    }

    //Pacientes
    for (let i = 0; i < nPacientes; i++) {
      const paciente = this.GetRandomPaciente(tutores);
      pacientes.push(paciente);

      const ficha = this.GetRandomFichaMedica(paciente.getId(), medicos);
      fichas.push(ficha);
    }

    for (let i = 0; i < pacientes.length; i++) {
      const paciente = pacientes[i];
      await this.pacienteRepository.CreatePaciente(paciente);
    }

    for (let i = 0; i < medicos.length; i++) {
      const medico = medicos[i];
      await this.medicoRepository.CreateMedico(medico);
    }

    //Create Tutores onto database
    for (let i = 0; i < tutores.length; i++) {
      const tutor = tutores[i];
      await this.tutorRepository.CreateTutor(tutor);
    }

    for (let i = 0; i < fichas.length; i++) {
      const ficha = fichas[i];
      await this.fichaRepository.CreateFicha(ficha);
    }
  }

  private GetRandomMedico() {
    //Randomize arrays indexes
    const genero = this.getRandomInt(0, 1);

    const randomApellidoIdx = this.getRandomInt(0, this.apellidos.length - 1);
    const randomNombreHombreIdx = this.getRandomInt(
      0,
      this.nombresHombres.length - 1,
    );
    const randomNombreMujerIdx = this.getRandomInt(
      0,
      this.nombresMujeres.length - 1,
    );

    const randomEspecialidadIdx = this.getRandomInt(
      0,
      this.especialidades.length - 1,
    );
    const randomEstadoIdx = this.getRandomInt(0, this.estados.length - 1);

    //Set randomized variables
    const apellido = this.apellidos[randomApellidoIdx];

    const name =
      genero === 0
        ? this.nombresHombres[randomNombreHombreIdx]
        : this.nombresMujeres[randomNombreMujerIdx];
    const fullname = name.concat(' ', apellido);

    const especialidad = this.especialidades[randomEspecialidadIdx];
    const estado = this.estados[randomEstadoIdx];

    const id = uuidv4();

    const medico = new Medico(id, fullname, estado, especialidad);

    return medico;
  }

  private GetRandomTutor() {
    //Randomize arrays indexes
    const genero = this.getRandomInt(0, 1);

    const randomApellidoIdx = this.getRandomInt(0, this.apellidos.length - 1);
    const randomNombreHombreIdx = this.getRandomInt(
      0,
      this.nombresHombres.length - 1,
    );
    const randomNombreMujerIdx = this.getRandomInt(
      0,
      this.nombresMujeres.length - 1,
    );

    //Set randomized variables
    const apellido = this.apellidos[randomApellidoIdx];

    const name =
      genero === 0
        ? this.nombresHombres[randomNombreHombreIdx]
        : this.nombresMujeres[randomNombreMujerIdx];
    const fullname = name.concat(' ', apellido);

    const id = uuidv4();

    const tutor = new Tutor(id, fullname, []);

    return tutor;
  }

  private GetRandomPaciente(tutores: Tutor[]) {
    //Randomize arrays indexes
    const genero = this.getRandomInt(0, 1);

    const randomNombreMachoIdx = this.getRandomInt(
      0,
      this.nombresMascotasMacho.length - 1,
    );
    const randomNombreHembraIdx = this.getRandomInt(
      0,
      this.nombresMascotasHembra.length - 1,
    );

    const randomTutorIdx = this.getRandomInt(0, tutores.length - 1);

    const randomEspecieIdx = this.getRandomInt(0, this.especies.length - 1);

    const especie = this.especies[randomEspecieIdx];

    const arrayRazas = this.getRazas.get(especie);

    const randomRazaIdx = this.getRandomInt(
      0,
      arrayRazas ? arrayRazas.length : 0,
    );

    //Set randomized variables
    const name =
      genero === 0
        ? this.nombresMascotasMacho[randomNombreMachoIdx]
        : this.nombresMascotasHembra[randomNombreHembraIdx];

    const generoText = genero === 0 ? 'Macho' : 'Hembra';

    const id = uuidv4();

    const tutor = tutores[randomTutorIdx];

    const edad = this.getRandomInt(1, 15);

    const raza = arrayRazas ? arrayRazas[randomRazaIdx] : 'Desconocido';

    const paciente = new Paciente(
      id,
      tutor.getId(),
      name,
      raza,
      edad,
      especie,
      generoText,
    );

    tutor.pushMascota(paciente.getId());

    tutores[randomTutorIdx] = tutor;

    return paciente;
  }

  private GetRandomFichaMedica(idPaciente: string, medicos: Medico[]) {
    const nRevisiones = this.getRandomInt(1, 2);
    const nCarnetVacuna = this.getRandomInt(1, 2);

    const carnetVacunas: CarnetVacuna[] = [];
    const revisionesMedicas: RevisionMedica[] = [];

    //Historial / Revisiones Medicas
    for (let i = 0; i < nRevisiones; i++) {
      const nProcedimientos = this.getRandomInt(1, 2);
      const procedimientos: Procedimiento[] = [];
      let costoFinal:number = 0;

      for (let j = 0; j < nProcedimientos; j++) {
        const procedimientoRandomIdx = this.getRandomInt(
          0,
          this.procedimientos.length - 1,
        );

        //Randomize Medicamentos
        const nMedicamentos = this.getRandomInt(1, 2);
        const medicamentos = this.GetRandomMedicamentos(nMedicamentos);

        //Randomize medicos
        const nMedicos = this.getRandomInt(1, 2);
        const idMedicos: string[] = [];

        let copyMedicos = Array.from(medicos);

        for (let k = 0; k < nMedicos; k++) {
          const randomMedicoIdx = this.getRandomInt(0, copyMedicos.length - 1);
          const medico = copyMedicos[randomMedicoIdx];

          idMedicos.push(medico.getId());

          copyMedicos.splice(randomMedicoIdx, 1);
        }

        const procedimientoDesc = this.procedimientos[procedimientoRandomIdx];
        const costo = this.getRandomInt(30000, 150000)

        costoFinal += costo;

        const procedimiento = new Procedimiento();
        procedimiento.idmedicos = idMedicos;
        procedimiento.medicamentos = medicamentos;
        procedimiento.procedimiento = procedimientoDesc;
        procedimiento.costo = costo;

        procedimientos.push(procedimiento);
      }

      const peso = Number(this.getRandomInt(3, 15));
      const presion = Number(this.getRandomInt(30, 150));
      const temperatura = Number(this.getRandomInt(35, 39));
      const fechaHora = this.randomDate(new Date(2015, 1, 1), new Date());
      const idMedico =
        medicos[this.getRandomInt(0, medicos.length - 1)].getId();
      const pagado = this.getRandomInt(0, 1) === 1 ? true : false;

      const revision = new RevisionMedica();
      revision.peso = peso;
      revision.presion = presion;
      revision.temperatura = temperatura;
      revision.fechahora = fechaHora;
      revision.idmedico = idMedico;
      revision.costo = costoFinal;
      revision.pagado = pagado;
      revision.procedimientos = procedimientos;

      revisionesMedicas.push(revision);
    }

    //Carnet Vacuna
    for (let i = 0; i < nCarnetVacuna; i++) {
      const enfermedadRandomIdx = this.getRandomInt(
        0,
        this.enfermedades.length - 1,
      );
      const enfermedad = this.enfermedades[enfermedadRandomIdx];

      const nVacunasAdministradas = this.getRandomInt(1, 2);
      const vacunas: VacunaAdministrada[] = [];

      for (let j = 0; j < nVacunasAdministradas; j++) {
        const nombreVacunaRandomIdx = this.getRandomInt(
          0,
          this.vacunas.length - 1,
        );
        const nombreVacuna = this.vacunas[nombreVacunaRandomIdx];

        const fecha = this.randomDate(new Date(2015, 1, 1), new Date());

        const vacuna = new VacunaAdministrada();

        vacuna.nombrevacuna = nombreVacuna;
        vacuna.fecha = fecha;

        vacunas.push(vacuna);
      }

      const carnetVacuna = new CarnetVacuna(enfermedad, vacunas);

      carnetVacunas.push(carnetVacuna);
    }

    const id = uuidv4();

    const ficha = new FichaMedica(
      id,
      idPaciente,
      revisionesMedicas,
      carnetVacunas,
    );

    return ficha;
  }

  private GetRandomMedicamentos(nMedicamentos: number): Medicamento[] {
    const medicamentos: Medicamento[] = [];
    let copyMedicamentos = Array.from(this.medicamentos);

    for (let i = 0; i < nMedicamentos; i++) {
      const randomMedicamentoIdx = this.getRandomInt(
        0,
        copyMedicamentos.length - 1,
      );
      const medicamentoNombre = copyMedicamentos[randomMedicamentoIdx];

      copyMedicamentos.splice(randomMedicamentoIdx, 1);

      const randomAmount = Number(this.getRandomInt(1, 500));

      const medicamento = new Medicamento();
      medicamento.nombre = medicamentoNombre;
      medicamento.cantidad = randomAmount;

      medicamentos.push(medicamento);
    }

    return medicamentos;
  }

  private getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomDate(start: Date, end: Date) {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
  }
}
