import React, { Component, useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

class Settings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "",
            start: new Date(),
            end: new Date()
        }
    }

    handleTitleChange = (e) => {
        this.setState({title: e.target.value});
    }

    handleStartChange = (date) => {
        this.setState({start: date});
    };

    handleEndChange = (date) => {
        this.setState({end: date})
    };

    render() { 
        const start = this.state.start;
        const end = this.state.end;
        return (
            <Paper>
            <Box p={3} pt={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant='h5'>Election settings</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Election title"
                            variant="outlined"
                            value={this.state.title}
                            onChange={this.handleTitleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid item xs={6}>
                            <DateTimePicker
                                label="Start time"
                                disablePast
                                inputVariant="outlined"
                                value={start}
                                onChange={this.handleStartChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DateTimePicker
                                label="End time"
                                disablePast
                                inputVariant="outlined"
                                value={end}
                                onChange={this.handleEndChange}
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
}
 
export default Settings;