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
import { Email } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1.5),
        width: '38ch',
      },
    },
    error: {
        position: "relative",
        bottom: 0,
        color: "red",
        fontSize: 12
      }
  }));

//function to display each added candidate's name along with an option to delete a candidate or add more candidates
export default function VotersList(props){

    const classes = useStyles();

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
                                    <ListItem>
                                        {props.errors.voterName.length > 0 && <span className={classes.error}>{props.errors.voterName}</span>}
                                    </ListItem>
                                    <ListItem>
                                        {props.errors.voterID.length > 0 && <span className={classes.error}>{props.errors.voterID}</span>}
                                    </ListItem>
                                    <ListItem>
                                        {props.errors.email.length > 0 && <span className={classes.error}>{props.errors.email}</span>} 
                                    </ListItem>
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
                <TextField
                    variant="outlined"
                    id='voter'
                    name='name'
                    defaultValue={props.voter.name}
                    value={props.voter.name}
                    label={"Voter name"}
                    fullWidth
                    onChange={(e) =>
                        props.inputChange(
                            e, props.voter.id
                        )
                    }            
                />              
                <TextField
                    variant="outlined"
                    id='voter'
                    name='voterID'
                    value={props.voter.voterID}
                    defaultValue={props.voter.voterID}
                    label={"Voter ID"}
                    fullWidth
                    onChange={(e) =>
                        props.inputChange(
                            e, props.voter.id
                        )
                    }
                />
                <TextField
                    variant="outlined"
                    id='voter'
                    name='voterEmail'
                    value={props.voter.email}
                    defaultValue={props.voter.email}
                    label={"Voter email"}
                    type='email'
                    fullWidth
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