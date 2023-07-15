import csv from "csv-parser";
import fs from "fs";
import moment from "moment";

function printRow(
  rowNr: string | number,
  date: string | Date,
  amount: string | number,
  payee: string,
  memo: string
) {
  console.log(
    String(rowNr).padEnd(3),
    " | ",
    String(date).padEnd(8),
    " | ",
    String(amount).padStart(10),
    " | ",
    payee.padEnd(15),
    " | ",
    memo.padEnd(20)
  );
}

function csv2qif(
  inputFile: string = "input.csv",
  outputFile: string = "output.qif"
): void {
  const qifData: string[] = [];
  qifData.push("!Type:Bank");

  console.log(
    "Number of data rows in the csv file:",
    fs.readFileSync(inputFile, "utf8").split("\n").length - 2
  );

  let rowNr = 1;

  console.log("");
  printRow("Row", "Date", "Amount", "Payee", "Memo");
  console.log("".padEnd(80, "-"));

  fs.createReadStream(inputFile)
    .pipe(csv({ separator: ";", mapHeaders: ({ header }) => header.trim() }))
    .on("data", (row) => {
      printRow(rowNr++, row.Date, row.Amount, row.Payee, row.Memo);

      let Date = moment(row.Date, "DD/MM/YY");

      if (Date.isValid()) {
        qifData.push("D" + Date.format("DD/MM/YY"));
      } else {
        qifData.push("D" + " - invalid date " + row.Date + "");
        console.log("Invalid date:", row.Date);
      }

      qifData.push("M" + row.Memo);
      qifData.push("T" + row.Amount.trim());
      qifData.push("P" + row.Payee.trim());
      qifData.push("^");
    })
    .on("end", () => {
      console.log("");
      fs.writeFile(outputFile, qifData.join("\n"), (err) => {
        if (err) {
          console.log("Error writing QIF file", err);
        } else {
          console.log("QIF file created successfully");
        }
      });
    });
}

// Usage:
const args = process.argv.slice(2);
switch (args.length) {
  case 0:
    csv2qif();
    break;
  case 1:
    csv2qif(args[0]);
    break;
  default:
    csv2qif(args[0], args[1]);
}
