import {MRUOperations, Operations, Topic} from "./Topic";
import {Datum} from "../Datum";
const { DateTime } = require("luxon");

interface MRUOperationsMethods {
    distancia : (equation : string) => Datum,
    velocidad : (equation : string) => Datum,
    tiempo : (equation : string) => Datum,
    posicion_inicial : (equation : string) => Datum,
    hora : (equation : string) => Datum,
    rapidez : (equation : string) => Datum,
}

class MRU extends Topic {

    constructor () {

        super();

        this.name = "MRU";
        this.equations = {
            'distancia': 'posicion_inicial + (velocidad * tiempo)',
            'velocidad': '(distancia - posicion_inicial) / tiempo',
            'tiempo': '(distancia - posicion_inicial) / velocidad',
            'posicion_inicial': '0',
            'hora': 'tiempo',
            'rapidez': '(distancia - posicion_inicial) / tiempo',
        }
    }

    processEquation(nameOfEquation : keyof MRUOperationsMethods, equation : string) : Datum {
        return this[nameOfEquation](equation) as Datum;
    }

    // Equations

    distancia (equation : string) {

        this.data.forEach( (datum : Datum) => {
            equation = equation.replace(datum.name, datum.value);
        });

        return new Datum("distancia", this.evaluateMathString(equation), "m");
    }

    velocidad (equation : string) {
        this.data.forEach( (datum : Datum) => {
            equation = equation.replace(datum.name, datum.value);
        });

        return new Datum("velocidad", this.evaluateMathString(equation), "m/s");
    }

    tiempo (equation : string) {

        this.data.forEach( (datum : Datum) => {
            equation = equation.replace(datum.name, datum.value);
        });

        return new Datum("tiempo", this.evaluateMathString(equation), "s");
    }

    posicion_inicial (equation : string) {
        return new Datum("posicion_inicial", "0", "m");
    }

    hora (equation : string) {

        let date : typeof DateTime;
        let time : number = 0;

        for(const datum of this.data) {

            if(datum.name === "fecha") {
                date = DateTime.fromISO(datum.value);
            }

            if(datum.name === "tiempo") {
                time = parseInt(datum.value);
            }
        }

        const newDate : typeof DateTime = DateTime.fromISO(date.toISO());
        newDate.plus({seconds: time});

        const difference = newDate.diff(date, ["days", "hours", "minutes", "seconds"]);
        difference.toObject();

        return new Datum("hora", `Dias: ${difference.days} - Hora: ${difference.hours}:${difference.minutes}:${difference.seconds}`, "");
    }

    rapidez (equation : string) {

        this.data.forEach( (datum : Datum) => {
            equation = equation.replace(datum.name, datum.value);
        });

        // Add velocidad
        this.data.push(new Datum("velocidad", this.evaluateMathString(equation), "m/s"));

        return new Datum("rapidez", this.evaluateMathString(equation), "m/s");
    }
}

export { MRU }
