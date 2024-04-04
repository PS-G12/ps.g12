import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./authentication.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    signUpUsername: "",
    signUpEmail: "",
    signUpPassword: "",
    signUpPassword_dup: "",
  });
  const [errors, setErrors] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (formData.signUpUsername.length < 4) {
      newErrors.signUpUsername = "Username must be at least 4 characters long.";
    }

    if (formData.signUpPassword.length < 6) {
      newErrors.signUpPassword =
        "Passwords must be at least 6 characters long.";
    }

    if (!validateEmail(formData.signUpEmail)) {
      newErrors.signUpEmail = "Please enter a valid email address.";
    }

    if (
      formData.signUpPassword.length >= 6 &&
      formData.signUpPassword !== formData.signUpPassword_dup
    ) {
      newErrors.signUpPassword_dup = "Please make sure your passwords match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
        // Enviar solicitud POST al servidor
        const response = await fetch('/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            //'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
  
        const data = await response.json();
  
        if (response.ok) {
            sessionStorage.setItem("token", data.token);
            setLoggedIn(true);
        } else {
          // Error en el registro
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error occurred while registering user:', error);
      }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpiar errores cuando se cambia el valor del campo
    setErrors({
      ...errors,
      [e.target.name]: undefined,
    });
  };

  const handleGoogleSignUp = async () => {
    // Aquí iría la lógica para el registro con Google
    console.log("Signing up with Google...");
  };

  const handleGithubSignUp = async () => {
    // Aquí iría la lógica para el registro con GitHub
    console.log("Signing up with GitHub...");
  };
  const navigate = useNavigate();
  if (loggedIn) {
    navigate("/");
  }
  return (
    <div className="auth-page">
      <div className="bg-container">
        <div className="auth-container">
          <div className="forms-container">
            <div className="form-control signin-form">
              <form onSubmit={handleSignUp}>
                <h2>Register</h2>
                <input
                  type="text"
                  className={
                    "input-signin" + (errors.signUpUsername ? " error" : "")
                  }
                  name="signUpUsername"
                  placeholder="Username"
                  value={formData.signUpUsername}
                  onChange={handleChange}
                  required
                />

                <p className="error">
                  {errors.signUpUsername && (
                    <i className="error-icon fas fa-exclamation-circle"></i>
                  )}
                  {errors.signUpUsername && (
                    <span className="error">{errors.signUpUsername}</span>
                  )}
                </p>

                <input
                  type="email"
                  className="input-signin"
                  name="signUpEmail"
                  placeholder="Email Address"
                  value={formData.signUpEmail}
                  onChange={handleChange}
                  required
                />
                <p className="error">
                  {errors.signUpEmail && (
                    <i className="error-icon fas fa-exclamation-circle"></i>
                  )}
                  {errors.signUpEmail && (
                    <span className="error">{errors.signUpEmail}</span>
                  )}
                </p>

                <input
                  type="password"
                  className={
                    "input-signin" + ((errors.signUpPassword || errors.signUpPassword_dup) ? " error" : "")
                  }
                  name="signUpPassword"
                  placeholder="Password"
                  value={formData.signUpPassword}
                  onChange={handleChange}
                  required
                />
                <p className="error">
                  {(errors.signUpPassword) && (
                    <i className="error-icon fas fa-exclamation-circle"></i>
                  )}
                  {errors.signUpPassword && (
                    <span className="error">{errors.signUpPassword}</span>
                  )}
                </p>

                <input
                  type="password"
                  className={
                    "input-signin" + (errors.signUpPassword_dup ? " error" : "")
                  }
                  name="signUpPassword_dup"
                  placeholder="Repeat password"
                  value={formData.signUpPassword_dup}
                  onChange={handleChange}
                  required
                />
                <p className="error-dup">
                  {errors.signUpPassword_dup && (
                    <i className="error-icon fas fa-exclamation-circle"></i>
                  )}
                  {errors.signUpPassword_dup && (
                    <span className="error">{errors.signUpPassword_dup}</span>
                  )}
                </p>

                <button type="submit">Sign Up</button>
              </form>
              <div className="linea-horizontal"></div>
              <span>or sign up with</span>
              <div className="socials">
                <button
                  className="gsi-material-button"
                  id="google-signup"
                  onClick={handleGoogleSignUp}
                >
                  <div className="gsi-material-button-state"></div>
                  <div className="gsi-material-button-content-wrapper">
                    <div className="gsi-material-button-icon">
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        style={{ display: "block" }}
                      >
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        ></path>
                        <path
                          fill="#4285F4"
                          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        ></path>
                        <path
                          fill="#FBBC05"
                          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        ></path>
                        <path
                          fill="#34A853"
                          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        ></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                      </svg>
                    </div>
                    <span className="gsi-material-button-contents">
                      Sign up with Google
                    </span>
                    <span style={{ display: "none" }}>Sign up with Google</span>
                  </div>
                </button>
                <button
                  className="gsi-material-button"
                  id="github-signup"
                  onClick={handleGithubSignUp}
                >
                  <div className="gsi-material-button-state"></div>
                  <div className="gsi-material-button-content-wrapper">
                    <div className="gsi-material-button-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 496 512"
                      >
                        <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6z" />
                        <path d="M134.8 392.9c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3z" />
                        <path d="M179 391.2c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9z" />
                        <path d="M244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" />
                        <path d="M97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1z" />
                        <path d="M86.4 344.8c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.7-3.6-.3-4.3 .7z" />
                        <path d="M118.8 380.4c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1z" />
                        <path d="M107.4 365.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                      </svg>
                    </div>
                    <span className="gsi-material-button-contents">
                      Sign up with Github
                    </span>
                    <span style={{ display: "none" }}>Sign up with Github</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="intros-container">
            <div className="intro-control signin-intro">
              <div className="intro-control__inner">
                <h2>Welcome to <span className="fitnesscoach-msg">FitnessCoach!</span></h2>
                <p>
                  Start your fitness journey today! We're excited to have you
                  join us. Let's get moving and stay healthy together.
                </p>
                <Link to="/login" id="signup-btn">
                  Already have an account? Sign in.
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
