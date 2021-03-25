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
import firebaseDb from "../../../firebase";
import React, { Component, useState, useEffect } from "react";

export default function BallotView() {

    const [title, setTitle] = useState('Election 1');
    const [otherEnabled, setOtherEnabled] = useState(true);
    const [candidates, setCandidates] = useState([]);

    const submitForm = (event, value) => {
        event.preventDefault();
        console.log(value);
    };

    useEffect(() => {
        firebaseDb.child('election').on('value', snapshot => {
            const data = snapshot.val();
            const tempList = [];
            for (let id in data) {
                tempList.push(data[id]);
            }
            setCandidates(tempList[1].candidates);
        })
    }, []);

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
        value: "",
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
                        disabled={this.state.disabled}
                    >
                        Cast Ballot
                    </Button>
                </FormControl>
            </form>
        );
    }
}

