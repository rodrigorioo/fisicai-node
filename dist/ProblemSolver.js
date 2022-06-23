"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemSolver = void 0;
const Wit_1 = require("./Wit");
const Datum_1 = require("./Datum");
const Problem_1 = require("./Problem");
class ProblemSolver {
    constructor(problem) {
        this.problem = problem;
        this.requested = [];
        this.data = [];
    }
    processProblem() {
        return new Promise((success, failure) => {
            // Init Wit class
            let wit;
            try {
                wit = new Wit_1.Wit();
            }
            catch (err) {
                return failure(err);
            }
            // Process message
            wit.processMessage(this.problem).then(() => {
                // Get requested data
                this.loadRequestedData(wit.entities);
                // Load rest of entities
                const entitiesWithoutRequested = wit.entities.filter((entity) => {
                    return entity.name !== "se_solicita";
                });
                this.loadData(entitiesWithoutRequested).then(() => {
                    // When we have all the data, we process it
                    const problem = new Problem_1.Problem(this.requested, this.data);
                    // Check resolution
                    let resolution = [];
                    try {
                        resolution = problem.check(this.requested, this.data);
                    }
                    catch (errResolution) {
                        return failure(errResolution);
                    }
                    // Return the response
                    return success({
                        data: this.data,
                        requested: this.requested,
                        resolution,
                    });
                });
            }).catch((errProcessMessage) => {
                return failure(errProcessMessage);
            });
        });
    }
    loadRequestedData(entities) {
        entities.forEach((entity, iEntity) => {
            if (entity.name === "se_solicita") {
                // Get next entity that is data we need
                let value = entities[iEntity + 1].value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                // Parse and remove accents
                value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                if (value === "metros")
                    value = "distancia";
                this.requested.push(value);
            }
        });
    }
    loadData(entities) {
        return new Promise((success, failure) => __awaiter(this, void 0, void 0, function* () {
            for (const entity of entities) {
                // Init data
                const datum = new Datum_1.Datum();
                const responseDatumLoad = yield datum.loadEntity(entity).catch((errDatumLoad) => {
                    // return failure(errDatumLoad);
                    return null;
                });
                // Check for null and continue with the next entity
                if (!responseDatumLoad) {
                    continue;
                }
                // If instance of Datum, we add to the data array
                if (responseDatumLoad instanceof Datum_1.Datum) {
                    this.data.push(responseDatumLoad);
                }
                else {
                    // It it's not, we load the new entities
                    yield this.loadData(responseDatumLoad).catch((errLoadData) => {
                        return failure(errLoadData);
                    });
                }
            }
            return success();
        }));
    }
}
exports.ProblemSolver = ProblemSolver;
