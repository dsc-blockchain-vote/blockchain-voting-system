import React, { Component, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TimerIcon from "@material-ui/icons/Timer";
import EventIcon from "@material-ui/icons/Event";
import DoneIcon from "@material-ui/icons/Done";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import format from "date-fns/format";
import parseJSON from "date-fns/parseJSON";
import distanceInWordsToNow from "date-fns/formatDistanceToNow";
import isPast from "date-fns/isPast";
import isFuture from "date-fns/isFuture";
import { Link } from "react-router-dom";
import { Button, Grid, Tooltip } from "@material-ui/core";
import axios from "axios";

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        // maxWidth: 500,
    },
    tabPanel: {
        marginTop: "20px",
    },
    paper: {
        padding: 20,
        marginTop: 20,
        marginBottom: 20,
    },
    divider: {
        marginTop: 10,
        marginBottom: 20,
    },
});

// Parse election data from a JSON response
function parseElections(data) {
    const elections = Object.keys(data);
    const time = new Date();

    let result = {
        Upcoming: [],
        Previous: [],
        Ongoing: [],
    };

    for (let i = 0; i < elections.length; i++) {
        const election = data[elections[i]];
        const startTime = parseJSON(election.startTime);
        const endTime = parseJSON(election.endTime);
        election.startTime = startTime;
        election.endTime = endTime;
        election.electionID = elections[i];
        // election ended
        if (isPast(endTime)) {
            result["Previous"].push(election);
        }
        // election hasn't started
        else if (isFuture(startTime)) {
            result["Upcoming"].push(election);
        }
        // election is in progress
        else {
            result["Ongoing"].push(election);
        }
    }
    return result;
}

export default function ElectionListView(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [elections, setElections] = React.useState({
        Upcoming: [],
        Previous: [],
        Ongoing: [],
    });

    // get elections for this user
    useEffect(() => {
        const result = axios
            .get("http://localhost:5000/api/election", {
                withCredentials: true,
            })
            .then((response) => {
                setElections(parseElections(response.data));
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <Paper className={classes.root}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="fullWidth"
                    indicatorColor="secondary"
                    textColor="secondary"
                    aria-label="icon label tabs example"
                >
                    <Tab icon={<TimerIcon />} label="Current elections" />
                    <Tab icon={<EventIcon />} label="Upcoming elections" />
                    <Tab icon={<DoneIcon />} label="Concluded elections" />
                </Tabs>
            </Paper>
            <Container>
                <TabPanel value={value} index={0}>
                    <Typography variant="h4">Current elections</Typography>
                    <Divider className={classes.divider} />
                    <ElectionList elections={elections} type={"Ongoing"} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Typography variant="h4">Upcoming elections</Typography>
                    <Divider className={classes.divider} />
                    <ElectionList elections={elections} type={"Upcoming"} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Typography variant="h4">Concluded elections</Typography>
                    <Divider className={classes.divider} />
                    <ElectionList elections={elections} type={"Previous"} />
                </TabPanel>
            </Container>
        </div>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    const classes = useStyles();
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`wrapped-tabpanel-${index}`}
            aria-labelledby={`wrapped-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Container maxWidth="lg" className={classes.tabPanel}>
                    {children}
                </Container>
            )}
        </div>
    );
}

// Represents a single 'tab' containing a list of elections
function ElectionList(props) {
    const classes = useStyles();
    const elections = props.elections[props.type];
    if (elections && elections.length > 0) {
        return (
            <div>
                {elections.map((c) => {
                    // set up duration string
                    let duration = "";
                    let range = `${format(
                        c.startTime,
                        "d MMM yyyy HH:mm"
                    )} to ${format(c.endTime, "d MMM yyyy HH:mm")}`;
                    if (props.type === "Upcoming") {
                        duration = `Starts in ${distanceInWordsToNow(
                            c.startTime
                        )}`;
                    } else if (props.type === "Previous") {
                        duration = `Ended ${distanceInWordsToNow(
                            c.endTime
                        )} ago`;
                    } else {
                        duration = `Ends in ${distanceInWordsToNow(c.endTime)}`;
                    }
                    return (
                        <Paper className={classes.paper}>
                            <Grid container alignItems="center" spacing={3}>
                                <Grid item xs={10}>
                                    <Typography variant="h6">
                                        {c.electionName}
                                    </Typography>
                                    <Tooltip title={range} arrow>
                                        <Typography
                                            variant="subtitle2"
                                            display="inline"
                                        >
                                            {duration}
                                        </Typography>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component={Link}
                                        to={`elections/${c.electionID}`}
                                    >
                                        View Election
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    );
                })}
            </div>
        );
    }
    return (
        <div>
            <Typography variant="h5">No elections found </Typography>
            <Typography>
                If you believe this is an error, contact your organization's
                administrator.
            </Typography>
        </div>
    );
}
