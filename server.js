"use strict";
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const csrf = require("csurf");
const Web3 = require("web3");
const cookieParser = require("cookie-parser");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");
const { abi, bytecode } = require("./compile");
const csrfMiddleWare = csrf({ cookie: true });

// load required environment variables
const env = process.env.NODE_ENV;
const mnemonic = process.env.MNEMONIC;
const URL = process.env.URL;
const databaseURL = process.env.DATABASE;

// initialize firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL,
});

// get database
const db = admin.database();

// start the express server
const app = express();
const port = process.env.PORT || 5000;

// use body-parser, cookieParser and csrfMiddlewares for all end points
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// cors
const cors = require("cors");
if (env !== "production") {
  app.use(cors());
}

//helper functions
// get voter data from blockchain
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

// get user account corresponding to the userID or return null
const userAccount = async (userID) => {
  const userRef = db.ref("users/" + userID);
  const snapshot = await userRef.once("value");
  if (snapshot.val() === null) {
    return null;
  }
  return snapshot.val().account;
};

// get election data corresponding to the given election
const getElectionData = async (electionID, isOrganizer) => {
  const electionRef = db.ref("elections/" + electionID);
  const snapshot = await electionRef.once("value");
  const data = snapshot.val();
  if (data === null) {
    return null;
  }
  if (isOrganizer) {
    return data;
  } else {
    let temp = {
      candidates: data.candidates,
      endTime: epochToHuman(data.endTime),
      startTime: epochToHuman(data.startTime),
      electionName: data.electionName,
      organizerName: data.organizerName,
    };
    if (data.hasOwnProperty("address")) {
      temp.address = data.address;
    }
    return temp;
  }
};

// validate the given list of voter ids for the given contract address
// return a list of voter IDs that were invalid
const validateVoters = async (
  validVoters,
  contractAddress,
  organizerAccount
) => {
  const provider = new HDWalletProvider({
    mnemonic: mnemonic,
    providerOrUrl: URL,
    addressIndex: organizerAccount,
    numberOfAddresses: 1,
  });
  const web3 = new Web3(provider);
  const deployedContract = await new web3.eth.Contract(abi, contractAddress);
  let invalidVoterIDs = [];
  for (let id in validVoters) {
    let voterAccount = await userAccount(validVoters[id]);
    if (voterAccount === null) {
      invalidVoterIDs.push(id);
      continue;
    }
    let voterProvider = new HDWalletProvider({
      mnemonic: mnemonic,
      providerOrUrl: URL,
      addressIndex: voterAccount,
      numberOfAddresses: 1,
    });
    await deployedContract.methods
      .giveRightToVote(voterProvider.getAddress(0))
      .send({ from: provider.getAddress(0) });
    voterProvider.engine.stop();
  }
  provider.engine.stop();
  return invalidVoterIDs;
};

//convert human readable date and time to epoch time
const humanToEpoch = (date) => {
  let dateObj = new Date(date);
  return dateObj.getTime() / 1000;
};

// convert epoch time to human readable date and time
const epochToHuman = (epoch) => {
  let dateObj = new Date(epoch * 1000);
  return dateObj.toISOString();
};

//middlewares

// verify the user has logged in
const verifyUser = (req, res, next) => {
  const sessionCookie = req.cookies.session || "";
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then((decodedClaims) => {
      if (decodedClaims.isOrganizer === true) {
        req.body.isOrganizer = true;
      } else {
        req.body.isOrganizer = false;
      }
      req.body.userID = decodedClaims.uid;
      next();
    })
    .catch((error) => {
      res.clearCookie("session");
      res.status(401).send("Unauthorized");
    });
};

// to create a new election which hasn't been launched.
// stores the required data in database and generates a unique ID for this election
app.post("/api/election/create", verifyUser, async (req, res) => {
  if (!req.body.isOrganizer) {
    res.status(401).send("Unauthorized");
    return;
  }
  const {
    candidates,
    startTime,
    endTime,
    validVoters,
    electionName,
    userID,
  } = req.body;
  try {
    const userRef = db.ref("users/" + userID);
    const snapshot = await userRef.once("value");
    const organizerName = snapshot.val().name;
    const ref = db.ref("elections");
    const newElection = await ref.push({
      candidates: candidates,
      startTime: humanToEpoch(startTime),
      endTime: humanToEpoch(endTime),
      validVoters: validVoters,
      electionName: electionName,
      organizerName: organizerName,
      organizerID: userID,
    });
    const electionID = newElection.key;
    res.send({ electionID: electionID });
  } catch (error) {
    res.status(400).send("bad request");
  }
});

// if organizer account is making a request, send all election data
// if user account is making request, send the candidate id they voted for
// or send false if they haven't voted or are not valid voters
app.get("/api/election/:electionID", verifyUser, async (req, res) => {
  const { userID, isOrganizer } = req.body;
  try {
    let electionData = await getElectionData(
      req.params.electionID,
      isOrganizer
    );
    if (isOrganizer) {
      if (electionData.organizerID === userID) {
        electionData.endTime = epochToHuman(electionData.endTime);
        electionData.startTime = epochToHuman(electionData.startTime);
        res.send(electionData);
      } else {
        res.status(400).send("bad request");
      }
    } else {
      let voterAccount = await userAccount(userID);
      if (voterAccount === null || !electionData.hasOwnProperty("address")) {
        res.status(400).send("bad request");
        return;
      }
      const result = await voterData(voterAccount, electionData.address);
      const response = { voted: false, ...electionData };
      if (result.voted && result.validVoter) {
        response.voted = true;
        response.votedFor = result.votedFor;
      }
      res.send(response);
    }
  } catch (error) {
    res.status(400).send("bad request");
  }
});

// return all elections
// if user is organizer, return all data of the elections owned by organizer
// if user is voter, return all elections for which the user is eligible. Data for each election
// returned here contains everything except list of voters
app.get("/api/election/", verifyUser, async (req, res) => {
  const { userID, isOrganizer } = req.body;
  try {
    const electionRef = db.ref("elections");
    const snapshot = await electionRef.once("value");

    if (isOrganizer) {
      let organizerElectionData = {};
      snapshot.forEach((childSnapshot) => {
        let temp = childSnapshot.val();
        if (temp.organizerID === userID) {
          temp.endTime = epochToHuman(temp.endTime);
          temp.startTime = epochToHuman(temp.startTime);
          organizerElectionData[childSnapshot.key] = temp;
        }
      });
      res.send(organizerElectionData);
    } else {
      let currDate = new Date(new Date().toISOString()).getTime();
      let voterAccount = await userAccount(userID);
      if (voterAccount === null) {
        res.status(400).send("bad request");
        return;
      }
      let voterElectionData = { Upcoming: {}, Previous: {}, Ongoing: {} };
      let data = snapshot.val();
      for (let key in data) {
        if (data[key].hasOwnProperty("address")) {
          let temp = await getElectionData(key, isOrganizer);
          let result = await voterData(voterAccount, temp.address);
          let startTime = new Date(temp.startTime).getTime();
          let endTime = new Date(temp.endTime).getTime();
          if (result.validVoter) {
            if (currDate < startTime) {
              voterElectionData["Upcoming"][key] = temp;
            } else if (currDate >= endTime) {
              voterElectionData["Previous"][key] = temp;
            } else {
              voterElectionData["Ongoing"][key] = temp;
            }
          }
        }
      }
      res.send(voterElectionData);
    }
  } catch (error) {
    res.status(400).send("bad request");
  }
});

// casting vote
app.put("/api/election/:electionID/vote", verifyUser, async (req, res) => {
  const { candidateID, userID, isOrganizer } = req.body;
  try {
    if (isOrganizer) {
      res.status(401).send("Unauthorized");
      return;
    }
    let voterAccount = await userAccount(userID);
    let electionDetails = await getElectionData(
      req.params.electionID,
      isOrganizer
    );
    if (voterAccount === null || electionDetails === null) {
      res.status(400).send("bad request");
      return;
    }
    const provider = new HDWalletProvider({
      mnemonic: mnemonic,
      providerOrUrl: URL,
      addressIndex: voterAccount,
      numberOfAddresses: 1,
    });
    const web3 = new Web3(provider);
    const contract = await new web3.eth.Contract(abi, electionDetails.address);
    const voteTx = await contract.methods
      .vote(candidateID)
      .send({ from: provider.getAddress(0) });

    res.send({ "transaction hash": voteTx.transactionHash });
    provider.engine.stop();
  } catch (error) {
    let response = "bad request";
    const msg = error.message;
    if (msg.includes("Has no right to vote")) {
      response = "Not a valid voter";
    } else if (msg.includes("Already voted")) {
      response = "Vote has already been cast";
    }
    res.status(400).send(response);
  }
});

//validate voters endpoint
app.put("/api/election/:electionID/validate", verifyUser, async (req, res) => {
  const { userID, isOrganizer, validVoters } = req.body;
  try {
    const electionID = req.params.electionID;
    if (!isOrganizer) {
      res.status(401).send("Unauthorized");
      return;
    }
    let electionDetails = await getElectionData(electionID, isOrganizer);
    const organizerAccount = await userAccount(userID);
    const invalidVoterIDs = await validateVoters(
      validVoters,
      electionDetails.address,
      organizerAccount
    );
    for (let i in validVoters) {
      electionDetails.validVoters.push(validVoters[i]);
    }
    const electionRef = db.ref("elections/" + electionID);
    await electionRef.update({ validVoters: electionDetails.validVoters });
    res.send({ invalidVoterIDs: invalidVoterIDs });
  } catch (error) {
    res.status(400).send("bad request");
  }
});

// starting election endpoint
app.put("/api/election/:electionID/deploy", verifyUser, async (req, res) => {
  const { userID, isOrganizer } = req.body;
  try {
    const electionID = req.params.electionID;
    if (!isOrganizer) {
      res.status(401).send("Unauthorized");
      return;
    }
    let organizerAccount = await userAccount(userID);
    const allElectionData = await getElectionData(electionID, isOrganizer);
    let electionData = {};
    if (allElectionData.hasOwnProperty("address")) {
      res.status(206).send({ electionAddress: allElectionData.address });
      return;
    }
    if (
      allElectionData.organizerID === userID &&
      allElectionData.hasOwnProperty("candidates") &&
      allElectionData.hasOwnProperty("endTime") &&
      allElectionData.hasOwnProperty("startTime") &&
      allElectionData.hasOwnProperty("validVoters")
    ) {
      electionData.candidates = allElectionData.candidates;
      electionData.endTime = allElectionData.endTime;
      electionData.startTime = allElectionData.startTime;
      electionData.validVoters = allElectionData.validVoters;
    }
    if (organizerAccount === null || electionData === {}) {
      res.status(400).send("bad request");
      return;
    }
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
        arguments: [
          electionData.candidates,
          electionData.endTime,
          electionData.startTime,
        ],
      })
      .send({ from: provider.getAddress(0), gas: 3000000 });

    const electionRef = db.ref("elections/" + electionID);
    await electionRef.update({
      address: deployTx.options.address,
    });

    let invalidVoterIDs = await validateVoters(
      electionData.validVoters,
      deployTx.options.address,
      organizerAccount
    );

    provider.engine.stop();

    res.send({
      electionID: electionID,
      electionAddress: deployTx.options.address,
      invalidVoterIDs: invalidVoterIDs,
    });
  } catch (error) {
    res.status(400).send("bad request");
  }
});

// login end point
app.post("/api/login", async (req, res) => {
  const idToken = req.body.idToken.toString();
  const expiresIn = 59 * 60 * 1000; // session cookie expires in 59 minutes
  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end("Success");
      },
      (error) => {
        res.status(401);
        if (error.hasOwnProperty("message")) {
          res.send(error.message);
        }
        res.send("Unauthorized");
      }
    );
});

// logout endpoint
app.get("/api/logout", (req, res) => {
  res.clearCookie("session");
});

// register endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, isOrganizer } = req.body;
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });
    await admin
      .auth()
      .setCustomUserClaims(userRecord.uid, { isOrganizer: isOrganizer });

    const accRef = db.ref("accounts");
    let acc = 10;
    const snapshot = await accRef.once("value");
    if (snapshot.val() !== null) {
      acc = snapshot.val().account + 1;
    }
    const ref = db.ref("users");
    const currUser = ref.child(userRecord.uid);
    const newUser = { name: name, email: email, account: acc };
    await currUser.update(newUser);
    await accRef.set({ account: acc });

    res.send("User successfully registered");
  } catch (error) {
    res.status(400);
    if (error.hasOwnProperty("message")) {
      res.send(error.message);
    } else {
      res.send("bad request");
    }
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
