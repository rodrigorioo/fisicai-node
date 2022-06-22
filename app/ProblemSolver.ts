import {Wit, Entity} from "./Wit";
import {Datum} from "./Datum";
import {Problem} from "./Problem";
import {Operations} from "./Topics/Topic";

interface ReturnResolution {
    data: Array<Datum>,
    requested: Array<keyof Operations>,
    resolution: Array<Datum>,
}

class ProblemSolver {

    problem : string; // Problem to resolve
    requested : Array<keyof Operations>; // Data that are requested
    data : Array<Datum>; // Data of problem
    topic : any;

    constructor (problem : string) {

        this.problem = problem;
        this.requested = [];
        this.data = [];

    }

    processProblem () : Promise<ReturnResolution> {

        return new Promise<ReturnResolution>( (success, failure) => {

            // Init Wit class
            let wit : Wit;

            try {
                wit = new Wit();
            } catch (err) {
                return failure(err);
            }

            // Process message
            wit.processMessage(this.problem).then( () => {

                // Get requested data
                this.loadRequestedData(wit.entities);

                // Load rest of entities
                const entitiesWithoutRequested = wit.entities.filter((entity: Entity) => {
                    return entity.name !== "se_solicita";
                });

                this.loadData(entitiesWithoutRequested).then( () => {

                    // When we have all the data, we process it
                    const problem = new Problem(this.requested, this.data);

                    // Check resolution
                    let resolution : Array<Datum> = [];

                    try {
                        resolution = problem.check(this.requested, this.data);
                    } catch(errResolution : unknown) {

                        return failure(errResolution);

                    }

                    return success({
                        data: this.data,
                        requested: this.requested,
                        resolution,
                    });
                });

            }).catch( (errProcessMessage : Error) => {
                return failure(errProcessMessage);
            });
        });
    }

    loadRequestedData (entities : Array<Entity>) {

        entities.forEach( (entity : Entity, iEntity : number) => {

            if(entity.name === "se_solicita") {

                // Get next entity that is data we need
                let value : string = entities[iEntity + 1].value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                // Parse and remove accents
                value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                if(value === "metros")
                    value = "distancia";

                this.requested.push(value as keyof Operations);
            }
        });
    }

    loadData (entities : Array<Entity>) {

        return new Promise<void>( async (success, failure) => {

            for(const entity of entities) {

                // Init data
                const datum = new Datum();
                const responseDatumLoad: Array<Entity> | Datum | unknown = await datum.loadEntity(entity).catch((errDatumLoad: string) => {
                    return failure(errDatumLoad);
                });

                // If instance of Datum, we add to the data array
                if (responseDatumLoad instanceof Datum) {

                    this.data.push(responseDatumLoad);

                } else if (responseDatumLoad instanceof Array) { // It it's not, we load the new entities

                    await this.loadData(responseDatumLoad).catch((errLoadData: string) => {
                        return failure(errLoadData);
                    });
                }

            }

            return success();

        });
    }
}

export {ProblemSolver};
