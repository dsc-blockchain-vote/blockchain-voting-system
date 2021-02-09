import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";

export default function UserInfo(props) {
    return (
        <List>
            <ListItem>
                <ListItemAvatar>
                    <Avatar src={props.avatar}>{props.name.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={props.name} secondary={props.id}/>
            </ListItem>
        </List>
    );
}
