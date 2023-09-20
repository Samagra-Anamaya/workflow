"use client"
import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation'

import CommonModal from "../Modal";
import isOnline from 'is-online';
import { logout } from "../../services/utils/index.js";
import { useEffect } from "react";
import { logoutUser } from "src/app/redux/store";
import { useDispatch } from "react-redux";
const CommonLayout = (props) => {
  const router = useRouter()
  const dispatch = useDispatch();

  const [logoutModal, showLogoutModal] = useState(false);
  const [online, setOnline] = useState(true);
  const onlineInterval = useRef();

  useEffect(() => {
    onlineInterval.current = setInterval(async () => {
      let status = await isOnline();
      setOnline(status)
    }, 1000)
    return () => clearInterval(onlineInterval.current)
  }, [])

  return (
    <>
      <div className="bg-tertiary h-screen w-screen flex flex-col lg:w-[52vw] md:w-[80vw] md:m-auto lg:m-auto">
        <div className="w-full flex h-[18%] flex-row justify-center  items-center  relative">
          {/* <div style={{ height: 20, width: 20, borderRadius: '50%', position: 'absolute', top: 0, right: 0, background: online ? '#1ED724' : 'red', marginTop: 10, marginRight: 20 }}></div> */}
          <h2>ANAMAYA APP</h2>
        </div>
        <div className="bg-white h-full w-full rounded-t-[60px] overflow-scroll pb-5">
          <div className="flex flex-row w-full px-8 py-7 justify-between cursor-pointer">
            {!props.backDisabled && (
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="text-2xl text-gray-300 lg:text-4xl"
                onClick={() => {
                  props.backFunction
                    ? props.backFunction()
                    : router.push(props.back);
                }}
              />
            )}
            {!props.logoutDisabled && (
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className="text-2xl text-gray-300 lg:text-4xl"
                onClick={() => showLogoutModal(true)}
              />
            )}
          </div>
          {props.children}
        </div>
      </div>
      {logoutModal && (
        <CommonModal>
          <div>
            <p className="text-secondary text-xl lg:text-3xl text-semibold font-medium text-center">
              Continue to logout?
            </p>
            <div className="flex flex-row justify-center w-full py-4">
              <div
                className="border border-primary text-primary py-1 px-7 mr-2 cursor-pointer lg:px-16 lg:py-3 lg:text-xl"
                onClick={() => { logout(); dispatch(logoutUser); }}
              >
                Yes
              </div>
              <div
                className="border border-primary bg-primary text-white py-1 px-7 cursor-pointer lg:px-16 lg:py-3 lg:text-xl"
                onClick={() => showLogoutModal(false)}
              >
                No
              </div>
            </div>
          </div>
        </CommonModal>
      )}
    </>
  );
};

export default CommonLayout;
