const parse = require('csv-parse');
const fs = require('fs');

// This util takes the absolute filepath to a TSV file and returns an array of rows from the TSV
const main = async (filepath) => {
    if (!filepath || typeof filepath != 'string') throw new Error('paseFinanceTSV requires a filepath as a string to a TSV')
    const data = [];
    // TODO: take filepath as param and read from it 
    const parser = fs
        .createReadStream(filepath)
        .pipe(
            parse({
                delimiter: "\t",
                columns: true
            })
        )
    for await (const row of parser) {
        // Work with each record
        data.push(row)
    }
    return data
}

// If service is called directly, run main function
if (require.main === module) {
    main(process.argv[2]);
}

module.exports = main;