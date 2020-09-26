let fsex = require('fs-extra');
let DSQL = {};

//#region Predefines
DSQL.PD = {};
class SQLColumnValuePair {
    /**
     * Defines a key-value pair relating to a column and its field value.
     * @param {string} col The identity of the SQL column to change.
     * @param {string | number} val A value of either string or a number to modify the original value in the specified column.
     */
    constructor(col, val) {
        this.Column = col;
        this.Value = val;
    }

    AsQueryString() {
        let rewrite = typeof this.Value == 'number' ? this.Value : `'${this.Value}'`;
        return `[${this.Column}] = ${rewrite}`;
    }
};
DSQL.PD.SQLColumnValuePair = SQLColumnValuePair;

class UpdateTemplate {
    /**
     * Defines the template of an SQL UPDATE statement.
     * @param {string} name 
     * @param {SQLColumnValuePair[]} modifications Defines an array of SQLColumnValuePairs that should be modified.
     * @param {SQLColumnValuePair[]} conditions Defines an array of SQLColumnValuePairs that act as the condition to query against the specified table.
     */
    constructor(name = '', modifications = [], conditions = []) {
        this.InstanceID = `UT${Date.now()}`;
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
};
DSQL.PD.UpdateTemplate = UpdateTemplate;
//#endregion

//#region Commons
DSQL.COMMON = {
    /** @type {UpdateTemplate[]} */
    SQLInstances: [],

    /** @param {UpdateTemplate} instance An SQL Template instance to be added to the array. */
    AddInstance: function (instance) { this.SQLInstances.push(instance); },
    ClearInstances: function () { this.SQLInstances.length = 0; },
    /** @param {string} id Defines the ID to filter out of the array. */
    RemoveInstance: function (id) { this.SQLInstances.splice(this.SQLInstances.findIndex(i => i.InstanceID == id), 1); }
}
//#endregion

//#region X2SQL
DSQL.SQL = {
    /**
     * Appends an SQL UPDATE instance using DEFAULT2SQL format.
     * @param {string} server Defines the name of the server.
     * @param {string} db Defines the name of the database.
     * @param {string} table Defines the name of the table.
     * @param {SQLColumnValuePair[]} modifs A set of column-value pairs to modify.
     * @param {SQLColumnValuePair[]} condis A set of column-value pairs to use as update conditionals.
     */
    DEF2SQL: function (server, db, table, modifs, condis) {
        DSQL.COMMON.SQLHistory.push(new DSQL.PD.UpdateTemplate(`[${server}].[${db}].[${table}]`, modifs, condis));
    }
};
//#endregion
