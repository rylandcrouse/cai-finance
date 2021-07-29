# cai-exchange

CAI-Exchange is a node.js program for dealing with stock data.

## Installation

Use the node package manager to install the libraries for CAI-Exchange once cloned.

From the root directory, run:

```bash
npm i
```

## Usage

Services are made to be modular and can be ran from the API or command line directly.

The service financeDataEval expects the absolute path of the TSV file to read from and optionally,
a month and year of which we will find the average daily trade volume for.

```bash
node PATH/TO/financeDataEval.js PATH/TO/STOCKDATAFILE.txt jun-12
```

Optionally, use the bash script file _tryme_ which whill run the financeDataEval service for you with test values.

Note, you must grant permission to _tryme_ for the bash script to run.

```bash
chmod 755 ./tryme
./tryme
```
