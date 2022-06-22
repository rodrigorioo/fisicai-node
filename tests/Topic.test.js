const assert = require('assert');

const {Topic} = require("../dist/Topics/Topic");

describe("Evaluate math string",  () => {

    const topic = new Topic();

    it('Should return 10',() => {
        assert.equal(10, topic.evaluateMathString("15 - 5"));
    });

    it('Should return 5',() => {
        assert.equal(5, topic.evaluateMathString("(20 - 10) / 2"));
    });
});
