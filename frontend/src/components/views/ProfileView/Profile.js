import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  divider: {
    color: "black",
  },
});
const URL = process.env.REACT_APP_API_URL;
export default function Profile(props) {
  const classes = useStyles();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userID, setUserID] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    axios
      .get(URL + "/api/user/info", { withCredentials: true })
      .then((response) => {
        setName(response.data.name);
        setEmail(response.data.email);
        setUserID(response.data.userID);
        setType(response.data.accountType);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          alert("Sorry you have to login first to see your account details!");
          window.sessionStorage.clear();
          window.location.href = "/";
        }
      });
  }, []);

  return (
    <Container maxWidth="lg">
      <Paper>
        <Box p={3} pt={3}>
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                margin: 20,
              }}
            >
              <AccountCircleIcon fontSize="large" />
              <Typography variant="h5" style={{ display: "inline-block" }}>
                Hey {name}
              </Typography>
            </Grid>
            <Divider className={classes.divider} />
            <Grid item xs={12}>
              Name: {name}
            </Grid>
            <Grid item xs={12}>
              Email: {email}
            </Grid>
            <Grid item xs={12}>
              User ID: {userID}
            </Grid>
            <Grid item xs={12}>
              User type: {type}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
