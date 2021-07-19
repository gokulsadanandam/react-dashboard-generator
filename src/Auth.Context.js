import React , { createContext , useContext , useState } from "react";

const authContext = createContext();

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
    fakeAuth.username = '';
    setTimeout(cb, 100);
  }
};


function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signin = (username , role , cb) => {
    return fakeAuth.signin(username , role , () => {
    console.log(username,role)
      setUser({ username  , role , isAuthenticated : true , isUserLoggedIn : true });
      cb();
    });
  };

  const signout = cb => {
    return fakeAuth.signout(() => {
      setUser(null);
      cb();
    });
  };

  return {
    user,
    signin,
    signout
  };
}

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

export default function useAuth() {
  return useContext(authContext);
}