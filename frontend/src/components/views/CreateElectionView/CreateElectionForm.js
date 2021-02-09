import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import DateFnsUtils from "@date-io/date-fns";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    divider: {
        // marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
}));

export default function CreateElectionForm() {
    const classes = useStyles();

    const [selectedStartDate, setSelectedStart] = useState(new Date());
    const [selectedEndDate, setSelectedEnd] = useState(new Date());

    const handleStartChange = (date) => {
        setSelectedStart(date);
    };

    const handleEndChange = (date) => {
        setSelectedEnd(date);
    };

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        required
                        label="Election title"
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <DateTimePicker
                        label="Start time"
                        disablePast
                        inputVariant="outlined"
                        value={selectedStartDate}
                        onChange={handleStartChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <DateTimePicker
                        label="End time"
                        disablePast
                        inputVariant="outlined"
                        value={selectedEndDate}
                        onChange={handleEndChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        required
                        label="Candidate 1"
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        required
                        label="Candidate 2"
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Divider className={classes.divider}/>
                </Grid>
            </Grid>
            <Button variant="contained" color="primary" size="large">Create</Button>
        </MuiPickersUtilsProvider>
    );
}
