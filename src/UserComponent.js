import React from "react";

import {
  Box,
  TextField,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Button,
  RadioGroup,
  Typography,
  Radio,
} from "@material-ui/core";

export const UserComponent = (props) => {
  const [user, updateUser] = React.useState({
    username: "",
    password: "",
    role: "",
  });

  const { title = "Create User", onSubmit, User, type, deleteUser } = props;

  React.useEffect(() => {
    if (type === "edit") {
      updateUser(User);
    }
  }, [User]);

  const updateState = (e, type) => {
    updateUser((prevState) => ({ ...prevState, [type]: e.target.value }));
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
          onSubmit(user);
          updateUser((prevState) => ({
            ...prevState,
            username: "",
            password: "",
            role: "",
          }));
        }}
      >
        <Box m={1}>
          <Grid container spacing={1}>
            <Box m={1}>
              <Grid container spacing={2}>
                <Grid item>
                  <TextField
                    id="username"
                    placeholder="Username"
                    value={user.username}
                    onChange={(e) => updateState(e, "username")}
                    variant="outlined"
                    size="small"
                    disabled={isTypeEdit()}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    id="password"
                    placeholder="Password"
                    type="password"
                    value={user.password}
                    onChange={(e) => updateState(e, "password")}
                    variant="outlined"
                    size="small"
                    disabled={isTypeEdit()}
                  />
                </Grid>
              </Grid>
            </Box>
            <Grid container>
              <Box m={1}>
                <Grid item>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">User Role</FormLabel>
                    <RadioGroup
                      aria-label="role"
                      name="role"
                      value={user.role}
                      onChange={(e) => updateState(e, "role")}
                      row
                    >
                      <FormControlLabel
                        value="admin"
                        control={<Radio size="small" />}
                        label="Admin"
                      />
                      <FormControlLabel
                        value="user"
                        control={<Radio size="small" />}
                        label="User"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Box>
            </Grid>
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
                    deleteUser(user);
                    updateUser((prevState) => ({
                      ...prevState,
                      username: "",
                      password: "",
                      role: "",
                    }));
                  }}
                  style={{ textTransform: "none" }}
                >
                  Delete User
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
      </form>
    </Container>
  );
};
