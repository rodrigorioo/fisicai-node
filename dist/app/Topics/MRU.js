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
    processEquation(nameOfEquation) {
        return this[nameOfEquation]();
    }
    // Equations
    distancia() {
        let equation = this.equations["distancia"];
        this.data.forEach((datum) => {
            equation = equation.replace(datum.name, datum.value);
        });
        // Get value match string
        let valueMathString = this.getValueMatchString(equation);
        return new Datum_1.Datum("distancia", valueMathString, "m");
    }
    velocidad() {
        let equation = this.equations["velocidad"];
        this.data.forEach((datum) => {
            equation = equation.replace(datum.name, datum.value);
        });
        // Get value match string
        let valueMathString = this.getValueMatchString(equation);
        return new Datum_1.Datum("velocidad", valueMathString, "m/s");
    }
    tiempo() {
        let equation = this.equations["tiempo"];
        this.data.forEach((datum) => {
            equation = equation.replace(datum.name, datum.value);
        });
        // Get value match string
        let valueMathString = this.getValueMatchString(equation);
        return new Datum_1.Datum("tiempo", valueMathString, "s");
    }
    posicion_inicial() {
        return new Datum_1.Datum("posicion_inicial", "0", "m");
    }
    hora() {
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
    rapidez() {
        let equation = this.equations["rapidez"];
        this.data.forEach((datum) => {
            equation = equation.replace(datum.name, datum.value);
        });
        // Get value match string
        let valueMathString = this.getValueMatchString(equation);
        // Add velocidad
        this.data.push(new Datum_1.Datum("velocidad", valueMathString, "m/s"));
        return new Datum_1.Datum("rapidez", valueMathString, "m/s");
    }
}
exports.MRU = MRU;
