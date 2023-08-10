import { db } from "../database/db";
import { Pool } from "mysql";
import {success} from "concurrently/dist/src/defaults";
import {ModelException} from "../Exceptions/Models/ModelException";
import {NotFoundException} from "../Exceptions/Models/NotFoundException";
import {fail} from "assert";

export class Model {

    protected db: Pool = db;
    protected table: string = "";

    constructor() {}

    findById (id: number) {

        this.db.query(`SELECT * FROM ${this.table} WHERE id = ${id}`, (err, res) => {
            // if (err) {
            //     console.log("error: ", err);
            //     result(err, null);
            //     return;
            // }
            //
            // if (res.length) {
            //     console.log("found tutorial: ", res[0]);
            //     result(null, res[0]);
            //     return;
            // }
            //
            // // not found Tutorial with the id
            // result({ kind: "not_found" }, null);

            if (err) {
                throw new ModelException(err.message);
            }

            if (res.length) {
                return res[0];
            }

            throw new NotFoundException();
        });
    }

    findBy (column: string, value: string|number) {

        return new Promise<object>( (success, failure) => {

            let queryValue = `${value}`;

            if(typeof value === "string") {
                queryValue = `"${value}"`;
            }

            const query = `SELECT * FROM ${this.table} WHERE ${column} = ${queryValue}`;

            this.db.query(query, (err, res) => {

                if (err) {
                    failure(new ModelException(err.message));
                }

                if (res.length) {
                    return success(res[0]);
                }

                failure(new NotFoundException());
            });
        });
    }

    create (columns: object) {

        return new Promise( (success, failure) => {

            // Get columns names and values
            const columnNames = Object.keys(columns);
            const columnValues = Object.values(columns);

            // Build values string
            let values: string = "";
            columnValues.forEach( (value) => {

                if(values !== "") {
                    values += ", ";
                }

                if(typeof value === "string") {
                    values += `'${value}'`;
                } else {
                    values += `${value}`;
                }
            });

            const query = `INSERT INTO ${this.table}(${columnNames.join(", ")}) VALUES (${values})`;

            this.db.query(query, (err, res) => {

                if (err) {
                    failure(new ModelException(err.message));
                }

                success(res);
            });
        });
    }
}
