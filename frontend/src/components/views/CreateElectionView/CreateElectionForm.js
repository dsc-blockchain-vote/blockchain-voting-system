import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

import Settings from "./Settings";
import Candidates from "./Candidates";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    divider: {
        // marginTop: theme.spacing(3),
        margin: theme.spacing(3),
    },
}));

export default function CreateElectionForm() {
    const classes = useStyles();

    return (
        <Paper>
            <Settings/>
            <Candidates/>
            <Button variant="contained" color="primary" size="large">
                Create
            </Button>
        </Paper>
    );
}
