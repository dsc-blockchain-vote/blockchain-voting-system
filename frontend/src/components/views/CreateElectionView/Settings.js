import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    helperText: {
        color: 'red'
    }
}));

//function to display the input textbox for the election title and for picking the start and end dates 
export default function Settings(props) {

    const classes = useStyles();

    return ( 
            <Paper>
            <Box p={3} pt={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant='h5'>Election settings</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="outlined-error-helper-text"
                            helperText={props.errors.title?props.errors.title:''}
                            FormHelperTextProps={{
                                className: classes.helperText
                              }}
                            label="Election title"
                            variant="outlined"
                            name='title'
                            value={props.title}
                            onChange={props.inputChange}
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
                                value={props.start}
                                onChange={props.startChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <DateTimePicker
                                label="End time"
                                disablePast
                                inputVariant="outlined"
                                value={props.end}
                                onChange={props.endChange}
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
 
