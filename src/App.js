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
import SignInPage from './components/SignInPage';
import LoadingIndicator from './components/LoadingIndicatorPage';
import PModules from './components/PModules';


/**
 * TODO:
 * - check if you need nav route or can just conditionally route
 */

// conditional rendering if logged in
const NavSwitcher = () => {
  const { isSignedIn } = useAuth()
  const [value, setValue] = useState(1)
  const history = useHistory()

  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  console.log(value)

  // need to hide students from students
  const routes = ['/auth', '/', '/loading', '/profile', '/students', '/notifs', '/dashboard']
  return (
    <Box style={{ flexGrow: 1, bgColor: 'background.paper', display: 'flex', minHeight: '100vh' }}>
      {isSignedIn ? (
        <Tabs
          indicatorColor="primary"
          style={{ width: '200px' }}
          orientation="vertical"
          value={value}
          onChange={handleChange}
          sx={{ borderRight: 1, borderColor: 'divider', minHight: '100%' }}
        >
          <Tab label="Modules" icon={<PackageIcon size={24} />} {...a11yProps(0)} value={routes[1]} component={Link} to={routes[1]} />
          <Tab label="Loading" {...a11yProps(2)} value={routes[2]} component={Link} to={routes[2]} />
        </Tabs>
      ) : null}
      <div>
        <Switch>
          <PrivateRoute exact path="/" component={PModules} />
          <PrivateRoute exact path="/loading" component={LoadingIndicator} />
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
