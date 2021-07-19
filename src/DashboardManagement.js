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

import {DashboardComponent} from './DashboardComponent'

export const DashboardManagement = () => {
  const [DashboardManagementState, updateDashboardManagementState] =
    React.useState({
      dashboards: [],
      loader: {
        status: true,
        message: "Fetching Available Data Source!!",
      },
      error: {
        status: false,
        message: "",
      },
      selectedDashboard: {},
    });

  const { add, getAll, update, deleteRecord } = useIndexedDB("dashboards");

  React.useEffect(() => {
    getAll().then( dashboards => {
      updateDashboardManagementState((prevState) => ({
        ...prevState,
        dashboards ,
        loader: { message: "Dashboards List Fetched!", status: false },
      }));
    });
  }, [DashboardManagementState.loader.status]);

  const AddNewDashboard = async (dashboard) => {
    if (dashboard) {
      const event = await add(dashboard);
      updateDashboardManagementState((prevState) => ({
        ...prevState,
        loader: { message: "Updating Dashboard List!", status: true },
      }));
    }
  };

  const EditDashboard = async ({ name, components , assigned_users }) => {
    if (name) {
      const event = await update({
        ...DashboardManagementState.selectedDashboard,
        components,
        assigned_users
      });
      updateDashboardManagementState((prevState) => ({
        ...prevState,
        selectedDashboard: {},
        loader: { message: "Updating Dashboard List!", status: true },
      }));
    }
  };

  const deleteDashboard = async (Dashboard) => {
    if (Dashboard) {
      const event = await deleteRecord(
        DashboardManagementState.selectedDashboard.id
      );
      updateDashboardManagementState((prevState) => ({
        ...prevState,
        selectedDashboard: {},
        loader: { message: "Updating Dashboard List!", status: true },
      }));
    }
  };

  const resetSelectedDashboardState = () => {
    updateDashboardManagementState((prevState) => ({
      ...prevState,
      selectedDashboard: {},
    }));
  };

  const updateSelectedDashboard = (component) => {
    updateDashboardManagementState((prevState) => ({
      ...prevState,
      selectedDashboard: component,
    }));
  };

  return (
    <Grid container spacing={2} style={{ flexWrap: "nowrap" }}>
      <Grid
        item
        lg={2}
      >
        <Button
          color="secondary"
          size="small"
          fullWidth
          style={{ textTransform: "none" }}
          variant="contained"
          onClick={() => resetSelectedDashboardState()}
        >
          Create New Dashboard
        </Button>
        <List
          component="nav"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Available Dashboards
            </ListSubheader>
          }
        >
          {DashboardManagementState.dashboards.map(
            ({ id, name, components , assigned_users },index) => (
              <ListItem
                key={`ds-mgmt-list-${index}`}
                button
                selected={
                  id === DashboardManagementState.selectedDashboard.id
                }
                onClick={() =>
                  updateSelectedDashboard({ id, name, components , assigned_users })
                }
              >
                <ListItemText>
                  <Box mr={1} component="span">
                    <Typography variant="body1" component="span">
                      {name}
                    </Typography>
                  </Box>
                </ListItemText>
              </ListItem>
            )
          )}
        </List>
      </Grid>
      <Grid item lg={10}>
        {!DashboardManagementState.selectedDashboard.name && (
          <DashboardComponent
            type="add"
            title="Add Dashboard"
            onSubmit={AddNewDashboard}
          />
        )}
        {!!DashboardManagementState.selectedDashboard.name && (
          <DashboardComponent
            type="edit"
            title="Edit Dashboard"
            Dashboard={DashboardManagementState.selectedDashboard}
            onSubmit={EditDashboard}
            deleteDashboard={deleteDashboard}
          />
        )}
      </Grid>
    </Grid>
  );
};
