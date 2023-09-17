"use client"
import React, {  useState } from "react";
import CommonLayout from "../../components/CommonLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button";
import { createUser } from "../../services/api";
import ROUTE_MAP from "../../services/routing/routeMap";
import Link from "next/link";

const Register = () => {
  const [error, setError] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [userCreated, setUserCreated] = useState(false);

  const handleRegister = async () => {
    if (!mobile) {
      setError("Username/Mobile is empty");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (mobile.length < 10) {
      setError("Username/Mobile must be of 10 digits");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (!password) {
      setError("Password cannot be empty");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (!role) {
      setError("Please select a role");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const userRes = await createUser({ mobile, role, password });
    if (userRes?.responseCode != "OK") {
      setError(userRes);
      setTimeout(() => setError(""), 3000);
      return;
    }
    setUserCreated(true);
  };

  return (
    <CommonLayout back="/" logoutDisabled>
      {!userCreated && (
        <div className="flex flex-col px-5 py-8 items-center">
          <p className="text-secondary text-[34px] font-bold mt-5 lg:text-[45px] animate__animated animate__fadeInDown">
            Register as an assessor
          </p>
          <p className="text-primary text-md lg:text-[20px] font-medium animate__animated animate__fadeInDown">
            Please enter your details
          </p>
          <div className="flex flex-col w-80 py-5 mt-5 lg:w-[70%] animate__animated animate__fadeInDown">
            <span className="text-secondary pl-0.5 pb-2">
              <FontAwesomeIcon icon={faUser} /> &nbsp;Username
            </span>
            <input
              type="text"
              placeholder="Enter username"
              className="border-2 border-primary p-3.5"
              value={mobile}
              onChange={(e) => {
                if (
                  /^[0-9]*$/.test(e.target.value) &&
                  e.target.value.length <= 10
                )
                  setMobile(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col w-80 pt-3 pb-5 lg:w-[70%] animate__animated animate__fadeInDown">
            <span className="text-secondary pl-0.5 pb-2">
              <FontAwesomeIcon icon={faUser} /> &nbsp;Phone Number
            </span>
            <input
              type="text"
              placeholder="Enter username"
              className="border-2 border-primary p-3.5"
              value={mobile}
              onChange={(e) => {
                if (
                  /^[0-9]*$/.test(e.target.value) &&
                  e.target.value.length <= 10
                )
                  setMobile(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col w-80 pt-3 lg:w-[70%] animate__animated animate__fadeInDown">
            <span className="text-secondary pl-0.5 pb-2">
              <FontAwesomeIcon icon={faLock} />
              &nbsp; Password
            </span>
            <input
              type="password"
              placeholder="Enter password"
              className="border-2 border-primary p-3.5 mb-5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                console.log(e.key);
                if (e.key == "Enter") handleRegister();
              }}
            />
          </div>
          <div className="flex flex-col w-80 pt-3 lg:w-[70%] animate__animated animate__fadeInDown">
            <span className="text-secondary pl-0.5 pb-2">
              <FontAwesomeIcon icon={faLock} />
              &nbsp; Role
            </span>
            <div
              onChange={(e) => setRole(e.target.value)}
              className="py-2 px-1"
            >
              <input type="radio" value="Medical" name="role" /> Medical
              <input
                type="radio"
                value="Non-Medical"
                name="role"
                className="ml-5"
              />{" "}
              Non-Medical
            </div>
          </div>
          {error && (
            <span className="text-white animate__animated animate__headShake bg-rose-600 font-medium px-4 py-2 text-center mt-2">
              {error}
            </span>
          )}
          <Button
            text={"Sign Up"}
            styles="w-80 lg:w-[70%] animate__animated animate__fadeInDown"
            onClick={handleRegister}
          />
          <Link
            className="text-secondary py-5 animate__animated animate__fadeInDown"
            href={ROUTE_MAP.forgot_password}
          >
            Forgot Password?
          </Link>
        </div>
      )}
      {userCreated && (
        <div className="flex flex-col px-5 py-8 items-center">
          <p className="text-secondary text-[34px] font-bold mt-5 lg:text-[45px] animate__animated animate__fadeInDown">
            Your account has been created
          </p>
          <Link
            className="text-primary text-md lg:text-[20px] font-medium animate__animated animate__fadeInDown cursor-pointer"
            href={ROUTE_MAP.login}
          >
            Click here to login
          </Link>
        </div>
      )}
    </CommonLayout>
  );
};

export default Register;
