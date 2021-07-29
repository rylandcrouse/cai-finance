// This utility expects an array and a filepath and writes each element
// to a line of the file at the filepath

const fs = require('fs');


const main = async (lines, filepath) => {
    if (!lines || !Array.isArray(lines)) throw new Error('No array of elements to write given to writeLines.js');
    if (!filepath || typeof filepath !== 'string') throw new Error('No filepath given to writeLines.js')
    for (let line of lines) {
        console.log(line);
        fs.appendFile(filepath, line.toString(), function (err) {
            if (err) {
              // append failed
              throw err;
            }
          })
    }
}

// If service is called directly, run main function
if (require.main === module) {
    main();
}

module.exports = main;