import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import PropTypes from 'prop-types';
import UserInfo from "./UserInfo";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AllInboxIcon from '@material-ui/icons/AllInbox';
import BallotIcon from '@material-ui/icons/Ballot';
import CreateIcon from '@material-ui/icons/Create';
import SettingsIcon from '@material-ui/icons/Settings';

import { Route, MemoryRouter } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
}));

export default function LeftDrawer() {
    const classes = useStyles();

    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
            anchor="left"
        >
            {/* TODO: align logo in toolbar to navbar */}
            <div className={classes.toolbar} />
            <UserInfo name="Current User" id="studentid"/>

            <Divider />
            <List>
                <ListItemLink to="/elections" primary="Elections List" icon={<AllInboxIcon />} />
                <ListItemLink to="/create" primary="Create Election" icon={<CreateIcon />} />
                <ListItemLink to="/ballot" primary="Ballot" icon={<BallotIcon />} />
                <ListItemLink to="/login" primary="Login" />
                <ListItemLink to="/signup" primary="Sign Up" />
            </List>
            <Divider />
            <List>
                <ListItemLink to="#" primary="Settings" icon={<SettingsIcon />} />
            </List>
        </Drawer>
    );
}

function ListItemLink(props) {
    const { icon, primary, to } = props;
  
    const renderLink = React.useMemo(
      () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
      [to],
    );
  
    return (
      <li>
        <ListItem button component={renderLink}>
          {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
          <ListItemText primary={primary} />
        </ListItem>
      </li>
    );
  }
  
  ListItemLink.propTypes = {
    icon: PropTypes.element,
    primary: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
  };