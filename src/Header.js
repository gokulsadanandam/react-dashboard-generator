import React from "react";
import { AppBar, Toolbar, Box, IconButton , Button , Link } from "@material-ui/core";
import { Link as NavigationLink } from "react-router-dom";
import { Contactless, ExitToApp, AccountCircle } from "@material-ui/icons";

import {loginContext} from './Login.Context';
import { useHistory } from 'react-router-dom';

import useAuth , { ProvideAuth } from './Auth.Context';


export const Header = () => {

  const { user , signout }  = useAuth();
  const history = useHistory()


  return (
    <AppBar elevation={0}>
      <Toolbar>
        <IconButton
          component={NavigationLink}
          edge="start"
          color="inherit"
        >
          <Contactless />
        </IconButton>
        <Box mx={1}>
            <Link
              color="inherit"
              variant="body1"
              component={NavigationLink}
              to="/my-dashboard"
              underline="none"
            >
              My Dashboards
            </Link>
        </Box>
        <Box display="flex">
          { user && user.role == "admin" && <Box mx={1}>
            <Link
              color="inherit"
              variant="body1"
              component={NavigationLink}
              to="/datasources"
              underline="none"
            >
              DataSources
            </Link>
          </Box>}
          { user && user.role == "admin" && <Box mx={1}>
            <Link
              color="inherit"
              variant="body1"
              component={NavigationLink}
              to="/components"
              underline="none"
            >
              Components
            </Link>
          </Box>}
          { user && user.role == "admin" && <Box mx={1}>
            <Link
              color="inherit"
              variant="body1"
              component={NavigationLink}
              to="/usermanagement"
              underline="none"
            >
              User Management
            </Link>
          </Box>}
          { user && user.role == "admin" && <Box mx={1}>
            <Link
              color="inherit"
              variant="body1"
              component={NavigationLink}
              to="/dashboard"
              underline="none"
            >
              Dashboard Management
            </Link>
          </Box>}
        </Box>
        { !user && <Box ml="auto">
           <Button edge="end" color="secondary" variant="contained" onClick={() => history.push('/') }>
            Go To Login Screen
          </Button>
        </Box>}
        { user && user.isAuthenticated && <Box ml="auto">
           <Button edge="end" color="secondary" variant="contained" onClick={() => signout( () => history.push('/') )}>
           LogOut
          </Button>
        </Box>}
      </Toolbar>
    </AppBar>
  )
}
