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
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core";
import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import { set } from "date-fns";

const useStyles = makeStyles((theme) => ({
  buttonProgress: {
    position: "absolute",
    top: "20%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function BallotView(props) {
  const [id, setId] = useState(props.location.state.id);
  const [title, setTitle] = useState(
    id ? props.location.state.election.electionName : "Election"
  );
  const [otherEnabled, setOtherEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  let [candidates, setCandidates] = useState([]);
  let [voted, setVoted] = useState(false);
  let [votedFor, setVotedFor] = useState("");
  let [num, setNum] = useState(0);

  //gets the candidate names for thsi election from the backend and whether this voter has voted
  // in the election before or not
  useEffect(() => {
    candidates = props.location.state.election.candidates.map((c, i) => {
      return { id: i, name: c };
    });
    setCandidates(candidates);
    if (!loading) setLoading(true);
    axios
      .get(`http://localhost:5000/api/election/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setLoading(false);
        voted = response.data.voted;
        setVoted(voted);
        votedFor = voted === true ? response.data.votedFor : "";
        setVotedFor(votedFor);
      })
      .catch((error) => {
        setLoading(false);
        alert(error.message);
      });
  }, []);

  //registers this voter's vote on the blockchain network and shows them their
  // transaction hash, of voted successfully
  const submitForm = (event, value) => {
    event.preventDefault();
    console.log({ id, value });
    num = num + 1;
    if (num === 1) {
      if (!loading) setLoading(true);
      axios
        .put(
          `http://localhost:5000/api/election/${id}/vote`,
          { candidateID: value },
          { withCredentials: true }
        )
        .then((response) => {
          setLoading(false);
          event.preventDefault();
          alert(
            `Voted successfully for Candidate ${
              props.location.state.election.candidates[parseInt(value)]
            } with transaction hash ${
              response.data["transaction hash"]
            }. Take a screenshot of this or save this transaction hash safely somewhere, since you won't be able to view this hash again!`
          );
        })
        .catch((error) => {
          setLoading(false);
          alert(error.message);
        });
    } else alert("Sorry you have already voted, you can't vote again!");
  };

  return (
    <Container maxWidth="lg">
      <Paper>
        <Box p={3} pt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5">{title}</Typography>
            </Grid>
            <Grid item xs={12}>
              <BallotList
                submitForm={(e, val) => {
                  submitForm(e, val);
                }}
                candidates={candidates}
                other={otherEnabled}
                vote={votedFor}
                name={
                  props.location.state.election.candidates[parseInt(votedFor)]
                }
                loading={loading}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

//function to display all the candidate names in a list
function BallotList(props) {
  const [value, setValue] = useState("");
  const [disabled, setDisabled] = useState(true);
  const classes = useStyles();

  //updates the candidate chosen by the voter
  const onChange = (e) => {
    setValue(e.target.value);
    setDisabled(false);
  };
  //displays the list of candidates if the voter hasn't voted before
  if (props.vote === "") {
    return (
      <form
        onSubmit={(e) => props.submitForm(e, value)}
        style={props.loading ? { filter: "blur(3px)" } : {}}
      >
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
            disabled={disabled || props.loading}
          >
            Cast Ballot
          </Button>
          {props.loading && (
            <CircularProgress size={100} className={classes.buttonProgress} />
          )}
        </FormControl>
      </form>
    );
  }
  //if the voter has voted before, they it just gives a message displaying the candidate for whom
  //this voter voted
  else {
    return (
      <div>
        <Typography variant="h5">
          You have already voted for Candidate {props.name}
        </Typography>
      </div>
    );
  }
}
