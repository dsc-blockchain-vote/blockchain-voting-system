"use strict";
require("dotenv").config();
const express = require("express");
const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { abi, bytecode } = require("./compile");

const env = process.env.NODE_ENV;
// secrets
const mnemonic = process.env.MNEMONIC;
const URL = process.env.URL;

// account generation

// start the express server
const app = express();
const port = process.env.PORT || 5000;

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cors
const cors = require("cors");
if (env !== "production") {
  app.use(cors());
}

const election_storage = {}; // TODO: use firebase

//middleware
const organizerContract = (req, res, next) => {
  const organizer_account = req.body.organizer_account;
  try {
    if (election_storage.hasOwnProperty(organizer_account)) {
      return next();
    } else {
      res.status(401).send("Election contract does not exist");
      return;
    }
  } catch (error) {
    res.status(501).send("Server error");
  }
};

// add eligible voters
app.post("/election/validate", organizerContract, async (req, res) => {
  const { organizer_account, voter_accounts } = req.body;
  try {
    const provider = new HDWalletProvider(mnemonic, URL, organizer_account);
    const web3 = new Web3(provider);
    const contract = await new web3.eth.Contract(
      abi,
      election_storage[organizer_account]
    );

    for (let address of voter_accounts) {
      await contract.methods
        .giveRightToVote(provider.getAddress(address))
        .send({ from: provider.getAddress(organizer_account) });
    }
    res.send("successfully added all voters");
  } catch (error) {
    console.log(error);
    res.status(401).send("Bad request");
  }
});

// starting election endpoint
// TODO middleware to verify organizer account
app.post("/election/start", async (req, res) => {
  const { organizer_account, candidates, end_time, start_time } = req.body;
  try {
    if (!election_storage.hasOwnProperty(organizer_account)) {
      const provider = new HDWalletProvider(mnemonic, URL, organizer_account);
      const web3 = new Web3(provider);

      console.log(provider.getAddress(organizer_account));

      const contract = await new web3.eth.Contract(abi);
      const deployTx = await contract
        .deploy({
          data: "0x" + bytecode,
          arguments: [candidates, end_time, start_time],
        })
        .send({ from: provider.getAddress(organizer_account), gas: 3000000 });

      console.log("Deployed election at " + deployTx.options.address);
      election_storage[organizer_account] = deployTx.options.address;
      provider.engine.stop();
    }
    res.send({
      contract_address: {
        organizer_account: election_storage[organizer_account],
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Invalid request");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
