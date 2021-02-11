import { Paper } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React from "react";

export default function Candidates(props) {

    return (
        <Paper>
            <Box p={3} pt={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h5">Candidates</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            required
                            label="Candidate 1"
                            variant="outlined"
                            name='candidate'
                            value={props.candidate1}
                            onChange={props.candidate1Change}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            required
                            label="Candidate 2"
                            variant="outlined"
                            name='candidate'
                            value={props.candidate2}
                            onChange={props.candidate2Change}
                            fullWidth
                            />
                    </Grid>
                </Grid>
            </Box>
        </Paper>
        );
    }

