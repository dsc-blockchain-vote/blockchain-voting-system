import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import '../../../App.css';
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  helperText: {
      color: 'red'
  },
  paperStyle: {
    padding: 20,
    height: '40vh',
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

  const validation = (name, value) => {
      if (name === 'email')
        errors.email = (emailRegex.test(value))? '': 'Invalid email ID';
      else if (name === 'password'){
        errors.password = value.length === 0? 'Password should not be empty':'';
      }
  }

  const handleSubmit = () => {
        if (email && password && errors.email === '' && errors.password === '')
          console.log('Logged in Succesfully!');
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
                    <Grid className= 'button'>
                      <Button  
                        variant="contained" 
                        color="primary" 
                        size="large" 
                        disabled={disabled}
                        style= {{ marginLeft: 10}}
                        onClick={handleSubmit}>
                          Login
                      </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
        )
}
