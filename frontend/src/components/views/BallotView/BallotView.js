import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormLabel from "@material-ui/core/FormLabel";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";

class BallotView extends Component {
    state = {
        title: "Election 1",
        candidates: [
            { id: 1, name: "Name 1" },
            { id: 2, name: "Name 2" },
            { id: 3, name: "Name 3" },
        ],
        otherEnabled: true,
    };

    submitForm = (event, value) => {
        event.preventDefault();
        console.log(value);

        // TODO: Database stuff goes here
    };

    render() {
        return (
            <Container maxWidth="lg">
                <Paper>
                    <Box p={3} pt={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h5">
                                    {this.state.title}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <BallotList
                                    submitForm={(e, val) =>
                                        this.submitForm(e, val)
                                    }
                                    candidates={this.state.candidates}
                                    other={this.state.otherEnabled}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        );
    }
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

export default BallotView;
