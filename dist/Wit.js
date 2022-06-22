"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wit = void 0;
const axios = require('axios');
class Wit {
    constructor() {
        if (!process.env.WIT_URL || !process.env.WIT_ACCESS_TOKEN) {
            throw new Error("Access Token not defined");
        }
        this.url = process.env.WIT_URL;
        this.accessToken = process.env.WIT_ACCESS_TOKEN;
        this.entities = [];
        this.traits = [];
    }
    processMessage(message) {
        return new Promise((success, failure) => {
            axios.get(this.url, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`
                },
                params: {
                    q: message,
                },
            })
                .then((response) => {
                const dataWit = response.data;
                // Process entities
                const entitiesObj = dataWit.entities;
                // Add all entities object to an array
                Object.values(entitiesObj).forEach((entities) => {
                    entities.forEach((entity) => {
                        // Check if entity is not a number (wit$number) and is a single word
                        if (entity.name !== "wit$number" && !['Un', 'Una', 'un', 'una'].includes(entity.body)) {
                            this.entities.push(entity);
                        }
                    });
                });
                // Order the array using "start"
                this.entities.sort((a, b) => {
                    if (a.start > b.start) {
                        return 1;
                    }
                    else if (a.start < b.start) {
                        return -1;
                    }
                    return 0;
                });
                // Process traits
                // TODO:
                return success();
            })
                .catch((error) => {
                throw new Error(error);
            });
        });
    }
}
exports.Wit = Wit;
