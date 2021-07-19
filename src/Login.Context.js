import React , {useState} from 'react';

const fakeAuth = {
  isAuthenticated: false,
  isUserAdmin : false , 
  username : '' ,
  signin(userName,userRole,cb) {
    fakeAuth.isAuthenticated = true;
    fakeAuth.isUserAdmin = false;
    fakeAuth.username = userName;
    if(userRole == "admin") {
      fakeAuth.isUserAdmin = true;
    }
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    fakeAuth.isUserAdmin = false;
    setTimeout(cb, 100);
  }
};

export const loginContext = React.createContext(fakeAuth)
