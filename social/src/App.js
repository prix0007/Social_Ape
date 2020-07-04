import React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import themeFile from './util/theme'
import jwtDecode from 'jwt-decode';
import axios from 'axios';
//Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import {logoutUser,  getUserData } from "./redux/actions/userActions";

import './App.css';

//Components
import Navbar from './components/layout/Navbar';
import AuthRoute from './util/AuthRoute'


//pages
import home from './pages/home';
import signup from './pages/signup';
import login from './pages/login';
import user from './pages/user';

axios.defaults.baseURL = 'https://us-central1-social-bed95.cloudfunctions.net/api'


const theme = createMuiTheme(themeFile);

const token = localStorage.FBIdToken
if(token) {
  const decodeToken = jwtDecode(token);
  if(decodeToken.exp*1000 < Date.now()){
    store.dispatch(logoutUser())
    window.location.href = '/login'
    
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData())
  }
}

function App() {
  return (
      <MuiThemeProvider theme={theme}>
        <Provider store = {store}>
            <Router>
              <Navbar />
              <div className="container">
                <Switch>
                  <Route exact path="/" component={home} />
                  <AuthRoute exact path="/login" component={login}  />
                  <AuthRoute exact path="/signup" component={signup}  />
                  <Route exact path="/users/:handle" component={user} />
                  <Route exact path="/users/:handle/scream/:screamId" component={user} />
                </Switch>
              </div>
            </Router>
        </Provider>
      </MuiThemeProvider>
  );
}

export default App;
