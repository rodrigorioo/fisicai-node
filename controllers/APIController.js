const {ProblemSolver} = require("../dist/ProblemSolver");


exports.solveProblem = (req, res) => {

    const problem = req.query.problem || req.body.problem;

    if(problem) {

        // Init class
        const problemSolver = new ProblemSolver(problem);

        // Solve the problem
        problemSolver.processProblem().then( (witData) => {

            res.json(witData);

        }).catch( (err) => {

            res.status(500).send({
                message: err.message,
            });
        });

        return;
    }

    res.status(422).send({
        message: 'Problem parameter needed',
    });
};
