import React, { Component, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TimerIcon from "@material-ui/icons/Timer";
import EventIcon from "@material-ui/icons/Event";
import DoneIcon from "@material-ui/icons/Done";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fade from "@material-ui/core/Fade";
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
    let result = {};

    for (let id in data) {
        const election = data[id];
        const startTime = parseJSON(election.startTime);
        const endTime = parseJSON(election.endTime);
        election.startTime = startTime;
        election.endTime = endTime;
        result[id] = election;
    }
    return result;
}

export default function ElectionListView(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

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
            <Fade in>
                <Container>
                    <TabPanel value={value} index={0}>
                        <Typography variant="h4">Current elections</Typography>
                        <Divider className={classes.divider} />
                        <ElectionList type={"ongoing"} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Typography variant="h4">Upcoming elections</Typography>
                        <Divider className={classes.divider} />
                        <ElectionList type={"upcoming"} />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Typography variant="h4">
                            Concluded elections
                        </Typography>
                        <Divider className={classes.divider} />
                        <ElectionList type={"previous"} />
                    </TabPanel>
                </Container>
            </Fade>
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
    const [elections, setElections] = React.useState({});
    const [loading, setLoading] = React.useState(false);

    // get elections for this user
    useEffect(() => {
        setLoading(true);
        const result = axios
            .get("http://localhost:5000/api/election", {
                params: {
                    time: props.type,
                },
                withCredentials: true,
            })
            .then((response) => {
                setElections(parseElections(response.data));
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    // If the elections are loading, display a progress icon
    if (loading) {
        return (
            <Fade in={loading}>
                <Container>
                    <CircularProgress />
                </Container>
            </Fade>
        );
    }
    // If there are elections in the list, display
    if (elections && Object.keys(elections).length > 0) {
        return (
            <div>
                {Object.keys(elections).map((id) => {
                    const c = elections[id];
                    // set up duration string
                    let duration = "";
                    let range = `${format(
                        c.startTime,
                        "d MMM yyyy HH:mm"
                    )} to ${format(c.endTime, "d MMM yyyy HH:mm")}`;
                    if (props.type === "upcoming") {
                        duration = `Starts in ${distanceInWordsToNow(
                            c.startTime
                        )}`;
                    } else if (props.type === "previous") {
                        duration = `Ended ${distanceInWordsToNow(
                            c.endTime
                        )} ago`;
                    } else {
                        duration = `Ends in ${distanceInWordsToNow(c.endTime)}`;
                    }
                    return (
                        <Fade in={!loading}>
                            <Paper className={classes.paper}>
                                <Grid container alignItems="center" spacing={3}>
                                    <Grid item xs={10}>
                                        <Typography variant="h6">
                                            {c.electionName}
                                        </Typography>
                                        {/* show full date range when hovering on duration */}
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
                                        <ElectionButton
                                            id={id}
                                            type={props.type}
                                            election = {c}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Fade>
                    );
                })}
            </div>
        );
    }
    // If the list exists but there are no elections for this search, alert the user
    if (elections) {
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
}

// Represents a button that changes contents based on the election results
function ElectionButton(props) {
    let text = "View Election"
    let link = "";
    let disabled = false;

    if (props.type === "ongoing") {
        text = "Cast Ballot";
        link = `elections/${props.id}`;
    }
    else if (props.type === "upcoming") {
        text = "Preview Ballot";
        link = `elections/${props.id}/preview`;
    }
    else if (props.type === "previous") {
        text = "View Results";
        link = `elections/${props.id}/results`;
    }

    return (
        <Button
            variant="contained"
            color="primary"
            component={Link}
            to={{
                pathname: link,
                state : {
                    election: props.election,
                    id: props.id
                }
            }}
            disabled={disabled}
        >
            {text}
        </Button>
    );
}
