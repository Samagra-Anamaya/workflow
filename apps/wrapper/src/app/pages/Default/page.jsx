"use client"
import React, { useEffect } from "react";
import AssignedLocations from "../assigned-locations/page";
import { useUserData } from "src/app/hooks/useAuth";
import { useMachine } from '@xstate/react';
import authMachine from "src/app/xstate/stateMachine";
import Home from "../Home/page";
const Login = () => {
  const userData = useUserData();
  const [current, send] = useMachine(authMachine);

  const isAuthenticated = userData?.isAuthenticated;
  if (isAuthenticated) {
    send("AUTHENTICATED");
  } else {
    send("UNAUTHENTICATED");
  }

  console.log("hello", current, isAuthenticated)

  if (current) {
    console.log(current.value)
    return current.matches("authenticated") ? (
      <AssignedLocations />
    ) : (
      <Home />
    );
  }
  else
    return <div>hello</div>
};

export default Login;
