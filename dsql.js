let fsex = require('fs-extra');
let DSQL = {};

DSQL.SQLHistory = [];
DSQL.ClearHistory = function () { DSQL.SQLHistory.length = 0 };

//#region Predefines
DSQL.PREDEFINES = {}
/**
 * Defines the conversion type and thus the module of DSQL to use.
 */
DSQL.PREDEFINES.CType = { UNDEFINED: null, DEF2SQL: 'DEFAULT2SQL' };

class SQLColumnValuePair {
    /**
     * Defines a key-value pair relating to a column and its field value
     * @param {string} col The identity of the SQL column to change.
     * @param {string | number} val A value of either string or a number to modify the original value in the specified column.
     */
    constructor(col, val) {
        this.Column = col;
        this.Value = val;
    }

    AsQueryString() { 
        let rewrite = typeof(this.Value) === Number ? this.Value : `'${this.Value}'`;
        return `[${this.Column}] = ${rewrite}`;
    }
};
DSQL.PREDEFINES.SQLColumnValuePair = SQLColumnValuePair;

class UpdateTemplate {
    /**
     * Defines the template of an SQL UPDATE statement.
     * @param {string} name 
     * @param {SQLColumnValuePair[]} modifications Defines an array of SQLColumnValuePairs that should be modified.
     * @param {SQLColumnValuePair[]} conditions Defines an array of SQLColumnValuePairs that act as the condition to query against the specified table.
     */
    constructor(name = '', modifications = [], conditions = []) {
        this.ConcatenatedTableInfo = name;
        this.Modifications = modifications;
        this.Conditionals = conditions;
    }

    BuildSQL() {
        let sqlString = `UPDATE ${this.ConcatenatedTableInfo} SET`;

        if (this.Modifications.length != 0) {
            for (let modif of this.Modifications) sqlString += ` ${modif.AsQueryString()},`;
            sqlString = sqlString.substring(0, sqlString.length - 1);

            if (conditions.length != 0) {
                sqlString += ' WHERE';
                for (let cond of this.Conditionals) sqlString += ` ${cond.AsQueryString()},`;
            }
            sqlString = sqlString.substring(0, sqlString.length - 1);
        }
        return `${sqlString};`;
    }

    /**
     * Checks if the current template matches another template.
     * @param {UpdateTemplate} upd An UpdateTemplate to match against. 
     */
    IsSimilarContext(upd) {
        return this.ConcatenatedTableInfo === upd.ConcatenatedTableInfo &&
            this.Modifications === upd.Modifications &&
            this.Conditionals === upd.Conditionals;
    }
}
DSQL.PREDEFINES.UpdateTemplate = UpdateTemplate;
//#endregion

//#region Default2SQL
DSQL.DEFAULT2SQL = {};
/**
 * Appends an SQL UPDATE instance to history using DEFAULT2SQL definition.
 * @param {string} server The server name containing the database.
 * @param {string} db The database name containing the table.
 * @param {string} table The table name containing the pairs for modification and conditions.
 * @param {SQLColumnValuePair[]} modifs An array of SQLColumnValuePairs to modify.
 * @param {SQLColumnValuePair[]} condis An array of SQLcolumnValuePairs to be used as conditionals.
 */
DSQL.DEFAULT2SQL.AppendSQLUpdate = function (server, db, table, modifs, condis) { 
    DSQL.SQLHistory.push(new DSQL.PREDEFINES.UpdateTemplate(`[${server}].[${db}].[${table}]`, modifs, condis));
}
//#endregion

//#region CSV2SQL
DSQL.CSV2SQL = {};
/**
 * Appends an SQL UPDATE instance to history using CSV2SQL definition.
 * @param {string} server The server name containing the database.
 * @param {string} db The database name containing the table.
 * @param {string} table The table name containing the pairs for modification and conditions.
 * @param {string} csv A local directory path defining a CSV document to parse.
 */
DSQL.CSV2SQL.AppendSQLUpdate = function(server, db, table, csv) {
    throw 'Not implemented';
}
//#endregion