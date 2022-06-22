const assert = require('assert');

const {Datum} = require("../dist/Datum");
const {Problem} = require("../dist/Problem");

describe("Problem Solver", () => {

    describe('Solve problem #1 - Una bicicleta circula en línea recta a una velocidad de 15km/h durante 45 minutos. ¿Qué distancia recorre?', () => {

        const requested = ["distancia"];
        const data = [
            new Datum("fecha", "2022-06-21T01:00:00.000-03:00", ""),
            new Datum("velocidad", "15", "km/h"),
            new Datum("tiempo", "45", "min"),
        ];

        const problem = new Problem(requested, data);

        let resolution;

        try {
            resolution = problem.check(requested, data);
        } catch(errResolution) {
            console.log("Error check resolution: " + errResolution.message);
            return;
        }

        it('Distancia should be 11250 m',() => {
            assert.equal(resolution[0].name, "distancia");
            assert.equal(resolution[0].value, 11250);
            assert.equal(resolution[0].unit, "m");
        });

    });

    describe('Solve problem #2 - Dos pueblos que distan 12 km están unidos por una carretera recta. Un ciclista viaja de un pueblo al otro con una velocidad constante de 10 m/s. Calcula el tiempo que emplea', () => {

        const requested = ["tiempo"];
        const data = [
            new Datum("distancia", "12000", "m"),
            new Datum("velocidad", "10", "m/s"),
        ];

        const problem = new Problem(requested, data);

        let resolution;

        try {
            resolution = problem.check(requested, data);
        } catch(errResolution) {
            console.log("Error check resolution: " + errResolution.message);
            return;
        }

        it('Tiempo should be 1200 s',() => {
            assert.equal(resolution[0].name, "tiempo");
            assert.equal(resolution[0].value, 1200);
            assert.equal(resolution[0].unit, "s");
        });

    });

    describe('Solve problem #3 - Si Alberto recorre con su patinete una pista de 300 metros en un minuto, ¿a qué velocidad circula?', () => {

        const requested = ["velocidad"];
        const data = [
            new Datum("distancia", "300", "m"),
            new Datum("tiempo", "60", "s"),
        ];

        const problem = new Problem(requested, data);

        let resolution;

        try {
            resolution = problem.check(requested, data);
        } catch(errResolution) {
            console.log("Error check resolution: " + errResolution.message);
            return;
        }

        it('Velocidad should be 5 m/s',() => {
            assert.equal(resolution[0].name, "velocidad");
            assert.equal(resolution[0].value, 5);
            assert.equal(resolution[0].unit, "m/s");
        });

    });
});
