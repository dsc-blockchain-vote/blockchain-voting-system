import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  }
}));

export default function NavBar(props) {
    const classes = useStyles();

    return(
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <Typography variant="h6">
                    {props.title}
                </Typography>
            </Toolbar>
        </AppBar>
    )

}
