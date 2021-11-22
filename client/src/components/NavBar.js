import {React, useState, useEffect} from "react";
import { NavLink } from "react-router-dom";
import './NavBar.css';
import { useAuth } from '../contexts/AuthContext';
import { AiOutlineUserAdd } from 'react-icons/ai';

export default function NavBar(props) {

  const {currentUser} = useAuth();
  const [currentUserName, setCurrentUserName] = useState("");
  const [img2, setImg2] = useState({});

  useEffect(() => {
    if (currentUser !== null) {
      setTimeout(() => {
        setCurrentUserName(currentUser.displayName);
      }, 500);
    }
  }, [currentUser]);

  return (
    <header className="navbar">
      <div className="container flex navbar-content">
          <div className="site-title">
              Phoenix Capital Group
          </div>
          <NavLink
              to="/add-account"
              activeClassName="active"
              className="navlink-title"
          >
              Add an Account
          </NavLink>
          <NavLink
              to="/view-accounts"
              activeClassName="active"
              className="navlink-title"
          >
              View Accounts
          </NavLink>
          {!currentUser &&
          <NavLink
            to="/login"
            activeClassName="active"
            className="navlink-title"
          >
            <AiOutlineUserAdd size={18} className="sign-in-icon"/>
            <span className="sign-in">Sign In</span>
          </NavLink>
        }
        {currentUser &&
          <NavLink
            to="/profile"
            activeClassName="active"
            className="navlink-title"
          >
            <span className="username">{currentUserName}</span>
          </NavLink>
        }
        </div>
    </header>
  );
}
