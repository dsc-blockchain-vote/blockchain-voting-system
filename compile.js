"use strict";

const solc = require("solc");
const fs = require("fs");
const linker = require("solc/linker");

const contract_names = fs.readdirSync("./smartcontracts");
const contract_code = {};
for (key in contract_names) {
  contract_code[key] = fs.readFileSync("./smartcontracts/" + key, "utf8");
}

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
function findImports(path) {
  for (i in contract_names) {
    if (i === path) return { contents: contract_code[i] };
  }
  return { error: "File not found" };
}
const output = JSON.parse(
  solc.compile(JSON.stringify(input), { import: findImports })
);

const contract_abi = {};
const contract_bytecode = {
  DataTypes: output.contracts["DataTypes.sol"]["DataTypes"].evm.bytecode.object,
};

for (i in contract_names) {
  let temp = output.contracts[i];
  for (j in temp) {
    contract_abi[j] = output.contracts[i][j].abi;
    if (j == "DataTypes") break;
    contract_bytecode[j] = output.contracts[i][j].evm.bytecode.object;
    contract_bytecode[j] = linker.linkBytecode(contract_bytecode[j], {
      DataTypes: contract_bytecode["DataTypes"],
    });
  }
}

exports.abi = contract_abi["Election"];
exports.bytecode = contract_bytecode["Election"];
