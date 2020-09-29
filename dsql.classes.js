let { NotImplementedError } = require('./dsql.misc');

class SQLColumnValuePair {
    /** @param {string} col @param {string | number} val */
    constructor(col, val) {
        this.Column = col;
        this.Value = val;
    }

    AsQueryString() {
        let rewrite = typeof this.Value == 'number' ? this.Value : `'${this.Value}'`;
        return `[${this.Column}] = ${rewrite}`;
    }
}

class Template {
    /** @param {string} name @param {SQLColumnValuePair[]} conditions */
    constructor(name, conditions) {
        this.InstanceID = `${Date.now()}`;
        this.ConcatTableInfo = name;
        this.QueryConditions = conditions;
    }
}

class UpdateTemplate extends Template {
    /** @param {string} name @param {SQLColumnValuePair[]} conditions @param {SQLColumnValuePair[]} modifications */
    constructor(name, conditions, modifications) {
        super(name, conditions);
        this.QueryModifications = modifications;
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
}

class DSQL {
    constructor() {
        /** @private @type {UpdateTemplate[]} */
        this.SQLInstances = [];
    }

    /** @private @param {UpdateTemplate} sql */
    AddSQL(sql) { this.SQLInstances.push(sql); }

    /** @param {string} serv @param {string} db @param {string} table  @param {SQLColumnValuePair[]} modifs @param {SQLColumnValuePair[]} condis */
    AppendDefaultSQLFormat(serv, db, table, modifs, condis) { this.AddSQL(new UpdateTemplate(`[${serv}].[${db}].[${table}]`, modifs, condis)); }

    ClearSQL() { this.SQLInstances.length = 0; }

    CopySQLToClipboard() {
        let copyString = '';
        for (let SQLInstance of this.SQLInstances) copyString += SQLInstance.BuildSQL() + '\n';

        navigator.clipboard.writeText(copyString).then(
            function () { alert('Successfully copied to clipboard.'); },
            function (reason) { alert(`Failed to copy to clipboard: ${reason}.`); }
        );
    }

    OptimizeSQL() {
        throw NotImplementedError(this.OptimizeSQL.name);
    }

    /** @param {string} id */
    RemoveSQL(id) {
        if (id != '') this.SQLInstances.splice(this.SQLInstances.findIndex(i => i.InstanceID == id), 1);
    }
}
/** @class */
module.exports.DSQL = DSQL;