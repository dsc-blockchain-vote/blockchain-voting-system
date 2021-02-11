import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import React from 'react';

export default function Candidates() {
    return (
        <Grid container spacing={3}>
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
    )
}