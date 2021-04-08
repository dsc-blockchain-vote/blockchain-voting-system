"use strict";

const solc = require("solc");
const fs = require("fs");

// getting all contract names
const contract_names = fs.readdirSync(__dirname + "/smart-contracts");

// reading all contracts and storing the code as string
const contract_code = {};
for (const key in contract_names) {
  contract_code[contract_names[key]] = {
    content: fs.readFileSync(
      __dirname + "/smart-contracts/" + contract_names[key],
      "utf8"
    ),
  };
}

// creating input object for compiler
const input = {
  language: "Solidity",
  sources: {
    ...contract_code,
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

// import function to link the required import statements with the actual code
function findImports(path) {
  for (const i in contract_names) {
    if (i === path) return { contents: contract_code[i] };
  }
  return { error: "File not found" };
}

// compiling all the contracts
const output = JSON.parse(
  solc.compile(JSON.stringify(input), { import: findImports })
);

// exporting the abi and bin of Election.sol
exports.abi = output.contracts["Election.sol"]["Election"].abi;
exports.bytecode =
  output.contracts["Election.sol"]["Election"].evm.bytecode.object;
