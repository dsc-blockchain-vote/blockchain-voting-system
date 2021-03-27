import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Settings from "./Settings";
import Candidates from "./Candidates";
import VotersList from "./VotersList";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import parseISO from "date-fns/parseISO";
import axios from "axios";
import Fade from "@material-ui/core/Fade/Fade";
import { CircularProgress } from "@material-ui/core";
import getUnixTime from "date-fns/getUnixTime";

const emailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

//creates the entire form for an  organisation to create an election
class ElectionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            start: new Date(),
            end: new Date(),
            candidates: [],
            voters: [],
            errors: {
                title: "",
                candidateName: [],
                voterID: [],
                email: [],
            },
        };
        if (this.props.edit) {
            this.loading = true;
        } else {
            this.loading = false;
        }
    }

    useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        divider: {
            marginTop: theme.spacing(3),
        },
    }));

    componentDidMount() {
        if (this.props.edit) {
            this.loading = true;
            this.getData();
            this.loading = false;
        }
    }

    //changes the value stored in title and the candidates list on receiving an input
    handleInputChange = (e, id) => {
        if (e.target.name === "title") {
            this.validation("title", e.target.value, id);
            this.setState({ title: e.target.value });
        } else if (e.target.name === "candidate") {
            this.validation("candidateName", e.target.value, id);
            const candidates = [...this.state.candidates];
            const index = candidates.map((c) => c.id).indexOf(id);
            candidates[index].name = e.target.value;
            this.setState({ candidates });
        } else {
            const voters = [...this.state.voters];
            const index = voters.map((v) => v.id).indexOf(id);
            if (e.target.name === "name") {
                this.validation("voterName", e.target.value, id);
                voters[index].name = e.target.value;
            }
            if (e.target.name === "voterID") {
                this.validation("voterID", e.target.value, id);
                voters[index].voterID = e.target.value;
            }
            if (e.target.name === "voterEmail") {
                this.validation("email", e.target.value, id);
                voters[index].email = e.target.value;
            }
            this.setState({ voters });
        }
    };

    //checks for the validity of each input value entered and stores appropriate error messages in the error state variable
    validation = (name, value, id) => {
        if (name === "title") {
            if (value.length === 0)
                this.state.errors.title = "Title should not be empty!";
            else if (!/^[a-zA-Z\s]+$/.test(value))
                this.state.errors.title =
                    "Title should only consist of alphabets and spaces!";
            else if (/^[a-zA-Z\s]+$/.test(value)) this.state.errors.title = "";
        } else if (name === "candidateName") {
            if (value.length === 0)
                this.state.errors.candidateName[id] =
                    "Candidate name should not be empty!";
            else if (!/^[a-zA-Z\s]+$/.test(value))
                this.state.errors.candidateName[id] =
                    "Candidate name should only consist of alphabets and spaces!";
            else if (/^[a-zA-Z\s]+$/.test(value))
                this.state.errors.candidateName[id] = "";
        } else if (name === "voterName") {
            if (value.length === 0)
                this.state.errors.voterName[id] =
                    "Voter name should not be empty!";
            else if (!/^[a-zA-Z\s]+$/.test(value))
                this.state.errors.voterName[id] =
                    "Voter name should only consist of alphabets and spaces!";
            else if (/^[a-zA-Z\s]+$/.test(value))
                this.state.errors.voterName[id] = "";
        } else if (name === "voterID") {
            if (!value)
                this.state.errors.voterID[id] = "Voter ID should not be empty";
            else if (!/^[0-9\b]+$/.test(value))
                this.state.errors.voterID[id] =
                    "Voter ID should only consist of numbers";
            else if (/^[0-9\b]+$/.test(value))
                this.state.errors.voterID[id] = "";
        } else if (name === "email") {
            this.state.errors.email[id] = emailRegex.test(value)
                ? ""
                : "Invalid email ID";
        }
    };

    //changes the value of the start date on receiving input
    handleStartChange = (day) => {
        this.setState({ start: day });
    };

    //changes the value of the end date on receiving input
    handleEndChange = (day) => {
        this.setState({ end: day });
    };

    // The add part assumes that the ids are in increasing order
    // TODO: Consider different method of storing candidate ID
    addOrDelete = (name, id) => {
        if (name === "deleteCandidate") {
            const candidates = this.state.candidates.filter((c) => c.id !== id);
            this.setState({ candidates });
        } else if (name === "deleteVoter") {
            const voters = this.state.voters.filter((v) => v.id !== id);
            this.setState({ voters });
        } else if (name === "addCandidate") {
            const candidates = [...this.state.candidates];
            let newId = 0;
            if (candidates.length > 0) {
                newId = candidates[candidates.length - 1].id + 1;
            }
            candidates.push({ id: newId, name: "" });
            this.setState({ candidates });
        } else if (name === "addVoter") {
            const voters = [...this.state.voters];
            let newId = 0;
            if (voters.length > 0) {
                newId = voters[voters.length - 1].id + 1;
            }
            voters.push({ id: newId, name: "", voterID: null, email: "" });
            this.setState({ voters });
        }
    };

    //send election data to server
    createElection = () => {
        console.log(this.state.errors.candidateName);
        if (
            this.state.errors.title === "" &&
            this.checkForErrors("candidate") === true &&
            this.checkForErrors("voterName") === true &&
            this.checkForErrors("voterID") === true &&
            this.checkForErrors("email") === true &&
            this.state.title &&
            this.state.start &&
            this.state.end &&
            this.checkForErrors("candidatesEmpty") === false
            // &&
            // this.checkForErrors("votersEmpty") === false
        ) {
            const election = {
                electionName: this.state.title,
                startTime: this.state.start.valueOf(),
                endTime: this.state.end.valueOf(),
                candidates: [],
                validVoters: [],
            };
            for (let c in this.state.candidates) {
                election.candidates.push(this.state.candidates[c].name);
            }
            for (let v in this.state.voters) {
                election.validVoters.push(this.state.voters[v].voterID);
            }
            axios({
                method: "post",
                url: "http://localhost:5000/api/election/create",
                data: election,
                withCredentials: true,
            })
                .then((response) => {
                    console.log("Created election");
                })
                .catch((error) => {
                    console.log(error);
                });
        } else
            alert(
                "Check the input fields again for any invalid or empty entry"
            );
    };
    editElection = () => {
        console.log(this.state.errors.candidateName);
        if (
            this.state.errors.title === "" &&
            this.checkForErrors("candidate") === true &&
            this.checkForErrors("voterName") === true &&
            this.checkForErrors("voterID") === true &&
            this.checkForErrors("email") === true &&
            this.state.title &&
            this.state.start &&
            this.state.end &&
            this.checkForErrors("candidatesEmpty") === false
            // &&
            // this.checkForErrors("votersEmpty") === false
        ) {
            const election = {
                electionName: this.state.title,
                startTime: this.state.start.valueOf(),
                endTime: this.state.end.valueOf(),
                candidates: [],
                validVoters: [],
            };
            for (let c in this.state.candidates) {
                election.candidates.push(this.state.candidates[c].name);
            }
            for (let v in this.state.voters) {
                election.validVoters.push(this.state.voters[v].voterID);
            }
            axios({
                method: "put",
                url: `http://localhost:5000/api/election/${this.props.id}/update`,
                data: election,
                withCredentials: true,
            })
                .then((response) => {
                    console.log("Saved election settings");
                })
                .catch((error) => {
                    console.log(error);
                });
        } else
            alert(
                "Check the input fields again for any invalid or empty entry"
            );
    };

    //checks if there are no errors or no empty fields
    checkForErrors = (name) => {
        if (name === "candidate") {
            for (var i = 0; i < this.state.errors.candidateName.length; i++) {
                if (this.state.errors.candidateName[i] != "") return false;
            }
            return true;
        }
        if (name === "voterName") {
            for (var i = 0; i < this.state.errors.voterName.length; i++) {
                if (this.state.errors.voterName[i] != "") return false;
            }
            return true;
        }
        if (name === "voterID") {
            for (var i = 0; i < this.state.errors.voterID.length; i++) {
                if (this.state.errors.voterID[i] != "") return false;
            }
            return true;
        }
        if (name === "email") {
            for (var i = 0; i < this.state.errors.email.length; i++) {
                if (this.state.errors.email[i] != "") return false;
            }
            return true;
        }
        if (name === "candidatesEmpty") {
            if (this.state.candidates.length === 0) return true;
            else {
                for (var i = 0; i < this.state.candidates.length; i++) {
                    if (
                        this.state.candidates[i].id === null ||
                        this.state.candidates[i].name === ""
                    )
                        return true;
                }
                return false;
            }
        } else if (name === "votersEmpty") {
            if (this.state.voters.length === 0) return true;
            else {
                for (var j = 0; j < this.state.voters.length; j++) {
                    if (
                        this.state.voters[j].id === null ||
                        this.state.voters[j].name === "" ||
                        this.state.voters[j].voterID === null ||
                        this.state.voters[j].email === ""
                    )
                        return true;
                }
                return false;
            }
        }
    };

    getData() {
        // if we are editing this page:
        if (this.props.edit) {
            const result = axios
                .get(`http://localhost:5000/api/election/${this.props.id}`, {
                    withCredentials: true,
                })
                .then((response) => {
                    const data = {};
                    // load data into state
                    data.title = response.data["electionName"];
                    data.start = parseISO(response.data["startTime"]);
                    data.end = parseISO(response.data["endTime"]);
                    // load candidates
                    const importCandidates = [];
                    if (response.data["candidates"]) {
                        for (
                            let i = 0;
                            i < response.data["candidates"].length;
                            i++
                        ) {
                            importCandidates.push({
                                id: i,
                                name: response.data["candidates"][i],
                            });
                        }
                    }
                    // load voters
                    const importVoters = [];
                    if (response.data["validVoters"]) {
                        for (
                            let i = 0;
                            i < response.data["validVoters"].length;
                            i++
                        ) {
                            importVoters.push({
                                id: i,
                                name: response.data["validVoters"][i],
                            });
                        }
                    }
                    data.candidates = importCandidates;
                    data.voters = importVoters;
                    this.setState(data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    render() {
        if (this.loading) {
            return (
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <CircularProgress />
                </div>
            );
        }
        let onClick = this.createElection;
        let text = "Create";
        if (this.props.edit) {
            onClick = this.editElection;
            text = "Save";
        }
        return (
            <Fade in={!this.loading}>
                <Container maxWidth="lg">
                    <Grid container justify="flex-end" spacing={3}>
                        <Grid item xs={12}>
                            <Settings
                                {...{
                                    startChange: this.handleStartChange,
                                    endChange: this.handleEndChange,
                                    inputChange: this.handleInputChange,
                                    title: this.state.title,
                                    start: this.state.start,
                                    end: this.state.end,
                                    errors: this.state.errors,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Candidates
                                {...{
                                    addOrDelete: this.addOrDelete,
                                    inputChange: this.handleInputChange,
                                    candidates: this.state.candidates,
                                    errors: this.state.errors,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <VotersList
                                {...{
                                    addOrDelete: this.addOrDelete,
                                    inputChange: this.handleInputChange,
                                    voters: this.state.voters,
                                    errors: this.state.errors,
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={onClick}
                            >
                                {text}
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </Fade>
        );
    }
}

export default ElectionForm;
