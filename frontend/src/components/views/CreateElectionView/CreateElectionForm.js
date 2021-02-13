import React, { Component} from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Settings from "./Settings";
import Candidates from "./Candidates";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import firebaseDb from "../../../firebase";

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
            ]
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

    //changes the value stored in title and the candidates list on receiving an input
    handleInputChange = (e, id) => {
        if (e.target.id === 'title'){
            this.setState({title: e.target.value});
        } 
        else{
            const candidates = [...this.state.candidates];
            const index = candidates.map((c) => c.id).indexOf(id);
            candidates[index].name = e.target.value;
            this.setState({ candidates });
        } 
    };

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
        if (name === 'delete'){
            const candidates = this.state.candidates.filter((c) => c.id !== id);
            this.setState({ candidates });
        }
        else{
            const candidates = [...this.state.candidates];
            let newId = 0;
            if (candidates.length > 0) {
                newId = candidates[candidates.length - 1].id + 1;
            }
            candidates.push({ id: newId, name: "" });
            this.setState({ candidates });
        }
    }

    //stores the election details entered into a firebase database called 'election'
    createElection = () =>{
        const election = {
            title: this.state.title,
            startDate: this.state.start.toString(),
            endDate: this.state.end.toString(),
            candidates: this.state.candidates
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
                        end: this.state.end}) }/>
                </Grid>
                <Grid item xs={12}>
                    <Candidates {...({
                        addOrDelete: this.addOrDelete,
                        inputChange: this.handleInputChange,
                        candidates: this.state.candidates}) }/>
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

