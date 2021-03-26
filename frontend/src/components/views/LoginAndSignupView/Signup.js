import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import '../../../App.css';
import axios from 'axios';
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  helperText: {
      color: 'red'
  },
  paperStyle: {
    padding: 20,
    height: '65vh',
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

  var [name, setName] = useState('');
  var [email, setEmail] = useState('');
  var [password, setPassword] = useState('');
  var [errors, setErrors] = useState({name: '', email: '', password: ''});
  var [disabled, setDisabled] = useState(true);
  var [checked, setChecked] = useState(false);

  const handleInputChange = (e) => {
        validation(e.target.name, e.target.value)
        if (e.target.name === 'name')
          setName(e.target.value);
        else if (e.target.name === 'email')
          setEmail(e.target.value);
        else if (e.target.name === 'password')
          setPassword(e.target.value);
        else if (e.target.name === 'checked'){
          setChecked(e.target.checked);
        }
        if (name && email && password &&
             errors.name === '' && errors.email === '' && errors.password === '' )
          setDisabled(false)
        else 
          setDisabled(true)
    }

  const validation = (name, value) => {
      if (name === 'name'){
          if (value.length === 0)
            errors.name = 'Name should not be empty!';
          else if (!/^[a-zA-Z\s]+$/.test(value))
            errors.name = 'Name should only consist of alphabets and spaces!';
          else if (/^[a-zA-Z\s]+$/.test(value))
            errors.name = '';
        }
      else if (name === 'email')
        errors.email = (emailRegex.test(value))? '': 'Invalid email ID';
      else if (name === 'password')
        errors.password = value.length < 6? 'Password should be atleast 6 characters long':'';
  }

  const handleSubmit = () => {
    if (name && email && password && errors.name === '' && 
    errors.email === '' && errors.password === '' ){
            let check = !checked;
            let data = {name, email, password, check}; 
            axios.post('http://localhost:5000/api/register', data)
            .then(response => {
              console.log('Signed up Succesfully!');
              window.location.href = '/elections'
            })
            .catch(error => {
              console.log(error);
            })
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
                            helperText={errors.name?errors.name:''}
                            FormHelperTextProps={{
                              className: classes.helperText
                            }}
                            label="Name"
                            variant="outlined"
                            name='name'
                            value={name}
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
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Checkbox checked={checked} onChange={handleInputChange} name="checked" />}
                        label="I am an Organizer"
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
