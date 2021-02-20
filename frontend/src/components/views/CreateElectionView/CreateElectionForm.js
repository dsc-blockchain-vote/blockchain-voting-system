import React, { Component} from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Settings from "./Settings";
import Candidates from "./Candidates";
import VotersList from "./VotersList";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import firebaseDb from "../../../firebase";

const emailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );

//creates the entire form for an individual or organisation to create an election
class CreateElectionForm extends Component{
    constructor(props) {
        super(props)
        this.state = {
            title: "",
            start: new Date(),
            end: new Date(),
            candidates: [
                { id: 1, name: "Name 1" },
                { id: 2, name: "Name 2" },
                { id: 3, name: "Name 3" },
            ],
            voters: [
                { id: 1, name: "Name 1", voterID: 123, email: 'abc@gmail.com' },
                { id: 2, name: "Name 2", voterID: 456, email: 'xyz@gmail.com' },
                { id: 3, name: "Name 3", voterID: 789, email: 'test@gmail.com' },
            ],
            errors: {
                title: '',
                candidateName: '',
                voterName: '',
                voterID: '',
                email: ''
            }
        }
    }
    
    useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        divider: {
            marginTop: theme.spacing(3),
        },
        error: {
            position: "relative",
            bottom: 0,
            color: "red",
            fontSize: 12
          }
    }));

    //changes the value stored in title and the candidates list on receiving an input
    handleInputChange = (e, id) => {
        if (e.target.id === 'title'){
            this.validation('title', e.target.value);
            this.setState({title: e.target.value});
        } 
        else if (e.target.id === 'candidate'){
            this.validation('candidateName', e.target.value);
            const candidates = [...this.state.candidates];
            const index = candidates.map((c) => c.id).indexOf(id);
            candidates[index].name = e.target.value;
            this.setState({ candidates });
        } 
        else if (e.target.id === 'voter'){
            const voters = [...this.state.voters];
            const index = voters.map((v) => v.id).indexOf(id);
            if (e.target.name === 'name'){
                this.validation('voterName', e.target.value);
                voters[index].name = e.target.value;
            }
            if (e.target.name === 'voterID'){
                this.validation('voterID', e.target.value);
                voters[index].voterID = e.target.value;
            }
            if (e.target.name === 'voterEmail'){
                this.validation('email', e.target.value);
                voters[index].email = e.target.value;
            }
            this.setState({ voters });
        }
    };

    //checks for the validity of each input value entered and stores appropriate error messages in the error state variable
    validation = (name, value) => {
        if (name === 'title'){
            if (value.length === 0)
                this.state.errors.title = 'Title should not be empty!';
            else if (!/^[a-zA-Z\s]+$/.test(value))
                this.state.errors.title = 'Title should only consist of alphabets and spaces!';
            else if (/^[a-zA-Z\s]+$/.test(value))
                this.state.errors.title = '';
        }
        else if (name === 'candidateName'){
            if (value.length === 0)
                this.state.errors.candidateName = 'Candidate name should not be empty!';
            else if (!/^[a-zA-Z\s]+$/.test(value))
                this.state.errors.candidateName = 'Candidate name should only consist of alphabets and spaces!';
            else if (/^[a-zA-Z\s]+$/.test(value))
                this.state.errors.candidateName = '';
        }
        else if (name === 'voterName'){
            if (value.length === 0)
                this.state.errors.voterName = 'Voter name should not be empty!';
            else if (!/^[a-zA-Z\s]+$/.test(value))
                this.state.errors.voterName = 'Voter name should only consist of alphabets and spaces!';
            else if (/^[a-zA-Z\s]+$/.test(value))
                this.state.errors.voterName = '';
        }
        else if (name === 'voterID'){
            if (!value)
                this.state.errors.voterID = 'Voter ID should not be empty';
            else if (!/^[0-9\b]+$/.test(value))
                this.state.errors.voterID = 'Voter ID should only consist of numbers';
            else if (/^[0-9\b]+$/.test(value))
                this.state.errors.voterID = '';
        }
        else if(name === 'email'){
            this.state.errors.email = (emailRegex.test(value))? '': 'Invalid email ID';
        }
    }

    //changes the value of the start date on receiving input
    handleStartChange = (day) => {
        this.setState({start: day});
    };

    //changes the value of the end date on receiving input
    handleEndChange = (day) => {
        this.setState({end: day})
    };

    // The add part assumes that the ids are in increasing order
    // TODO: Consider different method of storing candidate ID
    addOrDelete = (name, id) => {
        if (name === 'deleteCandidate'){
            const candidates = this.state.candidates.filter((c) => c.id !== id);
            this.setState({ candidates });
        }
        else if (name === 'deleteVoter'){
            const voters = this.state.voters.filter((v) => v.id !== id);
            this.setState({ voters });
        }
        else if (name === 'addCandidate'){
            const candidates = [...this.state.candidates];
            let newId = 0;
            if (candidates.length > 0) {
                newId = candidates[candidates.length - 1].id + 1;
            }
            candidates.push({ id: newId, name: "" });
            this.setState({ candidates });
        }
        else if (name === 'addVoter'){
            const voters = [...this.state.voters];
            let newId = 0;
            if (voters.length > 0) {
                newId = voters[voters.length - 1].id + 1;
            }
            voters.push({ id: newId, name: "", voterID: null, email: "" });
            this.setState({ voters });
        }
    }

    //stores the election details entered into a firebase database called 'election'
    createElection = () =>{
        const election = {
            title: this.state.title,
            startDate: this.state.start.toString(),
            endDate: this.state.end.toString(),
            candidates: this.state.candidates,
            voters: this.state.voters
        }
        firebaseDb.child('election').push(
            election,
            err => {
                if (err)
                    console.log(err)
            })
    }

    render() { 

        return (
            <Container maxWidth="lg" >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Settings {...({
                        startChange: this.handleStartChange, 
                        endChange: this.handleEndChange, 
                        inputChange: this.handleInputChange,
                        title: this.state.title, 
                        start: this.state.start, 
                        end: this.state.end,
                        errors: this.state.errors }) }/>
                </Grid>
                <Grid item xs={12}>
                    <Candidates {...({
                        addOrDelete: this.addOrDelete,
                        inputChange: this.handleInputChange,
                        candidates: this.state.candidates,
                        errors: this.state.errors }) }/>
                </Grid>
                <Grid item xs={12}>
                    <VotersList {...({
                        addOrDelete: this.addOrDelete,
                        inputChange: this.handleInputChange,
                        voters: this.state.voters,
                        errors: this.state.errors }) }/>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" size="large" onClick={this.createElection}>
                        Create
                    </Button>
                </Grid>
            </Grid>
        </Container>
        )
    };
}

export default CreateElectionForm;

