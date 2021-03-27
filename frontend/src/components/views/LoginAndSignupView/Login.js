import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import '../../../App.css';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import { makeStyles } from "@material-ui/core";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  helperText: {
      color: 'red'
  },
  paperStyle: {
    padding: 20,
    height: '47vh',
    width: 700,
    margin: '20px auto'
  },
  textField:{
    id:"outlined-error-helper-text",
    required: true
  }
}));

const emailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

//function to display the input textbox for the election title and for picking the start and end dates 
export default function Component() {

  const classes = useStyles();

  var [email, setEmail] = useState('');
  var [password, setPassword] = useState('');
  var [errors, setErrors] = useState({email: '', password: ''});
  var [disabled, setDisabled] = useState(true)

  //stores the values of any input fields that are updated and also checks for any input errors
  const handleInputChange = (e) => {
        validation(e.target.name, e.target.value)
        if (e.target.name === 'email')
          setEmail(e.target.value);
        else if (e.target.name === 'password')
          setPassword(e.target.value);
        if (email && password && errors.email == ''&& errors.password == '')
          setDisabled(false)
        else 
          setDisabled(true)
    }

  //checks the input fields for any kind of invalid input that was entered
  const validation = (name, value) => {
      if (name === 'email')
        errors.email = (emailRegex.test(value))? '': 'Invalid email ID';
      else if (name === 'password'){
        errors.password = value.length < 6? 'Password should be atleast 6 characters long':'';
      }
  }

  //logs in the cuurent user by creating a new session cookie
  const handleSubmit = () => {
    if (email && password && errors.email === '' && errors.password === ''){
        firebase.initializeApp({
          ***REMOVED***,
          ***REMOVED***
        });  
        // As httpOnly cookies are to be used, do not persist any state client side.
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(({ user }) => {
              user.getIdToken().then(console.log)
              return user.getIdToken().then((idToken) => {
                return (axios.post('http://localhost:5000/api/login', {"idToken":idToken}, {withCredentials: true})
                .then(response => {
                  console.log('Logged in Succesfully!');
                  window.location.href = '/elections'
                })
                .catch(error => {
                  console.log(error);
                }));
              });
            })
    }
}

        return (
          <Paper elevation={10} className={classes.paperStyle}>
            <Box >
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant='h5' style ={{ textAlign: 'center', fontWeight: 'bold'}}>Login</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField className={classes.textField}
                            helperText={errors.email?errors.email:''}
                            FormHelperTextProps={{
                              className: classes.helperText
                            }}
                            label="Email ID"
                            variant="outlined"
                            name='email'
                            type='email'
                            value={email}
                            fullWidth
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField className={classes.textField}
                            helperText={errors.password?errors.password:''}
                            FormHelperTextProps={{
                              className: classes.helperText
                            }}
                            label="Password"
                            type='password'
                            variant="outlined"
                            name='password'
                            value={password}
                            fullWidth
                            onChange={handleInputChange}

                        />
                    </Grid>
                    <Grid item xs={12}>
                      <Link to='/signup'>
                        <li>Don't have an account? Sign up here</li>
                      </Link>
                    </Grid>
                    <Grid className= 'button'>
                      <Button  
                        variant="contained" 
                        color="primary" 
                        size="large" 
                        disabled={disabled}
                        style= {{ marginLeft: 10, marginTop:5}}
                        onClick={handleSubmit}>
                          Login
                      </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
        )
}
