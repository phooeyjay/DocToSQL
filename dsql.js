let fsex = require('fs-extra');

function NotImplementedAlert() { alert('Not implemented!'); }

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
};

class UpdateTemplate {
    /** @param {string} name @param {SQLColumnValuePair[]} modifications @param {SQLColumnValuePair[]} conditions */
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
};

class DSQL {
    constructor() {
        /** @private @type {UpdateTemplate[]} */
        this.SQLInstances = [];
    }

    /** @private @param {UpdateTemplate} sql */
    AddSQL(sql) { this.SQLInstances.push(sql); }

    /** @param {string} serv @param {string} db @param {string} table  @param {SQLColumnValuePair[]} modifs @param {SQLColumnValuePair[]} condis */
    AppendDefaultSQLFormat(serv, db, table, modifs, condis) { this.AddSQL(new UpdateTemplate(`[${serv}].[${db}].[${table}]`, modifs, condis)); }

    CopySQL() {
        let copyString = '';
        if (this.SQLInstances && this.SQLInstances.length != 0) {
            for (let SQLInstance of this.SQLInstances) copyString += SQLInstance.BuildSQL() + '\n';
        }

        console.log(copyString);
    }

    ClearSQL() { this.SQLInstances.length = 0; }

    OptimizeSQL() { 
        NotImplementedAlert();
    }

    /** @param {string} id */
    RemoveSQL(id) {
        if (id != '') this.SQLInstances.splice(this.SQLInstances.findIndex(i => i.InstanceID == id), 1);
    }
}

document.addEventListener('readystatechange', function() {
    if (document.readyState == 'complete') {
        let DSQLInstance = new DSQL();

        document.getElementById('optSQL').addEventListener('click', DSQLInstance.OptimizeSQL);
        document.getElementById('copyTo').addEventListener('click', DSQLInstance.CopySQL);
        document.getElementById('makeFile').addEventListener('click', NotImplementedAlert);
    }
})
