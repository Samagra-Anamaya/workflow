"use client"
import React, { useState } from "react";
import CommonLayout from "../../components/CommonLayout";
import Button from "../../components/Button";
import OtpInput from "react-otp-input";
import { sendOtpToMobile, verifyOtpSavePassword } from "../../services/api";
import ROUTE_MAP from "../../services/routing/routeMap";
import Link from "next/link";

const ForgotPassword = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);
  const [otpPage, setOtpPage] = useState(false);
  const [changePassPage, setChangePassPage] = useState(false);
  const [passChanged, setPassChanged] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [newPassConfirm, setNewPassConfirm] = useState("");

  const handleMobileInput = (val) => {
    if (/^[0-9]*$/.test(val) && val.length <= 10) setMobile(val);
  };

  const showPassScreen = () => {
    if (mobile.length != 10) {
      setError(true);
      setTimeout(() => setError(false), 3000);
      return;
    }
    setChangePassPage(true);
  };

  const verifyOtpAndChangePassword = async () => {
    if (otp.length != 4) {
      setError("Please enter a valid OTP");
      setTimeout(() => setError(false), 3000);
      return;
    }
    const res = await verifyOtpSavePassword(mobile, newPass, otp);
    if (res.responseCode == "OK") setPassChanged(true);
    else if (res?.params?.err == "INVALID_OTP_USERNAME_PAIR") {
      setError("Wrong OTP entered");
      setTimeout(() => setError(false), 3000);
      return;
    } else {
      setError("Unable to update password. Please try again later");
      setTimeout(() => setError(false), 3000);
      return;
    }
  };

  const sendOtp = async () => {
    if (!newPass) {
      setError({ err1: "This field is required" });
      setTimeout(() => setError(false), 3000);
      return;
    }
    if (!newPassConfirm) {
      setError({ err2: "This field is required" });
      setTimeout(() => setError(false), 3000);
      return;
    }
    if (newPass.length < 3) {
      setError({ err1: "Password must be atleast of 3 characters" });
      setTimeout(() => setError(false), 3000);
      return;
    }
    if (newPassConfirm.length < 3) {
      setError({ err2: "Password must be atleast of 3 characters" });
      setTimeout(() => setError(false), 3000);
      return;
    }
    if (newPass != newPassConfirm) {
      setError({ err: "Passwords do not match" });
      setTimeout(() => setError(false), 3000);
      return;
    }
    const res = await sendOtpToMobile(mobile);
    if (res.responseCode == "OK") setOtpPage(true);
    else setError("Unable to send OTP. Please try again later");
  };

  return (
    <CommonLayout back={"/"} logoutDisabled>
      {!otpPage && !changePassPage && !passChanged && (
        <div className="flex flex-col px-10 py-8 h-100 justify-between h-[90%]">
          <div className="w-full">
            <p className="text-secondary text-2xl font-bold">
              Enter your registered mobile number
            </p>
            <input
              className={`${error && "border-red-400 animate__animated animate__headShake"
                } border-2 rounded px-3 py-4 text-xl mt-10 w-full`}
              value={mobile}
              onChange={(e) => handleMobileInput(e.target.value)}
            />
            {error && (
              <p className="text-red-500 text-sm font-bold py-1">
                {error.length ? error : "Please enter a valid mobile number"}
              </p>
            )}
          </div>
          <Button text="Next" onClick={showPassScreen} />
        </div>
      )}
      {!otpPage && changePassPage && !passChanged && (
        <div className="flex flex-col px-10 py-8 h-100 justify-between h-[90%]">
          <div className="w-full">
            <p className="text-secondary text-xl font-bold">
              Change Password Here
            </p>
            <input
              className={`border ${(error?.err1 || error?.err) &&
                "border-2 border-red-400 animate__animated animate__headShake"
                } border-primary rounded px-3 py-3 text-lg mt-10 w-full`}
              placeholder="New Password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            {(error?.err1 || error?.err) && (
              <p className="text-red-500 text-sm font-bold py-1">
                {error?.err1 || error?.err}
              </p>
            )}
            <input
              className={`border ${(error?.err2 || error?.err) &&
                "border-2 border-red-400 animate__animated animate__headShake"
                } border-primary rounded px-3 py-3 text-lg mt-10 w-full`}
              placeholder="Confirm New Password"
              value={newPassConfirm}
              onChange={(e) => setNewPassConfirm(e.target.value)}
            />
            {(error?.err2 || error?.err) && (
              <p className="text-red-500 text-sm font-bold py-1">
                {error?.err2 || error?.err}
              </p>
            )}
            {error.length ? error : ""}
          </div>
          <Button text="Next" onClick={sendOtp} />
        </div>
      )}
      {otpPage && !passChanged && (
        <div className="flex flex-col px-10 py-8 h-100 justify-between h-[90%]">
          <div className="w-full">
            <p className="text-secondary text-xl lg:text-2xl font-bold">
              Enter OTP sent on{" "}
            </p>
            <p className="text-primary text-2xl lg:text-3xl font-bold py-4">
              {mobile || "9654591151"}
            </p>
            <style>
              {`
                            .error-otp {
                                border: 1.5px solid red !important;
                            }
                        `}
            </style>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
              containerStyle={"w-full py-6"}
              inputStyle={{
                border: "1px solid #9b9b9b",
                borderRadius: "0.25rem",
                marginRight: "1rem",
                height: "4rem",
                width: "3rem",
                fontSize: "1.5rem",
                color: "rgba(0,0,0,0.5)",
              }}
              isInputNum
              hasErrored={error}
              errorStyle={"animate__animated animate__headShake error-otp"}
              shouldAutoFocus={true}
            />
            {error && (
              <p className="text-red-500 text-sm font-bold py-1">{error} </p>
            )}
          </div>
          <Button text="Verify OTP" onClick={verifyOtpAndChangePassword} />
        </div>
      )}
      {passChanged && (
        <div className="flex flex-col px-10 py-8 h-100 justify-between h-[90%]">
          <div className="w-full">
            <p className="text-secondary text-xl font-bold">
              Your password has been changed successfully
            </p>
            <Link
              className="text-primary text-xl py-8 font-bold"
              href={ROUTE_MAP.root}
            >
              Click here to login
            </Link>
          </div>
        </div>
      )}
    </CommonLayout>
  );
};

export default ForgotPassword;
