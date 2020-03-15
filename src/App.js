import React, { Suspense, useState, useCallback } from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

// import Users from './user/pages/Users';
// import UserPlaces from './places/pages/UserPlaces';
// import NewPlace from './places/pages/NewPlace';
// import UpdatePlace from './places/pages/UpdatePlace';
// import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

const Users = React.lazy(()=>import('./user/pages/Users'));
const UserPlaces = React.lazy(()=>import('./places/pages/UserPlaces'));
const NewPlace = React.lazy(()=>import('./places/pages/NewPlace'));
const UpdatePlace = React.lazy(()=>import('./places/pages/UpdatePlace'));
const Auth = React.lazy(()=>import('./user/pages/Auth'));

const App = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(null);
  const login = useCallback((uid, token) => {
    setUserId(uid);
    setToken(token);
  }, []);

  const logout = useCallback(() => {
    setUserId(null);
    setToken(null);
  }, []);

  let routes;

  if(token){
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider value={{isLoggedIn: !!token, token, userId, login, logout}}>
      <Router>
        <MainNavigation />
        <main>
          <Suspense fallback={<div className="center"><LoadingSpinner/></div>}>
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
