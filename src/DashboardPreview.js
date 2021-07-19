import React from "react";
import { useIndexedDB } from "react-indexed-db";
import { Responsive, WidthProvider } from "react-grid-layout";
import GridLayout from 'react-grid-layout';

import "./DashboardPreview.css";

import { SimpleLineChartPreview } from './SimpleLineChartPreview';

import {
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

export const DashboardPreview = ({ name, components }) => {
  const datasources = useIndexedDB("datasources");
  const componentsDb = useIndexedDB("components");
  const ResponsiveReactGridLayout = WidthProvider(Responsive);
  const [dashboard, updateDashboard] = React.useState({
    data: [],
  });

  React.useEffect( async () => {
    const sourcesList = await datasources.getAll()
    const componentsList = await componentsDb.getAll()
      const filteredData = componentsList.filter( ({name}) => components.includes(name) ).map( component => ({ ...component , data :  sourcesList.filter( d => d.name === component.datasource ).map( ({data}) => data ).flat()}) )
      console.log(componentsList)
      updateDashboard((prevState) => ({
        ...prevState,
        data: filteredData,
      }));
  }, [components]);

  const opts = {
    compactType: "horizontal",
    mounted: false,
  };

  const renderComponent = (type,data,name,i) => {
    switch(type){
      case 'table':
      return  <PreviewTable
                  key={`${new Date().getTime()}-${i}`}
                  title={`Preview Table - ${name}`}
                  rows={data}
                  totalRows={3}
                  totalCols={3}
                  column={Object.keys(data[0])}
                />
      case "simple_line_chart":
      return <SimpleLineChartPreview 
                  key={`${new Date().getTime()}-${i}`}
                  title={`Preview Chart - ${name}`} 
                  data={data}
              />
    }

  }


  return (
    <>
    {console.log(dashboard)}
    <Typography variant="h6">
      {name.toUpperCase()}
    </Typography>
    <ResponsiveReactGridLayout
      measureBeforeMount={false}
      useCSSTransforms={opts.mounted}
      compactType={opts.compactType}
      preventCollision={!opts.compactType}
    >

      { dashboard.data.map ( (d,i) => <div
                key={`${new Date().getTime()}-${i}`}
                data-grid={{
                  x: i * 3,
                  y: 0,
                  w: 3,
                  h: 2,
                  static: false,
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 8,
                }}
              >
                {renderComponent(d.type,d.data,d.name,i)}
               
              </div>  )}


    </ResponsiveReactGridLayout>
    </>
  );
};
