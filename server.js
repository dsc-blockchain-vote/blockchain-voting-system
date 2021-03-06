"use strict";
require("dotenv").config();
const express = require("express");
const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { abi, bytecode } = require("./compile");

// load required environment variables
const env = process.env.NODE_ENV;
const mnemonic = process.env.MNEMONIC;
const URL = process.env.URL;

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

const electionStorage = {}; // TODO: use firebase
const electionAddress = []; // TODO use firebase

//helper functions
const voterData = async (voterAccount, address) => {
  const provider = new HDWalletProvider({
    mnemonic: mnemonic,
    providerOrUrl: URL,
    addressIndex: voterAccount,
    numberOfAddresses: 1,
  });
  const web3 = new Web3(provider);
  const contract = await new web3.eth.Contract(abi, address);
  const result = await contract.methods.voters(provider.getAddress(0)).call();
  provider.engine.stop();
  return result;
};

//middleware
const OrganizerContract = (req, res, next) => {
  const organizerAccount = req.body.organizerAccount;
  try {
    if (electionStorage.hasOwnProperty(organizerAccount)) {
      return next();
    } else {
      res.status(401).send("Election contract does not exist");
      return;
    }
  } catch (error) {
    res.status(501).send("Server error");
  }
};

// if the voter has voted then return the candidate id. If not then return false
// TODO verify voter has logged in
app.get("/voter/election/:electionID/", async (req, res) => {
  const { voterAccount } = req.body;
  try {
    const result = await voterData(
      voterAccount,
      electionAddress[req.params.electionID]
    );
    const response = { result: false };
    if (result.voted && result.validVoter) {
      response.result = result.votedFor;
    }
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(401).send("Bad request");
  }
});

// check voter eligibility
// TODO ensure that the voter is logged in
app.get("/voter/election/:electionID/verify", async (req, res) => {
  const { voterAccount } = req.body;
  try {
    const result = await voterData(
      voterAccount,
      electionAddress[req.params.electionID]
    );
    const response = { result: result.validVoter };
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(401).send("Bad request");
  }
});

// add eligible voters
// TODO ensure that organizer is logged in
app.post(
  "/organizer/election/:electionID/validate",
  OrganizerContract,
  async (req, res) => {
    const { organizerAccount, voterAccounts } = req.body;
    try {
      const provider = new HDWalletProvider({
        mnemonic: mnemonic,
        providerOrUrl: URL,
        addressIndex: organizerAccount,
        numberOfAddresses: 1,
      });
      const web3 = new Web3(provider);
      const contract = await new web3.eth.Contract(
        abi,
        electionAddress[req.params.electionID]
      );
      const result = {};
      for (let address of voterAccounts) {
        let voterProvider = new HDWalletProvider({
          mnemonic: mnemonic,
          providerOrUrl: URL,
          addressIndex: address,
          numberOfAddresses: 1,
        });
        await contract.methods
          .giveRightToVote(voterProvider.getAddress(0))
          .send({ from: provider.getAddress(0) })
          .then((result[address] = true));
        voterProvider.engine.stop();
      }
      provider.engine.stop();
      res.send(result);
    } catch (error) {
      console.log(error);
      res.status(401).send("Bad request");
    }
  }
);

// starting election endpoint
// TODO middleware to verify organizer account
app.post("/organizer/election/start", async (req, res) => {
  const { organizerAccount, candidates, endTime, startTime } = req.body;
  try {
    const provider = new HDWalletProvider({
      mnemonic: mnemonic,
      providerOrUrl: URL,
      addressIndex: organizerAccount,
      numberOfAddresses: 1,
    });
    const web3 = new Web3(provider);
    const contract = await new web3.eth.Contract(abi);
    const deployTx = await contract
      .deploy({
        data: "0x" + bytecode,
        arguments: [candidates, endTime, startTime],
      })
      .send({ from: provider.getAddress(0), gas: 3000000 });

    console.log("Deployed election at " + deployTx.options.address);
    electionAddress.push(deployTx.options.address);
    if (!electionStorage.hasOwnProperty(organizerAccount)) {
      electionStorage[organizerAccount] = [];
    }
    electionStorage[organizerAccount].push(
      electionAddress.indexOf(deployTx.options.address)
    );

    provider.engine.stop();

    res.send({
      contract_address: {
        electionID: electionAddress.indexOf(deployTx.options.address),
        electionAddress: deployTx.options.address,
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
