import {Datum} from "../Datum";
import {MRU} from "./MRU";

interface MRUOperations {
    distancia : string,
    velocidad : string,
    tiempo : string,
    posicion_inicial : string,
    hora : string,
    rapidez : string,
}

interface MRUVOperations {
    velocidad_inicial : string,
    velocidad_final : string,
    tiempo_inicial : string,
    tiempo_final : string,
    posicion_final : string,
    posicion : string,
    aceleracion: string,
}

interface Operations extends MRUOperations, MRUVOperations {}

abstract class Topic {

    public name : string = "";
    public equations : Partial<Operations> = {};
    public data : Array<Datum> = [];

    solveEquation (nameOfEquation : keyof Operations) {

        const equation : string | undefined = this.equations[nameOfEquation];

        // If it's string
        if(equation) {

            // Found missing data of equation
            const missingData = this.missingData(equation);

            // Solve all missing data
            this.solveMissingData(missingData);

            // Solve equation
            this.data.push(this.processEquation(nameOfEquation, equation));
        }
    }

    missingData (equation : string) : Array<string> {

        // Replace the equation with data
        this.data.forEach( (datum : Datum) => {
            equation = equation.replace(datum.name, datum.value.toString());
        });

        // Search which data we not have
        const missingData = equation.match(/[a-zA-Z_?]+/);

        if(missingData) {
            return Array.from(missingData);
        }

        return [];
    }

    solveMissingData (missingData : Array<string>) : void {

        for(const equationMissing of missingData) {
            this.solveEquation(equationMissing as keyof Operations);
        }
    }

    evaluateMathString (expression : string) {
        return Function('return ' + expression)();
    }

    abstract processEquation (nameOfEquation : keyof Operations, equation : string) : Datum;
}

export { Topic, Operations, MRUOperations, MRUVOperations }
