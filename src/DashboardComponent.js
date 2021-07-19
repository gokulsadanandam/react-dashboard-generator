import React from "react";

import {
  Box,
  TextField,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  Input,
  Grid,
  Button,
  RadioGroup,
  Typography,
  Radio,
  ListItemText,
  Select,
  Checkbox,
  MenuItem,
} from "@material-ui/core";

import { PreviewTable } from "./PreviewTable";
import { useIndexedDB } from "react-indexed-db";
import { DashboardPreview } from "./DashboardPreview";

export const DashboardComponent = (props) => {
  const [dashboard, updateDashboard] = React.useState({
    name: "",
    users: {
      list: [],
      selectedUser: [],
    },
    components: {
      list: [],
      selectedComponent: [],
    },
  });

  const {
    title = "Create Dashboard",
    onSubmit,
    Dashboard,
    type,
    deleteDashboard,
  } = props;

  const users = useIndexedDB("users");
  const components = useIndexedDB("components");

  React.useEffect(() => {
    if (type === "edit") {
      console.log(Dashboard);
      updateDashboard((prevState) => ({
        ...prevState,
        name: Dashboard.name,
        components: {
          ...prevState.components,
          selectedComponent: Dashboard.components,
        },
        users: { ...prevState.users, selectedUser: Dashboard.assigned_users },
      }));
    }
    users.getAll().then((users) => {
      updateDashboard((prevState) => ({
        ...prevState,
        users: { ...prevState.users, list: users },
        loader: { message: "User List Fetched!", status: false },
      }));
    });
    components.getAll().then((components) => {
      updateDashboard((prevState) => ({
        ...prevState,
        components: { ...prevState.components, list: components },
        loader: { message: "Components List Fetched!", status: false },
      }));
    });
  }, [Dashboard]);

  const updateState = (e, type) => {
    updateDashboard((prevState) => ({ ...prevState, [type]: e.target.value }));
  };

  const handleChange = (event) => {
    updateDashboard((prevState) => {
      return {
        ...prevState,
        components: {
          ...prevState.components,
          selectedComponent: event.target.value,
        },
      };
    });
  };

  const handleUserSelection = (e) => {
    updateDashboard((prevState) => {
      return {
        ...prevState,
        users: { ...prevState.users, selectedUser: e.target.value },
      };
    });
  };

  const isTypeEdit = () => (type === "edit" ? true : false);

  return (
    <Container>
      <Typography variant="body1" gutterBottom>
        {title}
      </Typography>
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            name: dashboard.name,
            components: dashboard.components.selectedComponent,
            assigned_users: dashboard.users.selectedUser,
          });
          updateDashboard((prevState) => ({
            name: "",
            type: "default_option",
            data: null,
            users: {
              list: [],
              selectedUser: [],
            },
            components: {
              list: [],
              selectedComponent: [],
            },
          }));
        }}
      >
        <Box m={1}>
          <Grid container spacing={1}>
            <Box m={1}>
              <Grid container spacing={2}>
                <Grid item>
                  <TextField
                    id="dashboardname"
                    placeholder="Dashboardname"
                    value={dashboard.name}
                    onChange={(e) => updateState(e, "name")}
                    variant="outlined"
                    size="small"
                    disabled={isTypeEdit()}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    select
                    size="small"
                    variant="outlined"
                    label="Select Components"
                    style={{ minWidth: 240 }}
                    SelectProps={{
                      multiple: true,
                      value: dashboard.components.selectedComponent,
                      renderValue: (selected) => selected.join(", "),
                    }}
                    onChange={handleChange}
                    // disabled={isTypeEdit()}
                  >
                    {dashboard.components.list.map((component) => (
                      <MenuItem key={component.name} value={component.name}>
                        <Checkbox
                          checked={
                            dashboard.components.selectedComponent.indexOf(
                              component.name
                            ) > -1
                          }
                        />
                        <ListItemText primary={component.name} />
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item>
                  <TextField
                    select
                    size="small"
                    variant="outlined"
                    label="Assign Users"
                    style={{ minWidth: 240 }}
                    SelectProps={{
                      multiple: true,
                      value: dashboard.users.selectedUser,
                      renderValue: (selected) => selected.join(", "),
                    }}
                    onChange={handleUserSelection}
                    // disabled={isTypeEdit()}
                  >
                    {dashboard.users.list.map((user) => (
                      <MenuItem key={user.username} value={user.username}>
                        <Checkbox
                          checked={
                            dashboard.users.selectedUser.indexOf(
                              user.username
                            ) > -1
                          }
                        />
                        <ListItemText primary={user.username} />
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Box>
            <Grid container style={{ margin: 8 }} spacing={2}>
              <Grid item>
                <Button
                  color="secondary"
                  fullWidth
                  variant="contained"
                  size="small"
                  type="submit"
                  style={{ textTransform: "none" }}
                >
                  {title}
                </Button>
              </Grid>
              {isTypeEdit() && (
                <Grid item>
                  <Button
                    color="primary"
                    fullWidth
                    variant="contained"
                    size="small"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteDashboard(dashboard);
                      updateDashboard((prevState) => ({
                        ...prevState,
                        dashboardname: "",
                        password: "",
                        role: "",
                      }));
                    }}
                    style={{ textTransform: "none" }}
                  >
                    Delete Dashboard
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Box>
      </form>
      {dashboard && dashboard.components.selectedComponent && (
        <DashboardPreview
          name={dashboard.name}
          components={dashboard.components.list.filter((component) =>
            dashboard.components.selectedComponent.includes(component.name)).map( ({name}) => name)}
        />
      )}
    </Container>
  );
};
