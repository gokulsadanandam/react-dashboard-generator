import React , { useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { useIndexedDB } from 'react-indexed-db';
import { useHistory } from "react-router-dom";

import {loginContext} from './Login.Context';
import useAuth from './Auth.Context';


export const Login = () => {

  const { isAuthenticated , isUserAdmin , signin }  = React.useContext(loginContext);

  const auth = useAuth();

  const { getByIndex , add  } = useIndexedDB('users');

  const history = useHistory()

  useEffect(() => {

    if(isAuthenticated) {
      return history.push('/datasources')
    }
    getByIndex('username', 'admin').then( admin => {
        if(admin == undefined) {
            add({ username : 'admin' , password : 'admin' , role : 'admin' })
        }
    });
  }, []);


  const [creds,updateCreds] = React.useState({ username : '' , password : '' , errors : { message : '' , status : false } })


  const authenticateUser = async e => {
    e.preventDefault();
    if( creds.username && creds.password ) {
      const user = await getByIndex('username',creds.username)

      if( user && user.password === creds.password ) {
        // sessionStorage.setItem("isUserLoggedIn" , true)
        return auth.signin( user.username , user.role , () => history.push('/my-dashboard') )
        // return signin( user.username , user.role ,  () => history.push('/my-dashboard'));
      }

      if(!user) {
        return updateCreds( prevState => ({ ...prevState , username : '' , password : '' , errors : { message : 'User Not Found! Try Again' , status : true } }) );
      }
      
      return updateCreds( prevState => ({ ...prevState , password : '' , errors : { message : 'Invalid Password!!' , status : true } }) );
    }

    return updateCreds( prevState => ({ ...prevState , errors : { message : 'Enter Credentials!!' , status : true } }) );

  }

  const updateInputValue = (e,type) => updateCreds( prevState => ({ ...prevState , [type] : e.target.value }) )

  return (
    <Box display="flex" justifyContent="center" alignItems="center" my={3} p={2} mx="auto">
    <Card style={{ padding : 8 }}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe">
            L
          </Avatar>
        }
        title="User Login"
        titleTypographyProps={{ variant : 'h6' }}
      />
      <form onSubmit={authenticateUser}>
      <CardContent>
        <Box display="flex" flexDirection="column">
           <TextField
              placeholder="Username"
              size="small"
              variant="outlined"
              fullWidth={true}
              value={creds.username}
              onChange={(e) => updateInputValue(e,'username')}
              style={{ marginBottom : 16 }}
            />
            <TextField
              placeholder="Password"
              size="small"
              variant="outlined"
              type="password"
              value={creds.password}
              onChange={(e) => updateInputValue(e,'password')}
              fullWidth={true}
            />
            </Box>
        </CardContent>
        <CardActions disableSpacing>
        <Box px={1} width="100%">

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth={true}
            >
              Login
            </Button>
            </Box>
        </CardActions>
      </form>
      { creds.errors.status && <Typography variant="body2">
          <Box color="error.main"  textAlign="center">
            { creds.errors.message }
          </Box>
        </Typography> 
      }
    </Card>
    </Box>
  );
}
