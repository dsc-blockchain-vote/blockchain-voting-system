import React from "react";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    helperText: {
        color: 'red'
    }
}));

//function to display each added candidate's name along with an option to delete a candidate or add more candidates
export default function Candidates(props){

    const classes = useStyles();

        return (
            <Paper>
                <Box p={3} pt={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h5">Candidates</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <List>
                                {props.candidates.map((candidate) => {
                                    return (
                                        <Candidate
                                            key = {candidate.id}
                                            addOrDelete={props.addOrDelete}
                                            inputChange={props.inputChange}
                                            candidate = {candidate}
                                            errors = {props.errors}
                                        />
                                    );
                                })}
                                <ListItem>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        color="primary"
                                        startIcon={<AddCircleIcon />}
                                        onClick={() =>
                                            props.addOrDelete('addCandidate')
                                        }
                                    >
                                        Add Candidate
                                    </Button>
                                </ListItem>
                            </List>
                        </Grid>

                        {/* <Grid item xs={6}>
                            <FormControlLabel
                                control={<Checkbox color="primary" />}
                                label="Enable 'Other' candidates"
                            />
                        </Grid> */}
                    </Grid>
                </Box>
            </Paper>
        );
    }

    //a function to display the input textbook for candidate name along with the delete icon for each candidate
    function Candidate(props) {

        const classes = useStyles();

        return (
            <ListItem>
                <TextField
                    id="outlined-error-helper-text"
                    helperText={props.errors.candidateName[props.candidate.id]?props.errors.candidateName[props.candidate.id]:''}
                    FormHelperTextProps={{
                        className: classes.helperText
                      }}
                    defaultValue={props.candidate.name}
                    name='candidate'
                    label={"Candidate name"}
                    onChange={(e) =>
                        props.inputChange(
                            e, props.candidate.id
                        )
                    }
                    fullWidth
                />
                <ListItemSecondaryAction>
                    <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() =>
                            props.addOrDelete('deleteCandidate', props.candidate.id)
                        }
                    >
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
