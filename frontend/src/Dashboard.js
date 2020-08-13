import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import * as strings from './strings'
import { Redirect } from 'react-router-dom';

export default function Dashboard() {

const [credentialsError, setCredentialsError] = useState(false)

function onClickHandler() {
    setCredentialsError(true)
}
  return (
    <div>
        {credentialsError == true && 
        <Redirect 
          to={{
            pathname: '/',
          }} 
        />
      }
      <Button
        type="button"
        fullWidth
        variant="contained"
        color="primary"
        onClick={onClickHandler}
        >
        Sign In
        </Button>
    </div>
  );
}