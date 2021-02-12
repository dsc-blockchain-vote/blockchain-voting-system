import { Paper } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

class Candidates extends Component {
    constructor(props) {
        super(props);
        this.state = {
            candidates: [
                { id: 1, name: "Name 1" },
                { id: 2, name: "Name 2" },
                { id: 3, name: "Name 3" },
            ],
        };
    }

    handleNameChange(id, e) {
        const candidates = [...this.state.candidates];
        const index = candidates.map((c) => c.id).indexOf(id);
        candidates[index].name = e.target.value;
        this.setState(candidates);
    }

    handleDelete(id) {
        const candidates = this.state.candidates.filter((c) => c.id !== id);;
        this.setState({candidates});
    }

    render() {
        const candidates = this.state.candidates;
        return (
            <Paper>
                <Box p={3} pt={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h5">Candidates</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <List>
                                {candidates.map((candidate) => {
                                    return (
                                        <Candidate
                                            id={candidate.id}
                                            onDelete={() => this.handleDelete(candidate.id)}
                                            onChange={(e) => this.handleNameChange(candidate.id, e)}
                                            candidate={candidate}
                                        />
                                    );
                                })}
                            </List>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControlLabel
                                control={<Checkbox color="primary" />}
                                label="Enable 'Other' candidates"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        );
    }
}


function Candidate(props) {
    return (
        <ListItem>
            <TextField
                defaultValue={props.candidate.name}
                label={"Candidate " + props.id}
                onChange={props.onChange}
                fullWidth
            />
            <ListItemSecondaryAction>
                <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={props.onDelete}
                >
                    <DeleteIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
}

export default Candidates;
