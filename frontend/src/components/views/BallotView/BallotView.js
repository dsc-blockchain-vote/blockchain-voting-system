import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Typography from "@material-ui/core/Typography";
import React, { Component, useState, useEffect } from "react";
import axios from "axios";

export default function BallotView(props) {

    const [id, setId] = useState(props.location.state.id);
    const [title, setTitle] = useState(id?props.location.state.election.electionName:"Election");
    const [otherEnabled, setOtherEnabled] = useState(true);
    let [candidates, setCandidates] = useState([]);
    let [voted, setVoted] = useState(false);
    let [votedFor, setVotedFor] = useState("");

    useEffect(() => {
        console.log(props.location.state.election)
        candidates = props.location.state.election.candidates.map((c, i) => {
            return {id: i, name: c}
        })
        setCandidates(candidates);
        axios.get(`http://localhost:5000/api/election/${id}`, {withCredentials: true})    
        .then(response => {
            console.log(response)
            voted = response.data.voted
            setVoted(voted)
            console.log(voted)
            votedFor = voted === true ? response.data.votedFor : "";
            setVotedFor(votedFor);
            console.log(votedFor)
        })
        .catch(error => {
            console.log(error);
          })
    }, []);

    const submitForm = (event, value) => {
        event.preventDefault();
        console.log({id, value})
        axios.put(`http://localhost:5000/api/election/${id}/vote`, {"candidateID": value}, {withCredentials: true})
            .then(response => {
                event.preventDefault();
                console.log(value);
                alert(`Voted successfully for Candidate 
                ${props.location.state.election.candidates[parseInt(votedFor)]} with transaction hash
                ${response.data.transactionHash}. Take a screenshot of this or save this transaction
                hash safely somewhere, since you won't be able to view this hash again!`)
            })
            .catch(error => {
              console.log(error);
            }) 
    };
 
    return (
        <Container maxWidth="lg">
            <Paper>
                <Box p={3} pt={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h5">
                                {title}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <BallotList
                                submitForm={(e, val) => {submitForm(e, val)} }

                                candidates={candidates}
                                other={otherEnabled}
                                vote= {votedFor}
                                name={props.location.state.election.candidates[parseInt(votedFor)]}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
        );
    }

function BallotList(props) {
    const [value, setValue] = useState("")
    const [disabled, setDisabled] = useState(true)

    const onChange = (e) => {
        console.log(e.target.value)
        setValue(e.target.value );
        setDisabled(false);
    }
    if (props.vote === ""){
        return (
            <form onSubmit={(e) => props.submitForm(e, value)}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">List of candidates</FormLabel>
                        <RadioGroup
                            aria-label="ballot"
                            value={value}
                            onChange={(e) => onChange(e)}
                        >
                        {props.candidates.map((c) => {
                            return (
                                <FormControlLabel
                                    key={c.id}
                                    value={c.id.toString()}
                                    control={<Radio />}
                                    label={c.name}
                                />
                            );
                        })}
                        </RadioGroup>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={disabled}
                        >
                            Cast Ballot
                        </Button>
                </FormControl>
            </form>
            );
    }
    else {
        return (
            <div>
                <Typography variant="h5">You have already voted for Candidate {props.name}</Typography>
            </div>
        );
    }
}

