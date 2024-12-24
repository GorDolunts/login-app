import React from 'react';

const Dashboard = ({ user }) => {
  return (
    <div>
      <h1>Welcome, {user.username}</h1>
      <p>You are logged in!</p>
    </div>
  );
};

export default Dashboard;
