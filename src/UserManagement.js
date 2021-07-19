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
import { UserComponent } from "./UserComponent";
export const UserManagement = () => {
  const [UserManagementState, updateUserManagementState] = React.useState({
    users: [],
    loader: {
      status: true,
      message: "Fetching Users!!",
    },
    error: {
      status: false,
      message: "",
    },
    selectedUser: {},
  });

  React.useEffect(() => {
    getAll().then((users) => {
      updateUserManagementState((prevState) => ({
        ...prevState,
        users,
        loader: { message: "User List Fetched!", status: false },
      }));
    });
  }, [UserManagementState.loader.status]);

  const { add, getAll , update , deleteRecord  } = useIndexedDB("users");

  const AddNewUser = async (user) => {
    if (user) {
      const event = await add(user);
      updateUserManagementState((prevState) => ({
        ...prevState,
        loader: { message: "Updating User List!", status: true },
      }));
    }
  };

  const EditUser = async ({role}) => {
    if(role) {
      const event = await update({  ...UserManagementState.selectedUser , role })
      updateUserManagementState((prevState) => ({
        ...prevState,
        selectedUser : {},
        loader: { message: "Updating User List!", status: true },
      }));
    }
  }

  const deleteUser = async (user) => {
    if(user) {
      const event = await deleteRecord (UserManagementState.selectedUser.id)
      updateUserManagementState((prevState) => ({
        ...prevState,
        selectedUser : {},
        loader: { message: "Updating User List!", status: true },
      }));
    }
  }


  const resetSelectedUserState = () => {
    updateUserManagementState((prevState) => ({
      ...prevState,
      selectedUser: {},
    }));
  };

  const updateSelectedUser = (user) => {
    updateUserManagementState((prevState) => ({
      ...prevState,
      selectedUser: user,
    }));
  };




  return (
    <Grid container>
      <Grid
        item
        lg={1.5}
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
          onClick={() => resetSelectedUserState()}
        >
          Create New User
        </Button>
        <List
          component="nav"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Available Users
            </ListSubheader>
          }
        >
          {UserManagementState.users.map(({ id ,  username, role, password }) => (
            <ListItem
              button
               selected={id === UserManagementState.selectedUser.id}
              onClick={() => updateSelectedUser({ id , username, role, password })}
            >
              <ListItemText>
                <Box mr={1} component="span">
                  <Typography variant="body1" component="span">
                    {username}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={role}
                  color={role === "admin" ? "primary" : "secondary"}
                />
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item>
        {!UserManagementState.selectedUser.username && (
          <UserComponent type="add" title="Add User" onSubmit={AddNewUser} />
        )}
        {!!UserManagementState.selectedUser.username && (
          <UserComponent
            type="edit"
            title="Edit User"
            User={UserManagementState.selectedUser}
            onSubmit={EditUser}
            deleteUser={deleteUser}
          />
        )}
      </Grid>
    </Grid>
  );
};
