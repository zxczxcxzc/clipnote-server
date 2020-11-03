const fs = require('fs');

function timestamp() {
    var d = new Date();
    return `[${d.toLocaleString()}]`;
}

module.exports = {
    info: function(message) {
        console.log(timestamp() + " [i] " + message);
    },
    warn: function(message) {
        console.log(timestamp() + " [!] WARNING: " + message);
    },
    error: function(message) {
        console.log(timestamp() + " [!!] ERROR: " + message);
    }
}