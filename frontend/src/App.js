import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import LeftDrawer from "./components/common/LeftDrawer";
import { makeStyles } from "@material-ui/core/styles";
import NavBar from "./components/common/NavBar";
import CreateElectionView from "./components/views/CreateElectionView/CreateElectionView";
import RouteHandler from "./components/router/RouteHandler";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(0),
    },
}));

function App() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CssBaseline />
            <NavBar title="All elections" />
            <LeftDrawer />
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {/* Page content goes here */}
                <RouteHandler />
            </main>
        </div>
    );
}
export default App;
