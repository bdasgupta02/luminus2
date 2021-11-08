import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  useHistory
} from "react-router-dom";
import PrivateRoute from './PrivateRoute'
import NavRoute from './NavRoute'
import { Container, Row, Col } from 'react-grid-system';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Tabs, Tab, Typography, Box, Grow } from '@mui/material';
import { PackageIcon, GraphIcon } from '@primer/octicons-react';

// pages
import NavBar from './components/Navbar';
import SignInPage from './components/SignInPage';
import PModules from './components/PModules';
import PStudents from './components/PStudents'
import PProfessors from './components/PProfessors'
import PThreadView from './components/PThreadView'
import PModuleView from './components/PModuleView'
import PNotifs from './components/PNotifs'
import PProfileView from './components/PProfileView'
import PMyProfileView from './components/PMyProfileView';
import PYourThreads from './components/PYourThreads'


// conditional rendering if logged in
const NavSwitcher = () => {
  const { isSignedIn } = useAuth()

  // need to hide students from students
  return (
    <Box style={{ flexGrow: 1, bgColor: 'background.paper', display: 'flex', minHeight: '100vh' }}>
      {isSignedIn && (<NavBar />)}
      <div style={{ width: '100%', overflow: 'auto' }}>
        <Switch>
          <PrivateRoute exact path="/" component={PModules} />
          <PrivateRoute exact path="/my_threads" component={PYourThreads} />
          <PrivateRoute exact path="/students" component={PStudents} />
          <PrivateRoute exact path="/professors" component={PProfessors} />
          <PrivateRoute exact path="/view_module" component={PModuleView} />
          <PrivateRoute exact path="/view_module/view_thread" component={PThreadView} />
          <PrivateRoute exact path="/my_profile" component={PMyProfileView} />
          <PrivateRoute exact path="/view_profile" component={PProfileView} />
          <PrivateRoute exact path="/notifs" component={PNotifs} />
          <Route path="/auth" component={SignInPage} />
        </Switch>
      </div>
    </Box>
  )
}


function App() {


  return (
    <Router>
      <AuthProvider>
        <NavSwitcher />
      </AuthProvider>
    </Router>
  );
}

export default App;
