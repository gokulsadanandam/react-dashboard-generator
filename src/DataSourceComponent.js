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
  Select,
  MenuItem,
  InputLabel,
} from "@material-ui/core";

import { PreviewTable } from "./PreviewTable";

import {loginContext} from './Login.Context';


export const DataSourceComponent = (props) => {
  const [dataSource, updateDataSource] = React.useState({
    name: "",
    type: "default_option",
    data: null,
  });

  const {
    title = "Create DataSource",
    onSubmit,
    DataSource,
    type,
    deleteDataSource,
  } = props;

  React.useEffect(() => {
    if (type === "edit") {
      updateDataSource(DataSource);
    }
  }, [DataSource]);

  const context  = React.useContext(loginContext);


  const updateState = (e, type) => {
    updateDataSource((prevState) => ({ ...prevState, [type]: e.target.value }));
  };

  const captureFileData = (e) => {
    let FileReaderCursor = new FileReader();
    FileReaderCursor.onloadend = (data) => {
      try {

      let parsedRecords = JSON.parse(data.target.result);
      if (parsedRecords && parsedRecords.length) {
        updateDataSource((prevState) => ({
          ...prevState,
          data: parsedRecords,
        }));
      }
      }
      catch(e) {
        alert("Error Occured While Parsing JSON File. Please Valiate JSON before uploading.")      
      }
    };

    if (e.target.files[0]) {
      let fileData = e.target.files[0];
      let extension = fileData.name.split(".").pop().toLowerCase();
      if (extension != "json") {
        return alert("Only Json File Supported!!");
      }
      FileReaderCursor.readAsText(fileData);
    }
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
          onSubmit(dataSource);
          updateDataSource((prevState) => ({
            ...prevState,
            name: "",
            data: null,
            type: "default_option",
          }));
        }}
      >
        <Box m={1}>
          <Grid container spacing={1}>
            <Box m={1}>
              <Grid container spacing={2}>
                <Grid item>
                  <TextField
                    id="dataSourcename"
                    placeholder="DataSourcename"
                    value={dataSource.name}
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
                    placeholder="Select a DataSource Type"
                    SelectProps={{
                      value: dataSource.type,
                    }}
                    onChange={(e) => updateState(e, "type")}
                    disabled={isTypeEdit()}
                  >
                    <MenuItem value={"default_option"} disabled>
                      Select a DataSource Type
                    </MenuItem>
                    <MenuItem value={"rest_api"}>Rest API</MenuItem>
                    <MenuItem value={"graphql_api"} disabled>
                      GraphQL API
                    </MenuItem>
                    <MenuItem value={"soap_api"} disabled>
                      SOAP API
                    </MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Box>
            <Grid container style={{ margin: 8 }} spacing={2}>
              <Grid item>
                <Button
                  variant="contained"
                  component="label"
                  color="primary"
                  fullWidth
                  size="small"
                  style={{ textTransform: "none" }}
                >
                  Upload File
                  <input type="file" hidden onChange={captureFileData} />
                </Button>
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
                      deleteDataSource(dataSource);
                      updateDataSource((prevState) => ({
                        ...prevState,
                        dataSourcename: "",
                        password: "",
                        role: "",
                      }));
                    }}
                    style={{ textTransform: "none" }}
                  >
                    Delete DataSource
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Box>
      </form>
      {dataSource && dataSource.data && (
        <Grid container>
          <Grid item>

            <PreviewTable
              rows={dataSource.data}
              column={Object.keys(dataSource.data[0])}
            />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};
