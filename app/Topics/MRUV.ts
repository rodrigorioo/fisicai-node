import {Topic} from "./Topic";
import {Datum} from "../Datum";

interface MRUVOperationsMethods {
    velocidad_inicial : (equation : string) => Datum,
    velocidad_final : (equation : string) => Datum,
    tiempo_inicial : (equation : string) => Datum,
    tiempo_final : (equation : string) => Datum,
    tiempo : (equation : string) => Datum,
    posicion_final : (equation : string) => Datum,
    posicion : (equation : string) => Datum,
    aceleracion: (equation : string) => Datum,
}

class MRUV extends Topic {

    constructor () {

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
        }
    }

    processEquation(nameOfEquation : keyof MRUVOperationsMethods, equation : string) : Datum {
        return this[nameOfEquation](equation) as Datum;
    }

    // Equations

    velocidad_inicial (equation : string) {
        return new Datum("velocidad_inicial", "0", "m/s");
    }

    velocidad_final (equation : string) {

        this.data.forEach( (datum : Datum) => {
            equation = equation.replace(datum.name, datum.value);
        });

        return new Datum("velocidad_final", this.evaluateMathString(equation), "m/s");
    }

    velocidad (equation : string) {

        this.data.forEach( (datum : Datum) => {
            equation = equation.replace(datum.name, datum.value);
        });

        // Add velocidad final
        this.data.push(new Datum("velocidad_final", this.evaluateMathString(equation), "m/s"));

        return new Datum("velocidad", this.evaluateMathString(equation), "m/s");
    }

    rapidez (equation : string) {

        this.data.forEach( (datum : Datum) => {
            equation = equation.replace(datum.name, datum.value);
        });

        // Add velocidad
        this.data.push(new Datum("velocidad", this.evaluateMathString(equation), "m/s"));

        // Add velocidad final
        this.data.push(new Datum("velocidad_final", this.evaluateMathString(equation), "m/s"));

        return new Datum("rapidez", this.evaluateMathString(equation), "m/s");
    }

    tiempo_inicial (equation : string) {
        return new Datum("tiempo_inicial", "0", "s");
    }

    tiempo_final (equation : string) {
        return new Datum("tiempo_final", "0", "s");
    }

    tiempo (equation : string) {

        this.data.forEach( (datum : Datum) => {
            equation = equation.replace(datum.name, datum.value);
        });

        return new Datum("tiempo", this.evaluateMathString(equation), "s");
    }

    aceleracion (equation : string) {

        this.data.forEach( (datum : Datum) => {
            equation = equation.replace(datum.name, datum.value);
        });

        return new Datum("aceleracion", this.evaluateMathString(equation), "m/s2");
    }

    posicion_inicial (equation : string) {
        return new Datum("posicion_inicial", "0", "m");
    }

    posicion_final (equation : string) {
        return new Datum("posicion_final", "0", "m");
    }

    posicion (equation : string) {
        return new Datum("posicion", "0", "m");
    }

}

export { MRUV }
