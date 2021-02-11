import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

import Settings from "./Settings";
import Candidates from "./Candidates";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    divider: {
        marginTop: theme.spacing(3),
    },
}));

export default function CreateElectionForm() {
    const classes = useStyles();

    return (
        <Container maxWidth="lg">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Settings />
                </Grid>
                <Grid item xs={12}>
                    <Candidates />
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" size="large">
                        Create
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}
