import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ isAuthenticated, handleLogout }) => {
  return (
    <nav style={{ padding: '10px', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
      <Link to="/" style={{ margin: '0 10px' }}>Home</Link>
      <Link to="/about" style={{ margin: '0 10px' }}>About Us</Link>
      {isAuthenticated ? (
        <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
          Log Out
        </button>
      ) : (
        <>
          <Link to="/login" style={{ marginLeft: '10px' }}>Login</Link>
          <Link to="/register" style={{ marginLeft: '10px' }}>Register</Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;
