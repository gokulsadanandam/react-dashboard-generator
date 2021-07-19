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

import { EditableComponent } from './Component';

export const ComponentManagement = () => {
  const [ComponentManagementState, updateComponentManagementState] =
    React.useState({
      components: [],
      loader: {
        status: true,
        message: "Fetching Available Data Source!!",
      },
      error: {
        status: false,
        message: "",
      },
      selectedComponent: {},
    });

  const { add, getAll, update, deleteRecord } = useIndexedDB("components");

  React.useEffect(() => {
    getAll().then((sources) => {
      updateComponentManagementState((prevState) => ({
        ...prevState,
        components: sources,
        loader: { message: "Components List Fetched!", status: false },
      }));
    });
  }, [ComponentManagementState.loader.status]);

  const AddNewComponent = async (component) => {
    if (component) {
      const event = await add(component);
      updateComponentManagementState((prevState) => ({
        ...prevState,
        loader: { message: "Updating Component List!", status: true },
      }));
    }
  };

  const EditComponent = async ({ name, data }) => {
    if (name) {
      const event = await update({
        ...ComponentManagementState.selectedComponent,
        name,
        data,
      });
      updateComponentManagementState((prevState) => ({
        ...prevState,
        selectedComponent: {},
        loader: { message: "Updating Component List!", status: true },
      }));
    }
  };

  const deleteComponent = async (Component) => {
    if (Component) {
      const event = await deleteRecord(
        ComponentManagementState.selectedComponent.id
      );
      updateComponentManagementState((prevState) => ({
        ...prevState,
        selectedComponent: {},
        loader: { message: "Updating Component List!", status: true },
      }));
    }
  };

  const resetSelectedComponentState = () => {
    updateComponentManagementState((prevState) => ({
      ...prevState,
      selectedComponent: {},
    }));
  };

  const updateSelectedComponent = (component) => {
    updateComponentManagementState((prevState) => ({
      ...prevState,
      selectedComponent: component,
    }));
  };

  return (
    <Grid container spacing={2} style={{ flexWrap: "nowrap" }}>
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
          onClick={() => resetSelectedComponentState()}
        >
          Create New Component
        </Button>
        <List
          component="nav"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Available Components
            </ListSubheader>
          }
        >
          {ComponentManagementState.components.map(
            ({ id, name, type, datasource }) => (
              <ListItem
                button
                selected={
                  id === ComponentManagementState.selectedComponent.id
                }
                onClick={() =>
                  updateSelectedComponent({ id, name, type, datasource })
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
        {!ComponentManagementState.selectedComponent.name && (
          <EditableComponent
            type="add"
            title="Add Component"
            onSubmit={AddNewComponent}
          />
        )}
        {!!ComponentManagementState.selectedComponent.name && (
          <EditableComponent
            type="edit"
            title="Edit Component"
            Component={ComponentManagementState.selectedComponent}
            onSubmit={EditComponent}
            deleteComponent={deleteComponent}
          />
        )}
      </Grid>
    </Grid>
  );
};
