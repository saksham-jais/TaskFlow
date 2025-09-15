import React, { useState } from "react";

const formStyles = `
.login-signup-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #101926 0%, #232d3f 100%);
  box-sizing: border-box;
  padding: 2vh 1vw;
  overflow-x: hidden;
}
.transition-wrapper {
  display: flex;
  align-items: stretch;
  width: 710px;
  max-width: 96vw;
  position: relative;
  border-radius: 22px;
  box-shadow: 0 18px 46px rgba(0,0,0,0.32);
  overflow: hidden;
  background: none;
}
.slide-box, .slide-image-box {
  flex: 0 0 355px;
  height: 425px;
  transition: transform 0.7s cubic-bezier(.74,-0.02,.44,1.1);
  will-change: transform;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: none;
}
.slide-box {
  background: rgba(26,35,50,0.97);
  box-shadow: 0 8px 32px rgba(0,0,0,0.19);
  padding: 2.7rem 2rem 1.5rem;
  border-radius: 22px 0 0 22px;
  z-index: 2;
}
.slide-image-box {
  background: #181f2e;
  box-shadow: 0 8px 32px rgba(0,0,0,0.16);
  border-radius: 0 22px 22px 0;
  z-index: 1;
  overflow: hidden;
}
.slide-image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0 22px 22px 0;
}

/* Sliding logic */
.default-mode .slide-box { transform: translateX(0); }
.default-mode .slide-image-box { transform: translateX(0); }
.signup-mode .slide-box { transform: translateX(355px); }
.signup-mode .slide-image-box { transform: translateX(-355px); }

/* Responsive mobile */
@media (max-width: 800px) {
  .transition-wrapper {
    flex-direction: column-reverse;
    width: 99vw;
    min-width: 0;
    box-shadow: none;
    border-radius: 18px;
  }
  .slide-box, .slide-image-box {
    position: static;
    width: 99vw;
    max-width: 370px;
    min-width: 0;
    border-radius: 18px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.20);
    margin: 10px auto;
    height: auto;
    transform: none !important;
    padding: 2rem 1rem 1.2rem;
  }
  .slide-image-box {
    display: none !important;   /* Hide the image container entirely */
  }
}

/* Form elements */
.form-title {
  font-size: 2.1rem;
  font-weight: 900;
  color: #e4ff3c;
  text-align: center;
  margin-bottom: 1.25rem;
  font-family: 'Montserrat', 'Inter', sans-serif;
}
.form-field {
  background: #232d3f;
  color: #fff;
  border-radius: 10px;
  padding: 1rem 1.2rem;
  margin-bottom: 1rem;
  width: 100%;
  font-size: 1.05rem;
  font-weight: 500;
  border: none;
  outline: none;
  transition: box-shadow 0.23s;
  box-shadow: inset 0 0 6px rgba(0,0,0,0.15); /* Optional subtle inner shadow */
}

.form-field:focus { box-shadow: 0 0 0 2px #e4ff3c; }
.form-field::placeholder { color: #eee; opacity: 1; }
.form-btn {
  background: linear-gradient(90deg, #e4ff3c 0%, #ffe157 100%);
  color: #232d3f;
  font-weight: 900;
  font-size: 1.08rem;
  border-radius: 10px;
  padding: .95rem 0;
  width: 100%;
  margin-top: 10px;
  border: none;
  box-shadow: 0 2px 12px rgba(228,255,60,0.09);
  transition: transform .13s;
}
.form-btn:hover { transform: scale(1.04); }
.link-row {
  margin-top: 2.1rem;
  text-align: center;
  font-size: 1.08rem;
  color: #fff;
}
.link-btn, .link-row a {
  color: #fff;
  font-weight: 700;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  transition: color .2s;
}
.link-btn:hover, .link-row a:hover { color: #ffe157; }
.error-msg { color: #ffe157; font-weight: 700; font-size: .97rem; margin: .37rem 0 .07rem; text-align: center;}
.success-msg { color: #4cff90; font-weight: 700; font-size: .97rem; margin: .37rem 0 .07rem; text-align: center;}
`;

export default function Login({ onLogin }) {
  const [showSignup, setShowSignup] = useState(false);

  // Login states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Signup states
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupError, setSignupError] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://task-flow-eight-rho.vercel.app/api';

  // Login handler
  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('username', username);
      onLogin(data.token, username);
    } else {
      setError(data.error || "Login failed");
    }
  }

  // Signup handler
  async function handleSignup(e) {
    e.preventDefault();
    setSignupError("");
    setSignupSuccess(false);
    const res = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: signupUsername, password: signupPassword }),
    });
    const data = await res.json();
    if (data.message === "User created") {
      setSignupSuccess(true);
      setTimeout(() => {
        setShowSignup(false);
        setSignupSuccess(false);
      }, 1200);
    } else {
      setSignupError(data.error || "Signup failed");
    }
  }

  return (
    <div className="login-signup-container">
      <style>{formStyles}</style>
      <div className={`transition-wrapper ${showSignup ? "signup-mode" : "default-mode"}`}>
        <div className="slide-box">
          {!showSignup ? (
            <form onSubmit={handleLogin} autoComplete="off">
              <div className="form-title">Login</div>
              <input
                className="form-field"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
              <input
                className="form-field"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button type="submit" className="form-btn">Login</button>
              {error && <div className="error-msg">{error}</div>}
              <div className="link-row">
                Don't have an account?{" "}
                <button className="link-btn" type="button" onClick={() => setShowSignup(true)}>
                  Sign Up
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} autoComplete="off">
              <div className="form-title">Sign Up</div>
              <input
                className="form-field"
                value={signupUsername}
                onChange={e => setSignupUsername(e.target.value)}
                placeholder="Username"
                required
              />
              <input
                className="form-field"
                type="password"
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button type="submit" className="form-btn" disabled={signupSuccess}>Sign Up</button>
              {signupSuccess && <div className="success-msg">Account created! Redirecting…</div>}
              {signupError && <div className="error-msg">{signupError}</div>}
              <div className="link-row">
                Already have an account?{" "}
                <button className="link-btn" type="button" onClick={() => setShowSignup(false)}>
                  Login
                </button>
              </div>
            </form>
          )}
        </div>
        <div className="slide-image-box">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
            alt="Login Illustration"
          />
        </div>
      </div>
    </div>
  );
}
