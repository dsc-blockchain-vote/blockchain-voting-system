"use strict";

const express = require("express");
const Web3 = require("web3");
const { abi, bytecode } = require("./compile");

const env = process.env.NODE_ENV;
const USERNAME = "node-1";
const PASSWORD = "node1";
const IP = "35.194.38.146";

// connection to geth node
const web3 = new Web3(
  "http://" + USERNAME + ":" + PASSWORD + "@" + IP + "/rpc"
);

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cors
const cors = require("cors");
if (env !== "production") {
  app.use(cors());
}

//middleware
const deploy = async (req, res, next) => {
  const {
    organizer_account,
    organizer_password,
    candidates,
    end_time,
    start_time,
  } = req.body;
  try {
    // should use firebase for checking an Organizer account exists
    const accounts = await web3.eth.getAccounts();
    for (i in accounts) {
      if (i !== organizer_account) {
        console.log("Organizer does not exist");
        // res.status(404).send("Organizer does not exist");
        return;
      }
    }
    await web3.eth.personal.unlockAccount(
      organizer_account,
      organizer_password,
      500
    );
    console.log("Account unlocked");

    const result = await new web3.eth.Contract(abi)
      .deploy({
        data: "0x" + bytecode,
        arguments: [candidates, end_time, start_time],
      })
      .send({ from: organizer_account });
    console.log("Deployed election at 0x" + result.options.address);

    await web3.eth.personal.lockAccount(organizer_account);
    console.log("Account locked");
  } catch (error) {
    console.log("Error");
    //res.status(400).send("Bad Request. Could not login user.");
  }
};

// start the express server

const app = express();

const port = process.env.PORT || 5000;
