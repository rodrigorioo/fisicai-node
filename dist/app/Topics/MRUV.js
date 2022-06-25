"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MRUV = void 0;
const Topic_1 = require("./Topic");
const Datum_1 = require("../Datum");
class MRUV extends Topic_1.Topic {
    constructor() {
        super();
        this.name = "MRUV";
        this.equations = {
            'velocidad_inicial': '0',
            'velocidad_final': 'velocidad_inicial + (aceleracion * tiempo)',
            'velocidad': 'velocidad_inicial + (aceleracion * tiempo)',
            'rapidez': 'velocidad_inicial + (aceleracion * tiempo)',
            'tiempo_inicial': '0',
            'tiempo_final': '0',
            'tiempo': '(velocidad - velocidad_inicial) / aceleracion',
            'posicion_final': 'posicion_inicial + (velocidad_inicial * tiempo) + ( (aceleracion * (tiempo * tiempo)) / 2)',
            'posicion_inicial': '0',
            'posicion': 'posicion_inicial + (velocidad_inicial * tiempo) + ( (aceleracion * (tiempo * tiempo)) / 2)',
            'aceleracion': '(velocidad - velocidad_inicial) / (tiempo - tiempo_inicial)',
        };
    }
    processEquation(nameOfEquation, equation) {
        return this[nameOfEquation](equation);
    }
    // Equations
    velocidad_inicial(equation) {
        return new Datum_1.Datum("velocidad_inicial", "0", "m/s");
    }
    velocidad_final(equation) {
        this.data.forEach((datum) => {
            equation = equation.replace(datum.name, datum.value);
        });
        return new Datum_1.Datum("velocidad_final", this.evaluateMathString(equation), "m/s");
    }
    velocidad(equation) {
        this.data.forEach((datum) => {
            equation = equation.replace(datum.name, datum.value);
        });
        // Add velocidad final
        this.data.push(new Datum_1.Datum("velocidad_final", this.evaluateMathString(equation), "m/s"));
        return new Datum_1.Datum("velocidad", this.evaluateMathString(equation), "m/s");
    }
    rapidez(equation) {
        this.data.forEach((datum) => {
            equation = equation.replace(datum.name, datum.value);
        });
        // Add velocidad
        this.data.push(new Datum_1.Datum("velocidad", this.evaluateMathString(equation), "m/s"));
        // Add velocidad final
        this.data.push(new Datum_1.Datum("velocidad_final", this.evaluateMathString(equation), "m/s"));
        return new Datum_1.Datum("rapidez", this.evaluateMathString(equation), "m/s");
    }
    tiempo_inicial(equation) {
        return new Datum_1.Datum("tiempo_inicial", "0", "s");
    }
    tiempo_final(equation) {
        return new Datum_1.Datum("tiempo_final", "0", "s");
    }
    tiempo(equation) {
        this.data.forEach((datum) => {
            equation = equation.replace(datum.name, datum.value);
        });
        return new Datum_1.Datum("tiempo", this.evaluateMathString(equation), "s");
    }
    aceleracion(equation) {
        this.data.forEach((datum) => {
            equation = equation.replace(datum.name, datum.value);
        });
        return new Datum_1.Datum("aceleracion", this.evaluateMathString(equation), "m/s2");
    }
    posicion_inicial(equation) {
        return new Datum_1.Datum("posicion_inicial", "0", "m");
    }
    posicion_final(equation) {
        return new Datum_1.Datum("posicion_final", "0", "m");
    }
    posicion(equation) {
        return new Datum_1.Datum("posicion", "0", "m");
    }
}
exports.MRUV = MRUV;
