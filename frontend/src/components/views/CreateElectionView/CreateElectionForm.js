import React, { Component} from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Settings from "./Settings";
import Candidates from "./Candidates";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import firebaseDb from "../../../firebase";

class CreateElectionForm extends Component{
    constructor(props) {
        super(props)
        this.state = {
            title: "",
            start: new Date(),
            end: new Date(),
            candidate1: '',
            candidate2: ''
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

    handleTitleChange = (e) => {
        this.setState({title: e.target.value});
    }

    handleStartChange = (day) => {
        this.setState({start: day});
    };

    handleEndChange = (day) => {
        this.setState({end: day})
    };

    handleCandidate1Change = e => {
        this.setState({candidate1: e.target.value});
    };

    handleCandidate2Change = e => {
        this.setState({candidate2: e.target.value});
    };

    createElection = () =>{
        const election = {
            title: this.state.title,
            startDate: this.state.start.toString(),
            endDate: this.state.end.toString(),
            candidates: [this.state.candidate1, this.state.candidate2]
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
                        titleChange: this.handleTitleChange, 
                        startChange: this.handleStartChange, 
                        endChange: this.handleEndChange, 
                        title: this.state.title, 
                        start: this.state.start, 
                        end: this.state.end}) }/>
                </Grid>
                <Grid item xs={12}>
                    <Candidates {...({
                        candidate1Change: this.handleCandidate1Change, 
                        candidate2Change: this.handleCandidate2Change,
                        candidate1: this.state.candidate1, 
                        candidate2: this.state.candidate2}) }/>
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

