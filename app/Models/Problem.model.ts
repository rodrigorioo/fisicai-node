import {Model} from "./Model";

class ProblemModel extends Model {

    private problem: string;

    constructor(problem: string) {
        super();

        this.problem = problem;
    }
}
