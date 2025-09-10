import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFichaMedicaRepository } from 'src/domain/repositories/ficha-medica.repository';
import { FichaMedicaMongo } from './schemas/ficha-medica.schema';
import { FichaMedica } from 'src/domain/entities/ficha-medica.entity';

export class MongoFichaMedicaRepository implements IFichaMedicaRepository {
  constructor(
    @InjectModel('FichaMedica')
    private fichaMedicaModel: Model<FichaMedicaMongo>,
  ) {}

  async CreateFicha(fichaMedica: FichaMedica): Promise<void> {
    await new this.fichaMedicaModel({
      _id: fichaMedica.getId(),
      idMascota: fichaMedica.getIdMascota(),
      revisionesMedicas: fichaMedica.getRevisionesMedicas(),
      carnetVacuna: fichaMedica.getVacunas(),
    }).save();
  }

  async FindById(id: string): Promise<FichaMedica | null> {
    const doc = await this.fichaMedicaModel.findById(id).exec();

    if (doc === null) return null;

    return new FichaMedica(
      doc.id,
      doc.idMascota,
      doc.revisionesMedicas,
      doc.carnetVacuna,
    );
  }

  async UpdateFicha(fichaMedica: FichaMedica): Promise<void> {
    await this.fichaMedicaModel.findByIdAndUpdate(fichaMedica.getId(), {
      idMascota: fichaMedica.getIdMascota(),
      revisionesMedicas: fichaMedica.getRevisionesMedicas(),
      carnetVacuna: fichaMedica.getVacunas(),
    });
  }

  async DeleteFicha(id: string): Promise<string> {
    const query = await this.fichaMedicaModel.deleteOne({ _id: id });

    if (query.deletedCount == 1) return 'Ficha Medica removed';
    else return "Couldn't find Ficha Medica to remove";
  }

  async DeleteAll(): Promise<string> {
    const query = await this.fichaMedicaModel.deleteMany();
    if (query.deletedCount > 0)
      return `Removed ${query.deletedCount} fichas medicas`;
    else return `No fichas medicas found on the databse`;
  }

  async FindAll(): Promise<FichaMedica[] | undefined> {
    const query = await this.fichaMedicaModel.find();
    if (query.length === 0) return undefined;
    else {
      const fichas: FichaMedica[] = [];

      for (let i = 0; i < query.length; i++) {
        const doc = query[i];
        if (!doc) continue;
        fichas.push(
          new FichaMedica(
            doc.id,
            doc.idMascota,
            doc.revisionesMedicas,
            doc.carnetVacuna,
          ),
        );
      }

      return fichas;
    }
  }

  async FindByPetId(idMascota: string): Promise<FichaMedica | null> {
    const query = await this.fichaMedicaModel
      .findOne({ idMascota: idMascota })
      .exec();
    if (query === null) return null;

    return new FichaMedica(
      query.id,
      query.idMascota,
      query.revisionesMedicas,
      query.carnetVacuna,
    );
  }

  async FindAllProceduresMoney(): Promise<
    { procedimiento: string; costo: Number }[] | null
  > {
    const res = await this.fichaMedicaModel
      .aggregate<{
        revisionesMedicas: { procedures: { name: string; cost: number }[] }[];
      }>([
        {
          $project: {
            _id: 0,
            revisionesMedicas: {
              $map: {
                input: '$revisionesMedicas',
                as: 'revision',
                in: {
                  procedures: {
                    $map: {
                      input: '$$revision.procedimientos',
                      as: 'procedimiento',
                      in: {
                        name: '$$procedimiento.procedimiento',
                        cost: '$$procedimiento.costo',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ])
      .exec();

    if (res === null || res === undefined) return null;

    const procedimientosYCosto = res.flatMap((doc) =>
      doc.revisionesMedicas.flatMap((revision) =>
        revision.procedures.map((proc) => ({
          procedimiento: proc.name,
          costo: proc.cost,
        })),
      ),
    );

    return procedimientosYCosto;
  }

  async FindAllVaccines(): Promise<string[] | null> {
    const res = await this.fichaMedicaModel
      .aggregate<{ nombrevacuna: string }>([
        { $unwind: '$carnetVacuna' },
        { $unwind: '$carnetVacuna.vacunasadministradas' },
        {
          $project: {
            _id: 0,
            nombrevacuna: '$carnetVacuna.vacunasadministradas.nombrevacuna',
          },
        },
      ])
      .exec();

    if (res === null || res === undefined) return null;

    if (!res) return null;

    const vacunas = res.map((v) => v.nombrevacuna);

    return vacunas;
  }

  async FindMedsWithQuantity(): Promise<
    { medicamento: string; cantidad: Number }[] | null
  > {
    const res = await this.fichaMedicaModel
      .aggregate<{ medicamento: string; cantidad: Number }>([
        { $unwind: '$revisionesMedicas' },
        { $unwind: '$revisionesMedicas.procedimientos' },
        { $unwind: '$revisionesMedicas.procedimientos.medicamentos' },
        {
          $project: {
            _id: 0,
            medicamento:
              '$revisionesMedicas.procedimientos.medicamentos.nombre',
            cantidad: '$revisionesMedicas.procedimientos.medicamentos.cantidad',
          },
        },
      ])
      .exec();

    if (res === null || res === undefined) return null;

    if (!res) return null;

    const meds = res.map((med) => ({
      medicamento: med.medicamento,
      cantidad: med.cantidad,
    }));

    return meds;
  }

  async GetMedicosIDs(): Promise<string[] | null> {
    const res = await this.fichaMedicaModel
      .aggregate([
        {
          $project: {
            allMedicos: {
              $concatArrays: [
                {
                  $map: {
                    input: '$revisionesMedicas',
                    as: 'rev',
                    in: '$$rev.idmedico',
                  },
                },
                {
                  $reduce: {
                    input: '$revisionesMedicas',
                    initialValue: [],
                    in: {
                      $concatArrays: [
                        '$$value',
                        {
                          $reduce: {
                            input: '$$this.procedimientos',
                            initialValue: [],
                            in: {
                              $concatArrays: ['$$value', '$$this.idmedicos'],
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
        { $unwind: '$allMedicos' },
        { $group: { _id: null, idmedicos: { $addToSet: '$allMedicos' } } },
        { $project: { _id: 0, idmedicos: 1 } },
      ])
      .exec();

    if (res === null || res === undefined) return null;

    if (!res) return null;

    const medicos: string[] = res.length > 0 ? res[0].idmedicos : [];

    return medicos;
  }

  async GetRevisionesPagos(): Promise<boolean[] | null> {
    const res = await this.fichaMedicaModel
      .aggregate<{ pagado: boolean }>([
        { $unwind: '$revisionesMedicas' },
        {
          $project: {
            _id: 0,
            pagado: '$revisionesMedicas.pagado',
          },
        },
      ])
      .exec();

    if (res === null || res === undefined) return null;

    if (!res) return null;

    const pagados = res.map((p) => p.pagado);

    return pagados;
  }
}
