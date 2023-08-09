import { createPool } from "mysql";

// const dbConfig = require("../config/db.config.js");
import { dbConfig } from "../config/db.config";

export const db = createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});
