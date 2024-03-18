const jsonparser = (json) => {
  const firstAndLastChars = (first, last) => {
    return (str) => {
      return str[0] === first && str[str.length - 1] === last;
    };
  };

  const isArray = firstAndLastChars("[", "]");

  const isObj = firstAndLastChars("{", "}");

  const hasDoubleQuotes = firstAndLastChars('"', '"');

  const hasSingleQuotes = firstAndLastChars("'", "'");

  const isString = (str) => {
    str = str.trim();
    return (
      (hasSingleQuotes(str) || hasDoubleQuotes(str)) &&
      str[str.length - 2] !== "\\"
    );
  };

  const isNumber = function (str) {
    return +str + "" === str;
  };

  const removeFirstandLastChar = function (str) {
    str = str.trim();
    return str.substring(1).slice(0, str.length - 2) || "";
  };

  const splitByChar = (base_char) => {
    return (str) => {
      var result = [];
      var double_string_open = false;
      var single_string_open = false;
      var array_open = false;
      var object_open = false;
      var array_bracket_count = 0;
      var object_bracket_count = 0;
      var cur_str = "";
      var prev_ch = "";
      for (var i = 0; i < str.length; i++) {
        var ch = str[i];
        if (ch === '"') {
          double_string_open = !double_string_open;
        }
        if (ch === "'") {
          single_string_open = !single_string_open;
        }
        if (ch === "[") {
          array_bracket_count += 1;
          array_open = true;
        }
        if (ch === "]") {
          array_bracket_count -= 1;
          if (array_bracket_count === 0) {
            array_open = false;
          }
        }
        if (ch === "{") {
          object_bracket_count += 1;
          object_open = true;
        }
        if (ch === "}") {
          object_bracket_count -= 1;
          if (object_bracket_count === 0) {
            object_open = false;
          }
        }

        if (
          ch === base_char &&
          !double_string_open &&
          !single_string_open &&
          !array_open &&
          !object_open
        ) {
          if (cur_str !== "") result.push(cur_str.trim());
          cur_str = "";
          prev_ch = "";
        } else {
          cur_str += ch;
          prev_ch = ch;
        }
      }
      if (cur_str !== "") result.push(cur_str.trim());
      return result;
    };
  };
  const seperateStringByCommas = splitByChar(",");
  const seperateStringByColons = splitByChar(":");

  var parsedJSON = (str, parent) => {
    str = str.trim();
    if (isArray(str)) {
      if (str[str.length - 1]===',' || str[0] ===',' || str[0]==="" || str[str.length - 1]==="") {
        throw new Error("Unexpected error in input");
      }
      const elements = seperateStringByCommas(removeFirstandLastChar(str));
      const result = elements.map((element) => parsedJSON(element, parent));
      return result;
    } else if (isObj(str)) {
      var obj = {};
      var _obj = seperateStringByCommas(removeFirstandLastChar(str));
      _obj.forEach((val, i) => {
        var key_val = seperateStringByColons(val);
        if (key_val.length === 2) {
          obj[parsedJSON(key_val[0], parent)] = parsedJSON(key_val[1], parent);
        }
      });
      return obj;
    } else if (isString(str)) {
      return removeFirstandLastChar(str).replace(/([\\]{1})([\\\'']{1})/g, "$2");
    } else if (isNumber(str)) {
      return +str;
    }
    if (str === "null") return null;
    if (str === "false") return false;
    if (str === "true") return true;
    if (str === "undefined") return undefined;
  
    throw new Error("Unexpected end of input");
  };
  
  return parsedJSON(json);
};


const fs = require("fs");
const path = require("path");

/*
// Function to test JSON files in a directory
async function testJSONFiles(directory) {
    // Read the contents of the directory
    await fs.readdir(directory, async (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        // Iterate through each file
        await files.forEach(async (file) => {
            // Check if the file has a .json extension
            if (path.extname(file) === '.json') {
                // Read the JSON file
                await fs.readFile(path.join(directory, file), 'utf8',async (err, data) => {
                    if (err) {
                        console.error('Error reading file:', file, err);
                        return;
                    }

                    // Test the JSON data
                    console.log('Testing JSON file:', file);
                    const JSONp = await jsonparser(data);
                    console.log(JSONp);
                });
            }
        });
    });
}

// Directory containing JSON files to test
const testDirectory = './test'; // Update this with your directory path
testJSONFiles(testDirectory);
*/

const res = async () => {
    await fs.readFile("./test/pass3.json", "utf8", async (err, data) => {
      if (err) {
        throw new Error("Error reading file:", err);
      }

      // Test the JSON data
      const JSONp = await jsonparser(data);
      console.log(JSONp);
    });
};

res();
