"use client"
import React, { useEffect, useState } from "react";
import ROUTE_MAP from "../../services/routing/routeMap";
import styles from './index.module.scss';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { userLogin } from "../../services/api";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { login } from '../../redux/store';
import GovtBanner from '../../components/GovtBanner';

const Home = () => {
  const dispatch = useDispatch();
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [usernameError, setUsernameError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Utility function to check if user is admin
  function userIsAdminForPortal(registrations) {
    const currentRegistration = registrations[0];
    return (
      currentRegistration !== null &&
      currentRegistration.roles.includes("Admin")
    );
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000)

  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    setUsernameError(false)
    setPasswordError(false)

    if (username == '') {
      setUsernameError(true)
    }
    if (password == '') {
      setPasswordError(true)
    }

    const loginRes = await userLogin(username, password);

    if (loginRes?.params?.errMsg && loginRes.responseCode == "FAILURE") {
      setError(loginRes?.params?.errMsg);

      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }
    if (loginRes.responseCode == "OK" && loginRes.result) {
      let loggedInUser = loginRes.result.data.user;
      console.log("logged in user-->", loggedInUser)
      dispatch(login(loggedInUser));
      if (userIsAdminForPortal(loggedInUser.user.registrations)) {
        router.push(ROUTE_MAP.admin);
      } else {
        window.location.reload();
      }
      return;
    }

    setError("An internal server error occured");
    setTimeout(() => {
      setError("");
    }, 3000);

  }



  return (
    <div className={styles.root}>
      {loading ?
        <div className="animate__animated animate__fadeIn">
          <GovtBanner />
        </div>
        :
        <>
          <div className={styles.loginContainer}>
            <GovtBanner />
            <div className={styles.text + " animate__animated animate__fadeInDown"}>
              <p> Data Collection App</p>
            </div>
            <div className={styles.loginFormContainer}>
              <p className={styles.loginText}><strong>Login to your account</strong></p>
              <form autoComplete="off" onSubmit={handleSubmit} className={styles.loginForm + " animate__animated animate__fadeInDown"}>
                <TextField
                  label="Username"
                  onChange={e => setUsername(e.target.value)}
                  required
                  variant="filled"
                  sx={{ mb: 3 }}
                  fullWidth
                  value={username}
                  error={usernameError}
                />
                <TextField
                  label="Password"
                  onChange={e => setPassword(e.target.value)}
                  required
                  variant="filled"
                  type="password"
                  value={password}
                  error={passwordError}
                  fullWidth
                  sx={{ mb: 3 }}
                />
                <Button variant="contained" color="success" type="submit" sx={{ padding: 1, width: '80%', height: '4rem', fontSize: 16, marginTop: 5 }}>Login</Button>
              </form>
            </div>
          </div>
        </>}
    </div>
  );
};

export default Home;
