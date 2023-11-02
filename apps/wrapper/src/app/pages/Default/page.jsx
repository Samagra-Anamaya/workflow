"use client"
import React, { useEffect } from "react";
import AssignedLocations from "../assigned-locations/page";
import { useMachine } from '@xstate/react';
import authMachine from "src/app/xstate/stateMachine";
import Home from "../Home/page";
import { useSelector } from "react-redux";
const Login = () => {
  const userData = useSelector((state) => state?.userData)
  const [current, send] = useMachine(authMachine);

  const isAuthenticated = userData?.isAuthenticated;
  if (isAuthenticated) {
    send("AUTHENTICATED");
  } else {
    send("UNAUTHENTICATED");
  }

  console.log("assadasd--->", current, current.value)

  if (current) {
    return current.value == "authenticated" ? (
      <AssignedLocations />
    ) : (
      <Home />
    );
  }
  else
    return <div>hello</div>
};

export default Login;
