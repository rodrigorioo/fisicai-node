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
    processEquation(nameOfEquation) {
        return this[nameOfEquation]();
    }
    // Equations
    velocidad_inicial() {
        return new Datum_1.Datum("velocidad_inicial", "0", "m/s");
    }
    velocidad_final() {
        let equation = this.equations["velocidad_final"];
        this.data.forEach((datum) => {
            equation = equation.replace(datum.name, datum.value);
        });
        // Get value match string
        let valueMathString = this.getValueMatchString(equation);
        return new Datum_1.Datum("velocidad_final", valueMathString, "m/s");
    }
    velocidad() {
        let equation = this.equations["velocidad"];
        this.data.forEach((datum) => {
            equation = equation.replace(datum.name, datum.value);
        });
        // Get value match string
        let valueMathString = this.getValueMatchString(equation);
        // Add velocidad final
        this.data.push(new Datum_1.Datum("velocidad_final", valueMathString, "m/s"));
        return new Datum_1.Datum("velocidad", valueMathString, "m/s");
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
        // Add velocidad final
        this.data.push(new Datum_1.Datum("velocidad_final", valueMathString, "m/s"));
        return new Datum_1.Datum("rapidez", valueMathString, "m/s");
    }
    tiempo_inicial() {
        return new Datum_1.Datum("tiempo_inicial", "0", "s");
    }
    tiempo_final() {
        return new Datum_1.Datum("tiempo_final", "0", "s");
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
    aceleracion() {
        let equation = this.equations["aceleracion"];
        this.data.forEach((datum) => {
            equation = equation.replace(datum.name, datum.value);
        });
        // Get value match string
        let valueMathString = this.getValueMatchString(equation);
        return new Datum_1.Datum("aceleracion", valueMathString, "m/s2");
    }
    posicion_inicial() {
        return new Datum_1.Datum("posicion_inicial", "0", "m");
    }
    posicion_final() {
        return new Datum_1.Datum("posicion_final", "0", "m");
    }
    posicion() {
        return new Datum_1.Datum("posicion", "0", "m");
    }
}
exports.MRUV = MRUV;
