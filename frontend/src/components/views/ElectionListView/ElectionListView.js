import React, { Component } from "react";
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
import DateFnsUtils from "@date-io/date-fns";
import { format } from "date-fns";
import { Button, Grid } from "@material-ui/core";

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

function getElections(elections) {
    // TODO: this will eventually grab data from backend, for now this is filler data
    // eventually this should grab election data as the tabs are switched - not all 3 categories at once
    return [
        {
            category: "current",
            elections: [
                {
                    id: 1,
                    title: "Election 1",
                    start: new Date("December 17, 2020 03:24:00"),
                    end: new Date("March 19, 2021 03:24:00"),
                },
                {
                    id: 2,
                    title: "Election 2",
                    start: new Date("December 17, 2020 03:24:00"),
                    end: new Date("March 30, 2021 03:24:00"),
                },
            ],
        },
        {
            category: "upcoming",
            elections: [
                {
                    id: 3,
                    title: "Election 3",
                    start: new Date("December 17, 2021 03:24:00"),
                    end: new Date("March 19, 2022 03:24:00"),
                },
                {
                    id: 4,
                    title: "Election 4",
                    start: new Date("December 17, 2021 03:24:00"),
                    end: new Date("March 30, 2022 03:24:00"),
                },
            ],
        },
        {
            category: "concluded",
            elections: [
                {
                    id: 5,
                    title: "Election 5",
                    start: new Date("December 17, 2019 03:24:00"),
                    end: new Date("March 19, 2020 03:24:00"),
                },
                {
                    id: 6,
                    title: "Election 6",
                    start: new Date("December 17, 2019 03:24:00"),
                    end: new Date("March 30, 2020 03:24:00"),
                },
            ],
        },
    ];
}

export default function ElectionListView(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    // TODO: link with backend
    const elections = getElections(props.elections);

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
                    <ElectionList elections={elections[0].elections} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Typography variant="h4">Upcoming elections</Typography>
                    <Divider className={classes.divider} />
                    <ElectionList elections={elections[1].elections} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Typography variant="h4">Concluded elections</Typography>
                    <Divider className={classes.divider} />
                    <ElectionList elections={elections[2].elections} />
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

function ElectionList(props) {
    const classes = useStyles();
    return (
        <div>
            {props.elections.map((c) => {
                return (
                    <Paper className={classes.paper}>
                        <Grid container alignItems='center' spacing={3}>
                            <Grid item xs={10}>
                                <Typography variant="h6">{c.title}</Typography>
                                <Typography variant="subtitle2">
                                    {format(c.start, "MM/dd/yyyy")} to{" "}
                                    {format(c.end, "MM/dd/yyyy")}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Button variant="contained" color="primary" href={c.id}>View Election</Button>
                            </Grid>
                        </Grid>
                    </Paper>
                );
            })}
        </div>
    );
}
