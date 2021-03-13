import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import '../../../App.css';
import { Link } from 'react-router-dom';
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  helperText: {
      color: 'red'
  },
  paperStyle: {
    padding: 20,
    height: '70vh',
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
export default function Signup() {

  const classes = useStyles();

  var [firstName, setFirstName] = useState('');
  var [lastName, setLastName] = useState('');
  var [email, setEmail] = useState('');
  var [password, setPassword] = useState('');
  var [errors, setErrors] = useState({firstName: '', lastName: '', email: '', password: ''});
  var [disabled, setDisabled] = useState(true)

  const handleInputChange = (e) => {
        validation(e.target.name, e.target.value)
        if (e.target.name === 'firstName')
          setFirstName(e.target.value);
        else if (e.target.name === 'lastName')
            setLastName(e.target.value);
        else if (e.target.name === 'email')
          setEmail(e.target.value);
        else if (e.target.name === 'password')
          setPassword(e.target.value);
        if (firstName && lastName && email && password &&
             errors.firstName === '' && errors.lastName === '' && errors.email === '' && errors.password === '' )
          setDisabled(false)
        else 
          setDisabled(true)
    }

  const validation = (name, value) => {
      if (name === 'firstName'){
          if (value.length === 0)
            errors.firstName = 'First name should not be empty!';
          else if (!/^[a-zA-Z\s]+$/.test(value))
            errors.firstName = 'First name should only consist of alphabets and spaces!';
          else if (/^[a-zA-Z\s]+$/.test(value))
            errors.firstName = '';
        }
      if (name === 'lastName'){
          if (value.length === 0)
            errors.lastName = 'Last name should not be empty!';
          else if (!/^[a-zA-Z\s]+$/.test(value))
            errors.lastName = 'Last name should only consist of alphabets and spaces!';
          else if (/^[a-zA-Z\s]+$/.test(value))
            errors.lastName = '';
        }
      else if (name === 'email')
        errors.email = (emailRegex.test(value))? '': 'Invalid email ID';
      else if (name === 'password'){
        errors.password = value.length === 0? 'Password should not be empty':'';
      }
  }

  const handleSubmit = () => {
    if (firstName && lastName && email && password &&
        errors.firstName === '' && errors.lastName === '' && errors.email === '' && errors.password === '' ){
            console.log('Signed up Succesfully!');
            window.location.href = '/elections'
        }
    }

        return (
          <Paper elevation={10} className={classes.paperStyle}>
            <Box >
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant='h5' style ={{ textAlign: 'center', fontWeight: 'bold'}}>Sign up</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField className={classes.textField}
                            helperText={errors.firstName?errors.firstName:''}
                            FormHelperTextProps={{
                              className: classes.helperText
                            }}
                            label="First Name"
                            variant="outlined"
                            name='firstName'
                            value={firstName}
                            fullWidth
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField className={classes.textField}
                            helperText={errors.lastName?errors.lastName:''}
                            FormHelperTextProps={{
                              className: classes.helperText
                            }}
                            label="Last Name"
                            variant="outlined"
                            name='lastName'
                            value={lastName}
                            fullWidth
                            onChange={handleInputChange}
                        />
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
                    <Grid className= 'button'>
                      <Button  
                        variant="contained" 
                        color="primary" 
                        size="large" 
                        disabled={disabled}
                        style= {{ marginLeft: 10, marginTop:5}}
                        onClick={handleSubmit}>
                          Sign Up
                      </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
        )
}
