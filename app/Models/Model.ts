import { db } from "../database/db";
import {OkPacket, Pool} from "mysql";
import {ModelException} from "../Exceptions/Models/ModelException";
import {NotFoundException} from "../Exceptions/Models/NotFoundException";

export class Model {

    protected static db: Pool = db;
    protected static table: string = "";

    constructor() {}

    /**
     * Find row by id field
     * @param id
     */
    static findById (id: number) {

        return new Promise<object>( (success, failure) => {
            const query = `SELECT * FROM ${this.table} WHERE id = ${id}`;

            this.db.query(query, (err, res) => {

                if (err) {
                    return failure(new ModelException(err.message));
                }

                if (res.length) {
                    return success(res[0]);
                }

                failure(new NotFoundException());
            });
        });
    }

    /**
     * Field row by column name and value
     * @param column
     * @param value
     */
    static findBy (column: string, value: string|number) {

        return new Promise<object>( (success, failure) => {

            let queryValue = `${value}`;

            if (typeof value === "string") {
                queryValue = `"${value}"`;
            }

            const query = `SELECT * FROM ${this.table} WHERE ${column} = ${queryValue}`;

            this.db.query(query, (err, res) => {

                if (err) {
                    return failure(new ModelException(err.message));
                }

                if (res.length) {
                    return success(res[0]);
                }

                failure(new NotFoundException());
            });
        });
    }

    /**
     * Find rows by columns names and values
     * @param columns
     */
    static get (columns: object) {

        return new Promise<object>( (success, failure) => {

            // Get columns names and values
            const columnNames = Object.keys(columns);
            const columnValues = Object.values(columns);

            // Build where's string
            let wheres: string = "";
            columnNames.forEach( (column, iColumn) => {

                const value = columnValues[iColumn];

                if(wheres !== "") {
                    wheres += " AND ";
                }

                wheres += `${column} = `;

                // Insert value of column
                if(typeof value === "string") {
                    wheres += `'${value}'`;
                } else {
                    wheres += `${value}`;
                }
            });

            const query = `SELECT * FROM ${this.table} WHERE ${wheres}`;

            this.db.query(query, (err, res) => {

                if (err) {
                    return failure(new ModelException(err.message));
                }

                return success(res);
            });
        });
    }

    /**
     * Create new row sending columns object with column names and values
     * @param columns
     */
    static create (columns: object): Promise<OkPacket> {

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
                    return failure(new ModelException(err.message));
                }

                success(res);
            });
        });
    }
}
