import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username') || "");

  function handleLogin(newToken, user) {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', user);
    setToken(newToken);
    setUsername(user);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101926] to-[#232d3f]">
      {!token ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard token={token} logout={logout} username={username} />
      )}
    </div>
  );
}

export default App;
