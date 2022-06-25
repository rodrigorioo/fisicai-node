"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MRU = void 0;
const Topic_1 = require("./Topic");
const Datum_1 = require("../Datum");
const { DateTime } = require("luxon");
class MRU extends Topic_1.Topic {
    constructor() {
        super();
        this.name = "MRU";
        this.equations = {
            'distancia': 'posicion_inicial + (velocidad * tiempo)',
            'velocidad': '(distancia - posicion_inicial) / tiempo',
            'tiempo': '(distancia - posicion_inicial) / velocidad',
            'posicion_inicial': '0',
            'hora': 'tiempo',
            'rapidez': '(distancia - posicion_inicial) / tiempo',
        };
    }
    processEquation(nameOfEquation, equation) {
        return this[nameOfEquation](equation);
    }
    // Equations
    distancia(equation) {
        this.data.forEach((datum) => {
            equation = equation.replace(datum.name, datum.value);
        });
        return new Datum_1.Datum("distancia", this.evaluateMathString(equation), "m");
    }
    velocidad(equation) {
        this.data.forEach((datum) => {
            equation = equation.replace(datum.name, datum.value);
        });
        return new Datum_1.Datum("velocidad", this.evaluateMathString(equation), "m/s");
    }
    tiempo(equation) {
        this.data.forEach((datum) => {
            equation = equation.replace(datum.name, datum.value);
        });
        return new Datum_1.Datum("tiempo", this.evaluateMathString(equation), "s");
    }
    posicion_inicial(equation) {
        return new Datum_1.Datum("posicion_inicial", "0", "m");
    }
    hora(equation) {
        let date;
        let time = 0;
        for (const datum of this.data) {
            if (datum.name === "fecha") {
                date = DateTime.fromISO(datum.value);
            }
            if (datum.name === "tiempo") {
                time = parseInt(datum.value);
            }
        }
        const newDate = DateTime.fromISO(date.toISO());
        newDate.plus({ seconds: time });
        const difference = newDate.diff(date, ["days", "hours", "minutes", "seconds"]);
        difference.toObject();
        return new Datum_1.Datum("hora", `Dias: ${difference.days} - Hora: ${difference.hours}:${difference.minutes}:${difference.seconds}`, "");
    }
    rapidez(equation) {
        this.data.forEach((datum) => {
            equation = equation.replace(datum.name, datum.value);
        });
        // Add velocidad
        this.data.push(new Datum_1.Datum("velocidad", this.evaluateMathString(equation), "m/s"));
        return new Datum_1.Datum("rapidez", this.evaluateMathString(equation), "m/s");
    }
}
exports.MRU = MRU;
