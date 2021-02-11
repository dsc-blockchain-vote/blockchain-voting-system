import { Paper } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React from "react";

export default function Candidates() {
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
                </Grid>
            </Box>
        </Paper>
    );
}
