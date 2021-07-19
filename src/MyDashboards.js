import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Chip,
  Button,
  Box,
  Typography,
  Grid,
} from "@material-ui/core";

import { useIndexedDB } from "react-indexed-db";
import useAuth , { ProvideAuth } from './Auth.Context';
import {loginContext} from './Login.Context';
import { DashboardPreview } from "./DashboardPreview";


export const MyDashboard = () => {

  const { user }  = useAuth();
  const { getByIndex, getAll, update, deleteRecord } = useIndexedDB("dashboards");

  const [myDashboards,updateMyDashboards] = React.useState([])

  React.useEffect(() => {
    if(user) {
      getAll().then( dashboards => {
        const filteredList = dashboards.filter( dashboard => dashboard.assigned_users.includes(user.username) )
        updateMyDashboards(filteredList);
      })
    }
  },[])


  return(
    <Box>
      { user && user.isAuthenticated &&  myDashboards.length > 0 ? myDashboards.map( dashboard => <span> <DashboardPreview  name={dashboard.name} components={dashboard.components}  /> </span> ) : <Typography variant="body1">No Dashboards Available.</Typography> }
      { !user && <Typography variant="body1"> User Need To Login </Typography> }
    </Box>
    )
}