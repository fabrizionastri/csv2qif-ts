# CSV to QIF Converter

This is a utility for converting CSV files into QIF (Quicken Interchange Format) files. It's implemented in TypeScript and runs as a Node.js script.

The utility reads data from a specified CSV file and writes it to a new QIF file. It prints to the console details about the process, including the number of rows in the CSV file, the data in each row, and whether the file was written successfully.

## Prerequisites

- Node.js (version 10 or later)
- NPM (comes with Node.js)

_Note: I recommend using PNPM instead of NPM, as it stores all you packages in a single location on your disk, and uses hard links to install your packages in each repo. This makes installation much faster, saves space and allows installing packages offline. Install with `npm install -g pnpm`'_

## Dependencies

- `csv-parser` for reading CSV files.
- `moment` for parsing and formatting dates.
- `fs` for reading and writing files.

## Installation

1. Clone this repository to your local machine.
2. Navigate to the directory where the repository was cloned.
3. Run `npm install` (or `pnpm install` if you're using PNPM) to install the dependencies

## Usage

To convert a CSV file to QIF, run:

```
ts-node csv2qif.ts [input] [output]
```

Replace `[input]` with the path/filename of your CSV file, and `[output]` with the path/filename of the QIF file to be written.

Arguments:

- if no arguments are provided, the utility will look for a file named `input.csv` in the current directory, and write the output to a file named `output.qif` in the current directory.
- if one argument is provided, the utility will look for a file with that name in the current directory, and write the output to a file named `output.qif` in the current directory.
- if two arguments are provided, the utility will look for a file with the first name in the current directory, and write the output to a file with the second name in the current directory.

## CSV Format

The CSV file should be formatted as follows:

```
Date;Amount;Payee;Memo
22/06/21;-14.90;some payee name;some memo
```

- `Date`: the date of the transaction in `DD/MM/YY` format.
- `Amount`: the amount of the transaction, negative for expenses and positive for income. the amount must be in the format `###0.00` (no separators for thousands, and a dot for the decimal separator).
- `Payee`: the name of the payee or payor.
- `Memo`: a memo or note about the transaction (optional)

All fields should be separated by semicolons (`;`).

If that is not the format you want, then change the code in `csv2qif.ts` to match your format.

## QIF Format

The resulting QIF file will be formatted like this:

```
!Type:Bank
D22/06/21
T-14.90
Psome payee name
Msome memo
^
```

- `D`: date of the transaction.
- `T`: amount of the transaction.
- `P`: payee of the transaction.
- `M`: memo about the transaction.
- `^`: end of the transaction record.

Each field begins with a single-letter code, followed by the data for that field. Transaction records are separated by caret (`^`) characters.
