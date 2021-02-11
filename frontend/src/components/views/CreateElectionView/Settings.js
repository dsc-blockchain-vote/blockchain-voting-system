import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

export default function Settings() {

    const [selectedStartDate, setSelectedStart] = useState(new Date());
    const [selectedEndDate, setSelectedEnd] = useState(new Date());

    const handleStartChange = (date) => {
        setSelectedStart(date);
    };

    const handleEndChange = (date) => {
        setSelectedEnd(date);
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <TextField
                    required
                    label="Election title"
                    variant="outlined"
                    fullWidth
                />
            </Grid>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
            </MuiPickersUtilsProvider>
        </Grid>
    );
}
