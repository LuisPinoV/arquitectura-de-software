export class Agendamiento
{
    _id; // String
    _dateStart; // DateTime
    _dateEnd; // DateTime
    _personal; // Array
    _utils; // Array of objects
    _specialty; // String

    constructor(id, dateStart, dateEnd, statePetition, personal, utils, specialty)
    {
        this._id = id;
        this._dateStart = dateStart;
        this._dateEnd =  dateEnd;
        this._statePetition = statePetition;
        this.personal = personal;
        this.utils = utils;
        this.specialty = specialty;
    }

    getId()
    {
        return this._id;
    }

    getDateStart()
    {
        return this._dateStart;
    }

    getDateEnd()
    {
        return this._dateEnd;
    }

    getPersonal()
    {
        return this._personal;
    }

    getUtils()
    {
        return this._utils;
    }

    getSpecialty()
    {
        return this._specialty;
    }

    changeUtilQuantity(index, quantity)
    {
        this.utils[index].quantity = quantity;
    }

    getTotalTime()
    {
        const diff = this._dateEnd - this._dateStart;

        const totalTimeMin = diff / (1000 * 60);

        return totalTimeMin;
    }

    changePersonal(index, newPerson)
    {
        return this._personal[index] = newPerson;
    }

    deletePersonal(index)
    {
        this._personal.splice(index, 1);
    }
}