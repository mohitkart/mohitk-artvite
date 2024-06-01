import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import crendentialModel from '../model/credentials';
import envirenment from '../envirenment';

const Header = props => {
  const user=crendentialModel.getUser()
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow main-header">
        <div className='container'>

          <Link className="navbar-brand" to="/">Mohitk-art</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/blogs">Blogs</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/study">Html</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/tasks">Tasks</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={user?'/chat':'/login'}>Chat</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={user?'/expenses':'/login'}>Expenses</Link>
              </li>
             
              <li className="nav-item">
                <Link className="nav-link" to="/dictionary">Dictionary</Link>
              </li>
              {user?<div className="dropdown">
                <a className="nav-link dropdown-toggle" type="button" id="userMenuDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Welcome {user.name}
                </a>
                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userMenuDropdown">
                  <Link className="dropdown-item" to="/dashboard">Dashboard</Link>
                  <a className="dropdown-item" onClick={e=>crendentialModel.logout()}>Logout</a>
                </div>
              </div>:<>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              </>}
              
            </ul>
          </div>

        </div>
      </nav>
    </>
  );
};

export default Header;
