import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink
} from "react-router-dom";
import PrivateRoute from './PrivateRoute'
import NavRoute from './NavRoute'
import { AuthProvider, useAuth } from './contexts/AuthContext';

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
  console.log('current')
  console.log(isSignedIn)
  return isSignedIn ? (
    <>
      <div>testaeteat</div>
      <Switch>

        {/* DEBUG private route */}

        <PrivateRoute exact path="/" component={PModules} />

        <Route path="/auth" component={SignInPage} />
      </Switch>
    </>
  ) : (
    <Switch>

      {/* DEBUG private route */}

      <PrivateRoute exact path="/" component={PModules} />

      <Route path="/auth" component={SignInPage} />
    </Switch>
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
