import React from "react";
import "./styles.css";

// import { DBConfig } from "./DbConfig";
import { Box , Typography } from "@material-ui/core";
import { BrowserRouter as Router , Redirect, Switch, Route } from "react-router-dom";
import { Header } from "./Header";

import { Login } from "./Login";

import { UserManagement } from "./UserManagement";
import { DataSourceManagement } from "./DataSource";
import { ComponentManagement } from "./ComponentsManagement";
import { DashboardManagement } from "./DashboardManagement";
import { MyDashboard } from "./MyDashboards";

import { initDB, IndexedDB } from "react-indexed-db";

import {loginContext} from './Login.Context';

import useAuth , { ProvideAuth } from './Auth.Context';

let DBConfig = {
  name: "TechChallenge",
  version: 5,
  objectStoresMeta: [
    {
      store: "users",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "username", keypath: "username", options: { unique: true } },
        { name: "password", keypath: "password", options: { unique: false } },
        { name: "role", keypath: "role", options: { unique: false } },
      ],
    },
    {
      store: "datasources",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "name", keypath: "name", options: { unique: true } },
        { name: "type", keypath: "type", options: { unique: false } },
        { name: "path", keypath: "path", options: { unique: true } },
        { name: "dataset", keypath: "dataset", options: { unique: false } },
      ],
    },
    {
      store: "components",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "name", keypath: "name", options: { unique: true } },
        { name: "type", keypath: "type", options: { unique: false } },
        { name: "datasource", keypath: "datasource", options: { unique: false } },
        { name: "config", keypath: "config", options: { unique: false } },
      ],
    },
    {
      store: "dashboards",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "name", keypath: "name", options: { unique: true } },
        { name: "components", keypath: "components", options: { unique: false } },
        { name: "assigned_users", keypath: "assigned_users", options: { unique: false } },
      ],
    }
  ],
};

initDB(DBConfig);

function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user && auth.user.role =="admin" ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
            }}
          />
        )
      }
    />
  );
}

export default function App() {


  return (
    <ProvideAuth>
    <Router basename="/react-dashboard-generator">
      <Header />
      <Box style={{ marginTop: 72 }}>
        <Switch>
          <PrivateRoute path="/datasources">
                <DataSourceManagement />
          </PrivateRoute>
          <PrivateRoute  path="/usermanagement">
              <UserManagement />
          </PrivateRoute>
          <PrivateRoute path="/components">
              <ComponentManagement/>
          </PrivateRoute>
          <PrivateRoute path='/dashboard'>
              <DashboardManagement/>
          </PrivateRoute>
          <Route path='/my-dashboard'>
            <MyDashboard />
          </Route>
          <Route path="/">
            <Login/>
          </Route>
        </Switch>
      </Box>
    </Router>
    </ProvideAuth>
  );
}
