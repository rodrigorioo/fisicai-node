import {Datum} from "../Datum";

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
    private missingData : Array<string> = [];

    solveEquation (nameOfEquation : keyof Operations) {

        // Check if exists in data
        const existInData : Datum | undefined = this.data.find( (datum) => {
            return datum.name === nameOfEquation;
        });

        // If not exists, we add it
        if(existInData === undefined) {

            const equation : string | undefined = this.equations[nameOfEquation];

            // If it's string
            if(equation !== undefined) {

                // Found missing data of equation
                const missingData = this.getMissingData(equation);

                // console.log(nameOfEquation);
                // console.log(missingData);

                if(!this.existMissingData(missingData)) {

                    // console.log("Solve missing data: " + nameOfEquation + " - MIssing data: " + missingData.join(" / "));

                    // Solve all missing data
                    this.solveMissingData(missingData);

                    // console.log("Process equation: " + nameOfEquation);

                    if(nameOfEquation === "velocidad_final") {
                        console.log(this.data);
                    }

                    // Solve equation
                    this.data.push(this.processEquation(nameOfEquation));

                    if(nameOfEquation === "velocidad_final") {
                        console.log(this.data);
                    }
                }
            }
        }

    }

    getMissingData (equation : string) : Array<string> {

        // Replace the equation with data
        for(const datum of this.data) {
            equation = equation.replace(datum.name, datum.value.toString());
        }

        // Search which data we not have
        const missingData = equation.match(/[a-zA-Z_?]+/g);

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

    existMissingData (missingData : Array<string>) : boolean {

        let exist : boolean = false;

        for(const nameOfMissingData of missingData) {

            if(this.missingData.includes(nameOfMissingData)) {
                exist = true;
                break;
            } else {
                this.missingData.push(nameOfMissingData);
            }
        }

        return exist;
    }

    getValueMatchString (equation : string) : string {

        let valueMathString : string;

        try {
            valueMathString = this.evaluateMathString(equation);
        } catch (err) {
            valueMathString = "0";
        }

        return valueMathString;
    }

    abstract processEquation (nameOfEquation : keyof Operations) : Datum;
}

export { Topic, Operations, MRUOperations, MRUVOperations }
