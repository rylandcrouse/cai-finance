
// This service takes the filepath of a TSV file and
//  expects the data columns to be structured as
//  Date	Open	High	Low	Close	Volume
//  and it should be oldest first, like the test file provided
//  and writes the following to an output file:
//     a. What day was there the largest variance between the High and Low?
//     b. What was the average volume for the month of July 2012?
//     c. What is the maximum profit potential per share? And what day(s) would you have had
//         to buy low and sell high to get this maximum profit?


const readTSV = require('../utils/readTSV.js');
const writeLines = require('../utils/writeLines.js');
const path = require('path')


const main = async (filepath, monthAndYear) => {
    const TSVData = await readTSV(filepath);

    // Tracks information for the largest one-day variance between the High and Low
    let bestDiffDay = {
        diff: 0,
        date: null
    }

    // Stores entry count and trade volume for a given month and year to find the average
    // daily trade volume for that month
    let monthToCheckInfo = {
        entries: 0,
        volume: 0
    };


    // Variables for sliding window technique used to find max profit potential and
    // buy-sell dates for that profit
    let best = {
        profit: 0,
        high: null,
        low: null
    };
    let current = {
        profit: 0,
        high: null,
        low: null
    };

    // Iterate through the rows of TSVData which in this case, should have info for days of a stock
    for (let row of TSVData) {
        ////////////////  logic for finding day with the largest differece ////////////////
        /////////////// between high and low ///////////////////////////////////////
        let diffOfDay = Math.abs(Number(row.High) - Number(row.Low));
        if (diffOfDay > bestDiffDay.diff) {
            bestDiffDay.diff = diffOfDay;
            bestDiffDay.date = row.Date;
        }



        //////  logic for finding best profit potential and dates ////////////////
        /////// to buy and sell for that profit ///////////////////////////////////////////

        // if there is no current, we can assume this is our first iteration and
        // use today for both low and high
        if (!current.profit) {
            current['high'] = row;
            current['low'] = row;
        }

        // if there is a new low or high, store as our current best
        if (Number(row.High) > Number(current['high'].High)) current['high'] = row;
        if (Number(row.Low) < Number(current['low'].Low)) current['low'] = row;
        
        // if there is a best
        if (best.high) {
            // in some cases the low can apply for the best where there is no new low
            if (Number(row.Low) < Number(best['low'].Low)) best['low'] = row;
            // calculate best profit
            best.profit = Number(best.high.High) - Number(best.low.Low)
        }

        // calculate current profit
        current.profit = Number(current.high.High) - Number(current.low.Low)
        
        // if the current profit is more than best, best becomes current
        if (current.profit > best.profit) best = {...current};


        ///////// Logic for checking if date to check is date of current row ////////////////
        //////// and accumulate data for the month given //////////////////////////////
        if (monthAndYear && row.Date.toLowerCase().endsWith(monthAndYear.toLowerCase())) {
            monthToCheckInfo.entries++;
            monthToCheckInfo.volume += Number(row.Volume);
        }
    }

    const avgOfMonthGiven = monthToCheckInfo.entries > 0 ? monthToCheckInfo.volume / monthToCheckInfo.entries : 0;
    
    let formattedForOutput = formatForOutput(bestDiffDay, {avg: avgOfMonthGiven, monthAndYear}, best);
    // pass writeLines a filepath of projectroot/[readfile name].out to output to
    writeLines(formattedForOutput, process.cwd() + `/${path.parse(filepath).name}.out`);
    return
}


// formatForOutput takes information returned from the main financeDataEval function
// and returns the same information in a human readable form as an array of strings
function formatForOutput(maxDayVariance, givenMonthAvgInfo, profitPotentialInfo) {
    let result = [];

    if (maxDayVariance.date) {
        let maxDayVarianceText = `The largest single-day variance between the High and Low occurred on ${maxDayVariance.date} with a difference of ${maxDayVariance.diff}.\n\n`
        result.push(maxDayVarianceText);
    }

    if (givenMonthAvgInfo.monthAndYear) {
        let givenMonthAvgText = `The average volume for the month of ${givenMonthAvgInfo.monthAndYear} was ${givenMonthAvgInfo.avg}.\n\n`
        result.push(givenMonthAvgText);
    }

    if (profitPotentialInfo.high != null) {
        let profitPotentialText = `The maximum profit potential for this share was ${profitPotentialInfo.profit} with a purchase date of ${profitPotentialInfo.low.Date} at ${profitPotentialInfo.low.Low} and a sell date of ${profitPotentialInfo.high.Date} at ${profitPotentialInfo.high.High}.
        `
        result.push(profitPotentialText);
    }

    return result
}

// Takes output from readTSV and returns a dict of the data indexed by date
// Note: only needed if later, we might want to save the data in storage, like a database or even a json file
// For now we cash the data in memory only while the program is running.
function indexByDate(data) {
    const result = {};
    data.forEach(({Date, ...rest}) => {
        result[Date] = {
            ...rest
        }
    });
    return result
}


// If service is called directly, run main function
if (require.main === module) {
    main(process.argv[2], process.argv[3]);
}

module.exports = main;