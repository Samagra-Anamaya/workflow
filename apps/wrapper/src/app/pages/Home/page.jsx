"use client"
import React, { useState } from "react";
import CommonLayout from "../../components/CommonLayout";
import ROUTE_MAP from "../../services/routing/routeMap";
import Linker from "src/app/components/Link";
import styles from './index.module.scss';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { userLogin } from "../../services/api";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { login } from '../../redux/store';

const Home = () => {
  const dispatch = useDispatch();
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [usernameError, setUsernameError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [error, setError] = useState('');

  // Utility function to check if user is admin
  function userIsAdminForPortal(registrations) {
    const currentRegistration = registrations[0];
    return (
      currentRegistration !== null &&
      currentRegistration.roles.includes("Admin")
    );
  }

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
        router.push(ROUTE_MAP.root);
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
      <div className={styles.text}>
        <h2> Data Collection App</h2>
        <p> Welcome Back</p>
      </div>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <TextField
          label="Username"
          onChange={e => setUsername(e.target.value)}
          required
          variant="outlined"
          sx={{ mb: 3 }}
          fullWidth
          value={username}
          error={usernameError}
        />
        <TextField
          label="Password"
          onChange={e => setPassword(e.target.value)}
          required
          variant="outlined"
          type="password"
          value={password}
          error={passwordError}
          fullWidth
          sx={{ mb: 3 }}
        />
        <Button variant="outlined" color="primary" fullWidth type="submit" sx={{ padding: 1 }}>Login</Button>
        <Button color="primary" fullWidth type="submit" sx={{ padding: 2 }}>Forgot Password?</Button>

      </form>
    </div>
  );
};

export default Home;
