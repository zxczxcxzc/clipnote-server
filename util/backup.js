const prompt = require('prompt');

console.log("*Only local files will be backed up.*")
var yesno = {
    name: 'backup',
    message: 'Back up all notes? [yes/no]',
    validator: /y[es]*|n[o]?/,
    warning: 'Must respond yes or no'
};

prompt.get(yesno, function (err, result) {
    let confirm = result.backup.startsWith('y');
    if(confirm) {
       
    }
});

