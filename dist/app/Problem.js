"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Problem = void 0;
const MRU_1 = require("./Topics/MRU");
const MRUV_1 = require("./Topics/MRUV");
class Problem {
    constructor(requested, data) {
        this.topics = [
            new MRU_1.MRU,
            new MRUV_1.MRUV,
        ];
        // Get which data we need solve
        const problemTopics = requested;
        problemTopics.concat(data.map((datum) => {
            return datum.name;
        }));
        // Check to which topic does it belong the data that we need solve
        const problemsForTopic = {};
        this.topics.forEach((topic) => {
            problemsForTopic[topic.name] = 0;
            Object.keys(topic.equations).forEach((nameOfEquation) => {
                if (problemTopics.includes(nameOfEquation)) {
                    problemsForTopic[topic.name] += 1;
                }
            });
        });
        // Check topic with more data
        let topicChoosed = "";
        let maxTopicChoosed = 0;
        Object.keys(problemsForTopic).forEach((nameOfTopic) => {
            if (problemsForTopic[nameOfTopic] > maxTopicChoosed) {
                topicChoosed = nameOfTopic;
                maxTopicChoosed = problemsForTopic[nameOfTopic];
            }
        });
        // Get instance of topic
        this.topic = this.topics.find((topic) => {
            return (topic.name === topicChoosed);
        });
    }
    check(requested, data) {
        if (!this.topic) {
            throw new Error("Topic not founded");
        }
        // Set data to topic
        this.topic.data = data;
        // Process requested data
        for (const requestedField of requested) {
            this.topic.solveEquation(requestedField);
        }
        // Get all data and match it with requested
        return this.topic.data.filter((datum) => {
            return requested.some((requestedField) => {
                return requestedField === datum.name;
            });
        });
    }
}
exports.Problem = Problem;
