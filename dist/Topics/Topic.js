"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Topic = void 0;
class Topic {
    constructor() {
        this.name = "";
        this.equations = {};
        this.data = [];
    }
    solveEquation(nameOfEquation) {
        const equation = this.equations[nameOfEquation];
        // If it's string
        if (equation) {
            // Found missing data of equation
            const missingData = this.missingData(equation);
            // Solve all missing data
            this.solveMissingData(missingData);
            // Solve equation
            this.data.push(this.processEquation(nameOfEquation, equation));
        }
    }
    missingData(equation) {
        // Replace the equation with data
        this.data.forEach((datum) => {
            equation = equation.replace(datum.name, datum.value.toString());
        });
        // Search which data we not have
        const missingData = equation.match(/[a-zA-Z_?]+/);
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
}
exports.Topic = Topic;
