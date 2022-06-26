"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Topic = void 0;
class Topic {
    constructor() {
        this.name = "";
        this.equations = {};
        this.data = [];
        this.missingData = [];
    }
    solveEquation(nameOfEquation) {
        // Check if exists in data
        const existInData = this.data.find((datum) => {
            return datum.name === nameOfEquation;
        });
        // If not exists, we add it
        if (existInData === undefined) {
            const equation = this.equations[nameOfEquation];
            // If it's string
            if (equation !== undefined) {
                // Found missing data of equation
                const missingData = this.getMissingData(equation);
                if (!this.existMissingData(missingData)) {
                    // Solve all missing data
                    this.solveMissingData(missingData);
                    // Solve equation
                    this.data.push(this.processEquation(nameOfEquation));
                }
            }
        }
    }
    getMissingData(equation) {
        // Replace the equation with data
        for (const datum of this.data) {
            equation = equation.replace(datum.name, datum.value.toString());
        }
        // Search which data we not have
        const missingData = equation.match(/[a-zA-Z_?]+/g);
        if (missingData) {
            return Array.from(missingData);
        }
        return [];
    }
    solveMissingData(missingData) {
        for (const equationMissing of missingData) {
            this.solveEquation(equationMissing);
        }
    }
    evaluateMathString(expression) {
        return Function('return ' + expression)();
    }
    existMissingData(missingData) {
        let exist = false;
        for (const nameOfMissingData of missingData) {
            if (this.missingData.includes(nameOfMissingData)) {
                exist = true;
                break;
            }
            else {
                this.missingData.push(nameOfMissingData);
            }
        }
        return exist;
    }
    getValueMatchString(equation) {
        let valueMathString = "0";
        try {
            valueMathString = this.evaluateMathString(equation);
            // Verify that is a valid value
            if ((valueMathString === null && valueMathString !== "") || (valueMathString == "Infinity")) {
                valueMathString = "0";
            }
        }
        catch (err) {
            valueMathString = "0";
        }
        return valueMathString;
    }
}
exports.Topic = Topic;
