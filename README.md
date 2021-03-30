# dVote (Decentralized-Vote)

### Voter and electoral fraud are persistent problems endured by organisations of all types and sizes - from student governments to national governments. Examples of voter fraud are voting by impersonation and voting by ineligible voters. Electoral fraud can occur if election officials maliciously alter or remove ballots that are cast. In addition, the COVID-19 pandemic has made it difficult for elections to be held in person, but organisations are weary of moving elections online due to concerns of cyberattacks or data manipulation.

&nbsp;

### To solve this problem, we leverage the blockchain techonology which aims provides the necessary transparency and accountability in elections.

&nbsp;

### Read more about blockchain and how we leverage this technology in this report:

https://docs.google.com/document/d/13X7lTKtGclTqntdPTq1MLEUttlsnWYv8Z6xc_NbXSEs/edit?usp=sharing

&nbsp;

# Starting local frontend

Make sure you are in the `blockchain-voting-system` directory and run the following command

```console
$ cd frontend && npm install
```

After all the project dependencies have been installed run the following in the frontend directory

```console
$ npm start
```

The frontend will be accessible on `localhost:3000`

&nbsp;

# Starting local server

Make sure you are in the `blockchain-voting-system` directory and run the following command

```console
$ npm install
```

After all the project dependencies have been installed run the following

```console
$ npm start
```

The local server is listening on `localhost:5000`

To run just the server, refer to `API.md` on how to use the APIs using Postman or cURL  
Note that since the server interacts with a blockchain, certain actions can take more time to respond since they need to be mined on the blockchain first.

&nbsp;

# Connecting to our blockchain network

You can use clients like [Geth](https://geth.ethereum.org/docs/install-and-build/installing-geth) to connect to our blockchain network using:

`networkid: 392`  
Use can use any of the following bootnodes:

- `"enode://244c89873fba7ade0cc70084b1d225dd7ab7b3559fd7509cd270b7347fb09f85064b9c18b877c057f71351c19f2b780f61795763642f4f6a7928a7f850e6b8d3@104.154.251.135:30303"`
- `"enode://d7bd9a79d5abd38e66bf16d64f5fce1626fb09ebcd58b2db35acf4a238c6b937d76f6f539c5f35d1a1b2268a7faf40aaa98d58baaf99ea0c4a3c3ad5efc3d536@34.72.59.62:30303"`
- `"enode://f412d072de8d0577aed46c86d1674788f37b189d7033517e9298d1d9c85231f070c3e0bf01bf101f74f11eae314df7807f95002fe63bb31b19676c537e08d506@35.194.38.146:30303"`
