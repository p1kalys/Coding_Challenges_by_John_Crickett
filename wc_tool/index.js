const packageJson = require("./package.json");

const fs = require("fs");
const readline = require("readline");


//Function to write file

function creatingFile(filePath) {
  if (!fs.existsSync(filePath)) {
    try {
      fs.writeFileSync(filePath, " ");
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("file already exists");
  }
}


// Function to count the number of bytes in a file

function countBytes(filePath) {
  try {
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      const byteCount = stats.size;
      console.log(`${byteCount} ${filePath}`);
      return byteCount;
    } else {
      console.error(`${filePath} is a directory`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`No such file or directory`);
    process.exit(1);
  }
}


// Function to count the number of lines in a file

function countLines(filePath) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      output: process.stdout,
      terminal: false,
    });

    let lineCount = 0;

    rl.on("line", (line) => {
      if (line.trim() !== "") {
        lineCount++;
      }
    });

    rl.on("close", () => {
      console.log(`${lineCount} ${filePath}`); // Log the line count
      resolve(lineCount); // Resolve the promise with the line count
    });

    rl.on("error", (error) => {
      console.error(`No such file or directory`);
      reject(error); // Reject the promise in case of an error
    });
  });
}


//Function to count the words in a file

function countWords(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const words = data.split(/\s+/).filter((word) => word.trim() !== "");
    console.log(`${words.length} ${filePath}`);
    return words.length;
  } catch (error) {
    console.error(`Error reading ${filePath}: ${error}`);
    process.exit(1);
  }
}


// Function to count characters in a file

function countCharacters(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const data = content.split("");
    const characterCount = data.length;
    console.log(`${characterCount} characters in ${filePath}`);
    return characterCount;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with an error code
  }
}


// Funtion to count bytes,lines and words with no args

async function countBytesLinesWords(filePath) {
  const byteCount = await countBytes(filePath);
  const wordCount = await countWords(filePath);
  const lineCount = await countLines(filePath);
  const charactersCount = await countCharacters(filePath);
  console.log(`${byteCount} ${wordCount} ${lineCount} ${charactersCount} ${filePath}`);
}


// Extracting command-line arguments, excluding the first two elements (node and script name)

const [, , ...args] = process.argv;


// switch case to handle different command-line options

switch (args[0]) {
  case "-c":
    if (args.length !== 2 || args[0] !== "-c") {
      console.error("Usage: ccwc -c <file>");
      process.exit(1);
    }
    countBytes(args[1]);
    break;
  case "-l":
    if (args.length !== 2 || args[0] !== "-l") {
      console.error("Usage: ccwc -l <file>");
      process.exit(1);
    }
    countLines(args[1]);
    break;
  case "-w":
    if (args.length != 2 || args[0] !== "-w") {
      console.error("Usage: ccwc -w <file>");
      process.exit(1);
    }
    countWords(args[1]);
    break;
  case "-m":
    if (args.length != 2 || args[0] !== "-m") {
      console.error("Usage: ccwc -m <file>");
      process.exit(1);
    }
    countCharacters(args[1]);
    break;
  case "-version":
    if (args[0] === "-version") {
      console.log(`ccwc version:\n ${packageJson.version}`);
      process.exit(0);
    }
    break;
  case "-help":
    console.log(`Usage: ccwc [options] <file>

      Options:
        -c, --bytes    Print the byte counts
        -l, --lines    Print the newline counts
        -w  --words    Print the word counts
        -m, --chars    Print the character counts
      `);
    break;
  default:
    if (args.length !== 1) {
      console.error("Usage: ccwc -help");
      process.exit(1);
    }
    countBytesLinesWords(args[0]);
}
