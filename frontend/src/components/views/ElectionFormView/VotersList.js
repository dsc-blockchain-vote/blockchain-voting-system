import React from "react";
import Box from "@material-ui/core/Box";
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
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1.5),
        width: '38ch',
      },
    },
    helperText: {
        color: 'red'
    },
    textField: {
        id:"outlined-error-helper-text"
    }
  }));

//function to display each added candidate's name along with an option to delete a candidate or add more candidates
export default function VotersList(props){

        return (
            <Paper>
                <Box p={3} pt={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h5">Voters List</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <List>
                                {props.voters.map((voter) => {
                                    return (
                                        <Voter
                                            key = {voter.id}
                                            addOrDelete={props.addOrDelete}
                                            inputChange={props.inputChange}
                                            errors = {props.errors}
                                            voter = {voter}
                                        />
                                    );
                                })}
                                <div>
                                </div>
                                <ListItem>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        color="primary"
                                        startIcon={<AddCircleIcon />}
                                        onClick={() =>
                                            props.addOrDelete('addVoter')
                                        }
                                    >
                                        Add Voter
                                    </Button>
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        );
    }

    //a function to display the input textbook for candidate name along with the delete icon for each candidate
    function Voter(props) {

        const classes = useStyles();

        return (
            <ListItem className={classes.root}>
                <TextField className={classes.textField}
                    variant='outlined'
                    helperText={props.errors.voterName[props.voter.id]?props.errors.voterName[props.voter.id]:''}
                    FormHelperTextProps={{
                        className: classes.helperText
                      }}
                    name='name'
                    defaultValue={props.voter.name}
                    value={props.voter.name}
                    label={"Voter name"}
                    onChange={(e) =>
                        props.inputChange(
                            e, props.voter.id
                        )
                    }            
                />              
                <TextField className={classes.textField}
                    variant='outlined'
                    helperText={props.errors.voterID[props.voter.id]?props.errors.voterID[props.voter.id]:''}
                    FormHelperTextProps={{
                        className: classes.helperText
                      }}
                    name='voterID'
                    value={props.voter.voterID}
                    defaultValue={props.voter.voterID}
                    label={"Voter ID"}
                    onChange={(e) =>
                        props.inputChange(
                            e, props.voter.id
                        )
                    }
                />
                <TextField className={classes.textField}
                    variant='outlined'
                    helperText={props.errors.email[props.voter.id]?props.errors.email[props.voter.id]:''}
                    FormHelperTextProps={{
                        className: classes.helperText
                      }}
                    name='voterEmail'
                    value={props.voter.email}
                    defaultValue={props.voter.email}
                    label={"Voter email"}
                    type='email'
                    onChange={(e) =>
                        props.inputChange(
                            e, props.voter.id
                        )
                    }
                />
                <ListItemSecondaryAction>
                    <IconButton
                        edge="end"
                        aria-label="delete"
                        name='voter'
                        onClick={() =>
                            props.addOrDelete('deleteVoter', props.voter.id)
                        }>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }