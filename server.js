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
//app.use(csrfMiddleWare);

// cors
const cors = require("cors");
if (env !== "production") {
  app.use(cors());
}

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

//middlewares

// verify session tokens to protect against cross site forgery
// app.all("*", (req, res, next) => {
//   req.cookie("XSRF-TOKEN", req.csrfToken());
//   next();
// });

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
    const ref = db.ref("elections");
    const newElection = await ref.push({
      candidates: candidates,
      startTime: startTime,
      endTime: endTime,
      validVoters: validVoters,
      electionName: electionName,
      organizerID: userID,
    });
    const electionID = newElection.key;
    res.send({ electionID: electionID });
  } catch (error) {
    console.log(error);
    res.status(400).send("bad request");
  }
});

// if organizer account is making a request, send all election data
// if user account is making request, send the candidate id they voted for
// or send false if they haven't voted or are not valid voters
app.get("/api/election/:electionID", verifyUser, async (req, res) => {
  const { userID, isOrganizer } = req.body;
  try {
    if (isOrganizer) {
      const electionRef = db.ref("elections/" + req.params.electionID);
      const snapshot = await electionRef.once("value");
      let electionData = null;
      if (snapshot.val().organizerID === userID) {
        electionData = snapshot.val();
      }
      if (electionData === null) {
        res.status(400).send("bad request");
        return;
      }
      res.send(electionData);
    } else {
      const userRef = db.ref("users/" + userID);
      const snapshot = await userRef.once("value");
      let voterAccount = snapshot.val().account;
      if (voterAccount === null) {
        res.status(400).send("bad request");
        return;
      }
      const result = await voterData(voterAccount, req.params.electionID);
      const response = { result: false };
      if (result.voted && result.validVoter) {
        response.result = result.votedFor;
      }
      res.send(response);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
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
        if (childSnapshot.val().organizerID === userID) {
          organizerElectionData[childSnapshot.key] = childSnapshot.val();
        }
      });
      res.send(organizerElectionData);
    } else {
      const voterRef = db.ref("users/" + userID);
      const voterSnapshot = await voterRef.once("value");
      let voterAccount = voterSnapshot.val().account;
      if (voterAccount === null) {
        res.status(400).send("bad request");
        return;
      }
      let voterElectionData = {};
      snapshot.forEach(async (childSnapshot) => {
        if (childSnapshot.child("address").exists) {
          let data = childSnapshot.val();
          let result = await voterData(voterAccount, data.address);
          if (result.validVoter) {
            voterElectionData[childSnapshot.key] = {
              candidates: data.candidates,
              startTime: data.startTime,
              endTime: data.endTime,
              electionName: data.name,
              organizerName: data.organizerName,
            };
          }
        }
      });
      res.send(voterElectionData);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

// casting vote
app.post("/api/election/:electionID/vote", verifyUser, async (req, res) => {
  if (req.body.isOrganizer) {
    res.status(400).send("bad request");
    return;
  }
  const { candidateID, userID } = req.body;
  try {
    const voterRef = db.ref("users/" + userID);
    let snapshot = await voterRef.once("value");
    let voterAccount = snapshot.val().account;
    const electionRef = db.ref("elections/" + req.params.electionID);
    snapshot = await electionRef.once("value");
    let electionAddress = snapshot.val().address;
    if (voterAccount === null || electionAddress === null) {
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
    const contract = await new web3.eth.Contract(abi, electionAddress);
    const voteTx = await contract.methods
      .vote(candidateID)
      .send({ from: provider.getAddress(0) });

    res.send({ "transaction hash": voteTx.transactionHash });
    provider.engine.stop();
  } catch (error) {
    let response = "Bad request";
    const msg = error.message;
    if (msg.includes("Has no right to vote")) {
      response = "Not a valid voter";
    } else if (msg.includes("Already voted")) {
      response = "Vote has already been cast";
    }
    res.status(400).send(response);
  }
});

// starting election endpoint
app.post("/api/election/start", verifyUser, async (req, res) => {
  if (!req.body.isOrganizer) {
    res.status(400).send("bad request");
    return;
  }
  const { userID, electionID } = req.body;
  try {
    const userRef = db.ref("users/" + userID);
    let organizerAccount = null;
    userRef.once("value").then((snapshot) => {
      organizerAccount = snapshot.val().account;
    });
    const electionRef = db.ref("elections/" + electionID);
    let electionData = {};
    const snapshot = await electionRef.once("value");
    const data = snapshot.val();
    if (snapshot.child("address").exists()) {
      res.status(400).send("election already deployed");
      return;
    }
    if (
      data.organizerID === userID &&
      snapshot.child("candidates").exists() &&
      snapshot.child("endTime").exists() &&
      snapshot.child("startTime").exists() &&
      snapshot.child("validVoters").exists() &&
      !snapshot.child("address").exists()
    ) {
      electionData.candidates = data.candidates;
      electionData.endTime = data.endTime;
      electionData.startTime = data.startTime;
      electionData.validVoters = data.validVoters;
    }
    if (organizerAccount === null || electionData === {}) {
      res.status(400).send("Bad request");
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

    await electionRef.update({
      address: deployTx.options.address,
    });
    const validVoters = electionData.validVoters;
    const deployedContract = await new web3.eth.Contract(
      abi,
      deployTx.options.address
    );
    for (let id in validVoters) {
      let voterRef = db.ref("users/" + validVoters[id]);
      const snapshot = await voterRef.once("value");
      let voterProvider = new HDWalletProvider({
        mnemonic: mnemonic,
        providerOrUrl: URL,
        addressIndex: snapshot.val().account,
        numberOfAddresses: 1,
      });
      await deployedContract.methods
        .giveRightToVote(voterProvider.getAddress(0))
        .send({ from: provider.getAddress(0) });
      voterProvider.engine.stop();
    }

    provider.engine.stop();

    res.send({
      contract_address: {
        electionID: electionID,
        electionAddress: deployTx.options.address,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("bad request");
  }
});

// login end point
app.post("/api/login", async (req, res) => {
  const idToken = req.body.idToken.toString();
  const expiresIn = 30 * 60 * 1000; // session cookie expires in 30 minutes
  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "Success" }));
      },
      (error) => {
        res.status(401).send("unauthorized");
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
    let acc = 0;
    accRef.on("value", (snapshot) => {
      if (snapshot.val() !== null) {
        acc = snapshot.val().account + 1;
      }
    });
    const ref = db.ref("users");
    const currUser = ref.child(userRecord.uid);
    const newUser = { name: name, email: email, account: acc };
    await currUser.update(newUser);
    await accRef.set({ account: acc });

    res.status(200).send("User successfully registerd");
    //res.redirect("/api/login");
  } catch (error) {
    //console.log(error);
    res.status(400).send("Bad request");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
