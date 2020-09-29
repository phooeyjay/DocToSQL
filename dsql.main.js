/* Arrange variables */
let DSQLInstance = new (require('./dsql.classes').DSQL)();
let { NotImplementedError } = require('./dsql.misc');

/* EventListeners assignment */
document.getElementById('optimize').addEventListener('click', function () { DSQLInstance.OptimizeSQL(); });
document.getElementById('copy').addEventListener('click', function () { DSQLInstance.CopySQLToClipboard(); });
document.getElementById('save').addEventListener('click', function () { throw NotImplementedError('Create_SQL_File'); });

