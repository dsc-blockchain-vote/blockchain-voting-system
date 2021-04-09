import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import LeftDrawer from "./components/common/LeftDrawer";
import { makeStyles } from "@material-ui/core/styles";
import NavBar from "./components/common/NavBar";
import ElectionFormView from "./components/views/ElectionFormView/ElectionFormView";
import RouteHandler from "./components/router/RouteHandler";
import { LensOutlined } from "@material-ui/icons";

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
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(false);
  useEffect(() => {
    setUser(user);
    setLoggedIn(loggedIn);
    console.log(user);
  }, [user]);
  return (
    <div className={classes.root}>
      <CssBaseline />
      <NavBar title="dVote" />
      <LeftDrawer
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        user={user}
        setUser={setUser}
      />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {/* Page content goes here */}
        <RouteHandler
          setLoggedIn={setLoggedIn}
          loggedIn={loggedIn}
          user={user}
          setUser={setUser}
        />
      </main>
    </div>
  );
}
export default App;
