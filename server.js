"use strict";
require("dotenv").config();
const express = require("express");
const csrf = require("csrf");
const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");
const { abi, bytecode } = require("./compile");
const db = admin.database();

// initialize firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://blockchain-try1-default-rtdb.firebaseio.com",
});

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
const csrfMiddleWare = csrf({ cookie: true });
app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken);
  next();
});

// verify the user has logged in
const verifyUser = (res, req, next) => {
  const sessionCookie = req.cookies.session || "";
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then((decodedClaims) => {
      if (decodedClaims.isOrganizer === true) {
        req.isOrganizer = true;
      } else {
        req.isOrganizer = false;
      }
      req.userID = decodedClaims.uid;
      next();
    })
    .catch((error) => {
      res.redirect("/login");
    });
};

// if organizer account is making a request, send all election data
// if user account is making request, send the candidate id they voted for
// or send false if they haven't voted or are not valid voters
app.get("/api/election/:electionID", verifyUser, async (req, res) => {
  const { userID, isOrganizer } = req.body;
  try {
    
    if (isOrganizer){
      const electionRef = db.ref("elections/" + req.params.electionID);
      let electionData = null;
      electionRef.on("value", (snapshot) => {
        if (snapshot.val().organizerID === userID){
          electionData = snapshot.val();
        }
      });
      if (electionData === null){
        res.status(400).send("bad request");
        return;
      }
      res.send(electionData);
    }
    else{
      const userRef = db.ref("users/" + userID);
      let voterAccount = null;
      userRef.on("value", (snapshot) => {
        voterAccount = snapshot.val().account;
      });
      if(voterAccount === null){
        res.status(400).send("bad request");
        return;
      }
      const result = await voterData(
        voterAccount,
        req.params.electionID
      );
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
  const { voterAccount, userID, isOrganizer } = req.body;
  try {
    let electionData = {};
    const electionRef = db.ref("elections/");
    electionRef.on("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        data = childSnapshot.val();
        electionData[data.electionID] = data;
      });     
    });
    if (isOrganizer){
      let organizerElectionData = {};
      for (let id in electionData){
        if (electionData[id].organizerID === userID){
          organizerElectionData[id] = electionData[id];
        }
      }
      res.send(organizerElectionData);
    }
    else{
      let voterElectionData = {};
      for (let id in electionData){
        let result = await voterData(
          voterAccount,
          electionAddress[req.params.electionID]
        );
        if (result.validVoter){
          voterElectionData[id] = {
            candidates: electionData[id].candidates,
            startTime: electionData[id].startTime,
            endTime: electionData[id].endTime,
            electionName: electionData[id].name,
            organizerName: electionData[id].organizerName
          };
        }
      }
      res.send(response);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

// casting vote
app.post("/api/election/:electionID/vote", verifyUser, async (req, res) => {
  if (req.isOrganizer){
    res.status(400).send("bad request");
    return;
  }
  const { candidateID, userID } = req.body;
  try {
    const voterRef = db.ref("users/" + userID);
    let voterAccount = null;
    voterRef.on("value", (snapshot) => {
      voterAccount = snapshot.val().account;
    });
    const electionRef = db.ref("elections/" + req.params.electionID);
    let electionAddress = null;
    electionRef.on("value", (snapshot) => {
      electionAddress = snapshot.val().address;
    });
    if (voterAccount === null || electionAddress === null){
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
    const contract = await new web3.eth.Contract(
      abi,
      electionAddress
    );
    await contract.methods
      .vote(candidateID)
      .send({ from: provider.getAddress(0) });
    const result = await contract.methods.candidates(candidateID).call();
    console.log(result);
    res.send("Voted casted");
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
  if (!req.isOrganizer) {
    res.status(400).send("bad request");
    return;
  }
  const { userID, electionID } = req.body;
  try {
    const userRef = db.ref("users/" + userID);
    let organizerAccount = null;
    userRef.on("value", (snapshot) => {
      organizerAccount = snapshot.val().organizerAccount;
    });
    const electionRef = db.ref("elections/" + electionID);
    let electionData = {};
    electionRef.on("value", (snapshot) => {
      const data = snapshot.val();
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
    });
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

    electionRef.update({
      address: deployTx.options.address,
    });

    console.log("Deployed election at " + deployTx.options.address);

    for (let id in electionData.validVoter) {
      let voterRef = db.ref("users/" + id);
      voterRef.on("value", (snapshot) => {
        const voterAccount = snapshot.value().account;
        let voterProvider = new HDWalletProvider({
          mnemonic: mnemonic,
          providerOrUrl: URL,
          addressIndex: voterAccount,
          numberOfAddresses: 1,
        });
        await contract.methods
          .giveRightToVote(voterProvider.getAddress(0))
          .send({ from: provider.getAddress(0) })
        voterProvider.engine.stop();
      });
    }

    provider.engine.stop();

    res.send({
      contract_address: {
        electionID: electionAddress.indexOf(deployTx.options.address),
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
        res.end(JSON.stringify({ status: Success }));
      },
      (error) => {
        res.status(401).send("unauthorized");
      }
    );
});

// logout endpoint
app.get("/api/logout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/api/login");
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

    // TODO blockchain account generation
    const ref = db.ref("users");
    const currUser = ref.child(userRecord.uid);
    const newUser = { name: name, email: email, account: 0 };
    await currUser.update(newUser);

    res.status(200).send("User successfully registerd");
    res.redirect("/api/login");
  } catch (error) {
    res.status(400).send("Bad request");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
