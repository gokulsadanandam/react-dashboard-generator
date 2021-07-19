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

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { SimpleLineChartPreview } from './SimpleLineChartPreview';

import { PreviewTable } from "./PreviewTable";
import { useIndexedDB } from "react-indexed-db";

export const EditableComponent = (props) => {
  const [component, updateComponent] = React.useState({
    name: "",
    type: "default_option",
    data: [],
    selectedDataSource : { data : [] , id : null , name : "default_option" , type : null },
    datasource : null,
    id : null
  });

  const {
    title = "Create Component",
    onSubmit,
    Component,
    type
  } = props;

  const {  getAll , getByIndex  } = useIndexedDB("datasources");

  React.useEffect(() => {
    if (type === "edit") {
      getByIndex('name',Component.datasource).then( selectedDataSource => {
        updateComponent( prevState =>  ({ ...prevState , ...Component , selectedDataSource  }) ) 
      });
    }
     getAll().then((sources) => {
      updateComponent((prevState) => ({
        ...prevState,
        data: sources,
        loader: { message: "Data Source List Fetched!", status: false },
      }));
    })
  },[Component]);

  const updateState = (e, type) => {
    updateComponent((prevState,nextState) => {
      return { ...prevState, [type]: e.target.value } 
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
          onSubmit({ name : component.name , datasource : component.selectedDataSource.name , type : component.type });
          updateComponent((prevState) => ({
            ...prevState,
          name: "",
          type: "default_option",
          data: [],
          selectedDataSource : { data : [] , id : null , name : "default_option" , type : null }
  }
  ));
        }}
      >
        <Box m={1}>
          <Grid container spacing={1}>
            <Box m={1}>
              <Grid container spacing={2}>
                <Grid item>
                  <TextField
                    id="componentname"
                    placeholder="Componentname"
                    value={component.name}
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
                    placeholder="Select a Component Type"
                    SelectProps={{
                      value: component.type,
                    }}
                    onChange={(e) => updateState(e, "type")}
                    disabled={isTypeEdit()}
                  >
                    <MenuItem value={"default_option"} disabled>
                      Select a Component Type
                    </MenuItem>
                    <MenuItem value={"table"}>Table</MenuItem>
                    <MenuItem value={"simple_line_chart"}>SimpleLineChart</MenuItem>
                  </TextField>
                </Grid>
                <Grid item>
                  <TextField
                    select
                    size="small"
                    variant="outlined"
                    placeholder="Select a Component Type"
                    SelectProps={{
                      value: component.selectedDataSource.id != null ? component.selectedDataSource : "default_option",
                    }}
                    onChange={(e) => updateState(e, "selectedDataSource")}
                    disabled={isTypeEdit()}
                  >
                    <MenuItem value="default_option" disabled>
                      Select a Data Source
                    </MenuItem>
                    {component.data.map( option => {
                      return <MenuItem value={option}>{option.name}</MenuItem>
                    } )}
                    { isTypeEdit() && <MenuItem value={component.selectedDataSource} disabled>
                      {component.selectedDataSource.name}
                    </MenuItem> }

                  </TextField>
                </Grid>
              </Grid>
            </Box>
            <Grid container style={{ margin: 8 }} spacing={2}>
              <Grid item>
              {!isTypeEdit() && (
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
                )}
              </Grid>
              {isTypeEdit() && (
                <Grid item>
                  {/*<Button
                    color="primary"
                    fullWidth
                    variant="contained"
                    size="small"
                    onClick={(e) => {
                      e.preventDefault();
                      Component(component);
                      Component((prevState) => ({
                        ...prevState,
                        componentname: "",
                        password: "",
                        role: "",
                      }));
                    }}
                    style={{ textTransform: "none" }}
                  >
                    Delete Component
                  </Button> */}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Box>
      </form>
      {component && component.data && (
        <Grid container>
          <Grid item>
          {
            component.type == "table" && component.selectedDataSource.data.length > 0 &&
            <PreviewTable
              rows={component.selectedDataSource.data}
              column={Object.keys(component.selectedDataSource.data[0])}
            />
            }
           {
             component.type == "simple_line_chart" && component.selectedDataSource.data.length > 0 &&
             <SimpleLineChartPreview data={component.selectedDataSource.data} />
            }

          </Grid>
        </Grid>
      )}
    </Container>
  );
};
