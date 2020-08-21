import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';

export default function Dashboard() {

const [credentialsError, setCredentialsError] = useState(false)

function onClickHandler() {
    setCredentialsError(true)
}
  return (
    <div>
        {credentialsError === true && 
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