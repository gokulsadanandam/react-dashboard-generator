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
import { DataSourceComponent } from "./DataSourceComponent";

import {loginContext} from './Login.Context';

export const DataSourceManagement = () => {
  const [DataSourceManagementState, updateDataSourceManagementState] =
    React.useState({
      dataSources: [],
      loader: {
        status: true,
        message: "Fetching Available Data Source!!",
      },
      error: {
        status: false,
        message: "",
      },
      selectedDataSource: {},
    });

  const { isAuthenticated , isUserAdmin , signin }  = React.useContext(loginContext);

  const { add, getAll, update, deleteRecord } = useIndexedDB("datasources");

  React.useEffect(() => {
    getAll().then((sources) => {
      updateDataSourceManagementState((prevState) => ({
        ...prevState,
        dataSources: sources,
        loader: { message: "Data Source List Fetched!", status: false },
      }));
    });
  }, [DataSourceManagementState.loader.status]);

  const AddNewDataSource = async (dataSource) => {
    if (dataSource) {
      const event = await add(dataSource);
      updateDataSourceManagementState((prevState) => ({
        ...prevState,
        loader: { message: "Updating DataSource List!", status: true },
      }));
    }
  };

  const EditDataSource = async ({ name, data }) => {
    if (name) {
      const event = await update({
        ...DataSourceManagementState.selectedDataSource,
        name,
        data,
      });
      updateDataSourceManagementState((prevState) => ({
        ...prevState,
        selectedDataSource: {},
        loader: { message: "Updating DataSource List!", status: true },
      }));
    }
  };

  const deleteDataSource = async (DataSource) => {
    if (DataSource) {
      const event = await deleteRecord(
        DataSourceManagementState.selectedDataSource.id
      );
      updateDataSourceManagementState((prevState) => ({
        ...prevState,
        selectedDataSource: {},
        loader: { message: "Updating DataSource List!", status: true },
      }));
    }
  };

  const resetSelectedDataSourceState = () => {
    updateDataSourceManagementState((prevState) => ({
      ...prevState,
      selectedDataSource: {},
    }));
  };

  const updateSelectedDataSource = (DataSource) => {
    updateDataSourceManagementState((prevState) => ({
      ...prevState,
      selectedDataSource: DataSource,
    }));
  };

  return (
    <Grid container style={{ flexWrap: "nowrap" }}>
      <Grid
        item
        lg={2}
        alignItems="center"
        direction="column"
        justifyContent="center"
      >
        <Button
          color="secondary"
          size="small"
          fullWidth
          style={{ textTransform: "none" }}
          variant="contained"
          onClick={() => resetSelectedDataSourceState()}
        >
          Create New DataSource
        </Button>
        <List
          component="nav"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Available DataSources
            </ListSubheader>
          }
        >
          {DataSourceManagementState.dataSources.map(
            ({ id, name, type, data }) => (
              <ListItem
                button
                selected={
                  id === DataSourceManagementState.selectedDataSource.id
                }
                onClick={() =>
                  updateSelectedDataSource({ id, name, type, data })
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
        {!DataSourceManagementState.selectedDataSource.name && (
          <DataSourceComponent
            type="add"
            title="Add DataSource"
            onSubmit={AddNewDataSource}
          />
        )}
        {!!DataSourceManagementState.selectedDataSource.name && (
          <DataSourceComponent
            type="edit"
            title="Edit DataSource"
            DataSource={DataSourceManagementState.selectedDataSource}
            onSubmit={EditDataSource}
            deleteDataSource={deleteDataSource}
          />
        )}
      </Grid>
    </Grid>
  );
};
