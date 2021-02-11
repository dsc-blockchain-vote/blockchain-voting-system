import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";

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
        <Paper>
            <Box p={3} pt={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant='h5'>Election settings</Typography>
                    </Grid>
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
            </Box>
        </Paper>
    );
}
