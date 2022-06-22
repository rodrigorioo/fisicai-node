const {ProblemSolver} = require("../dist/ProblemSolver");


exports.solveProblem = (req, res) => {

    if(req.query.problem) {

        // Init class
        const problemSolver = new ProblemSolver(req.query.problem);

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

    res.status(421).send({
        message: 'Problem parameter needed',
    });
};
