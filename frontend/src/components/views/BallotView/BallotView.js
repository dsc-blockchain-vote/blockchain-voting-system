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

    const [id, setId] = useState(props.match.params.id);
    const [title, setTitle] = useState(id?`Election ${id}`:"Election");
    const [otherEnabled, setOtherEnabled] = useState(true);
    const [candidates, setCandidates] = useState([]);
    var [vote, setVote] = useState(null);

     useEffect(() => {
        axios.get(`http://localhost:5000/${id}`)    
        .then(response => {
            setCandidates(response.data.candidates);
        })
        .catch(error => {
            console.log(error);
          })
        checkVoted();
    }, []);

    const checkVoted = () => {
        axios.get(`http://localhost:5000//voter/election/${id}/`)
        .then(response => {
            setVote(response.data.result);
        })    
    }

    const submitForm = (event, value) => {
        event.preventDefault();
        console.log({id, value})
        axios.post(`http://localhost:5000/voter/elections/${id}/vote`, value)
            .then(response => {
                event.preventDefault();
                console.log(value);
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
                                vote= {vote != false? vote:""}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
        );
    }

class BallotList extends Component {
    state = {
        value: this.props.vote,
        disabled: true,
    };

    onChange(e) {
        this.setState({ value: e.target.value });
        this.setState({ disabled: false });
    }

    render() {
        return (
            <form onSubmit={(e) => this.props.submitForm(e, this.state.value)}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">List of candidates</FormLabel>
                    <RadioGroup
                        aria-label="ballot"
                        value={this.state.value}
                        onChange={(e) => this.onChange(e)}
                    >
                        {this.props.candidates.map((c) => {
                            return (
                                <FormControlLabel
                                    key={c.id}
                                    value={c.id}
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
                        disabled={this.state.disabled}
                    >
                        Cast Ballot
                    </Button>
                </FormControl>
            </form>
        );
    }
}

