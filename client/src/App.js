import { BrowserRouter, Route, Switch } from "react-router-dom";
import { React } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from "./components/Profile";
import AddAccount from "./components/AddAccount";
import ViewAccounts from "./components/ViewAccounts";
import EditAccount from "./components/EditAccount";
import LandHoldings from "./components/LandHoldings";
import EditHolding from "./components/EditHolding";
import NavBar from "./components/NavBar";
import Signup from "./components/SignUp";
import Login from "./components/Login";
import UpdateProfile from "./components/UpdateProfile";
import ForgotPassword from "./components/ForgotPassword";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider} from "./contexts/AuthContext";

export default function App() {

  return (
    <>
    <AuthProvider>
      <BrowserRouter>
      <NavBar/>
        <Switch>
          <PrivateRoute component={AddAccount} path='/add-account' />
          <PrivateRoute component={ViewAccounts} path='/view-accounts' />
          <PrivateRoute component={EditAccount} path='/edit-account/:id' />
          <PrivateRoute component={LandHoldings} path='/land-holdings/:id' />
          <PrivateRoute component={EditHolding} path='/edit-holding/:id' />
          <PrivateRoute component={Profile} path='/profile' />
          <PrivateRoute component={UpdateProfile} path='/update-profile' />
          <Route component={Signup} path='/signup' />
          <Route component={Login} path='/login' />
          <Route component={ForgotPassword} path='/forgot-password' />
        </Switch>
      </BrowserRouter>
      </AuthProvider>
  </>
  );
}