"use client"
import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import CommonLayout from "../../components/CommonLayout";
import ROUTE_MAP from "src/app/services/routing/routeMap";
import Linker from "src/app/components/Link";
import { useDispatch } from "react-redux";
import { coordinates } from "src/app/redux/store";
import { useMachine } from '@xstate/react';
import captureLocationMachine from "src/app/xstate/locationMachine";
import Loader from "src/app/components/Loader";
const CaptureLocation = () => {
  const dispatch = useDispatch();
  const [current, send] = useMachine(captureLocationMachine);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [distance, setDistance] = useState(9999);
  const [error, setError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 769)
  }, [])

  const getLocation = () => {
    if (navigator.geolocation && !loading) {
      setLoading(true);
      send('START_LOADING');
      navigator.geolocation.getCurrentPosition((p) => {
        setLat(p.coords.latitude);
        setLong(p.coords.longitude);
        setShowMap(true);
        setLoading(false);
        // setState({
        //   ...state,
        //   userData: {
        //     ...state.userData,
        //     lat: p.coords.latitude,
        //     long: p.coords.longitude,
        //   },
        // });
        // setDistance(
        //   calcDistance(
        //     p.coords.latitude,
        //     p.coords.longitude,
        //     state.todayAssessment.latitude,
        //     state.todayAssessment.longitude
        //   )
        // );
        send({ type: 'LOCATION_SUCCESS', lat: p.coords.latitude, long: p.coords.longitude });
        dispatch(coordinates({ lat: p.coords.latitude, long: p.coords.longitude }));
      });
    } else {
      send('LOCATION_ERROR');
      setError(`Please allow location access.`);
      setLoading(false);
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  };

  function calcDistance(lat1, lon1, lat2, lon2) {
    var d;
    try {
      var R = 6371000; // radius of earth in metres
      var dLat = toRad(lat2 - lat1);
      var dLon = toRad(lon2 - lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2) *
        Math.cos(lat1) *
        Math.cos(lat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      d = R * c;
    } catch (err) {
      console.log(err);
      setError("An error occured: " + err.toString());
      setTimeout(() => setError(false), 5000);
    }
    return d;
  }

  // Converts numeric degrees to radians
  function toRad(Value) {
    return (Value * Math.PI) / 180;
  }

  // const handleClick = (route) => {
  //   console.log(route)
  //   router.push(route);

  // if (
  //   !state?.todayAssessment?.latitude ||
  //   !state?.todayAssessment?.longitude
  // ) {
  //   setError(
  //     `Institute co-ordinates are missing. Please try again from start`
  //   );
  //   setTimeout(() => {
  //     setError(false);
  //   }, 5000);
  //   return;
  // }
  // if (!lat || !long) {
  //   setError(`Please capture location before continuing`);
  //   setTimeout(() => {
  //     setError(false);
  //   }, 5000);
  //   return;
  // }
  // if (distance > 500) {
  //   setError(`Please ensure you are within the institute premises`);
  //   setTimeout(() => {
  //     setError(false);
  //   }, 5000);
  //   return;
  // }
  // console.log("caleed")
  // };

  useEffect(() => {
    if (lat != 0 && long != 0) setDisabled(false);
    else setDisabled(true);
  }, [lat, long]);

  // useEffect(() => {
  //   const {
  //     user: { registrations },
  //   } = getCookie("userData");
  //   const roles = registrations[0]?.roles[0];
  //   setRole(roles);
  // }, [])

  return (
    // <CommonLayout back={role == 'Medical' ? ROUTE_MAP.assessment_type : ROUTE_MAP.medical_assessments}>
    <CommonLayout back={ROUTE_MAP.root}>

      <div className="flex flex-col px-5 py-8 items-center">
        <img
          src="/assets/locationGirl.png"
          className="h-[200px] mt-4 lg:h-[300px]"
          alt="locationGirl"
        />
        {/* {!showMap && loading && (
          <div className="w-[60%] h-[200px] bg-gray-200 flex">
            <div className="loader"></div>
          </div>
        )} */}
        {current.matches('loading') && (
          <Loader />
        )}
        {/* {showMap && ( */}
        {current.matches('success') && (
          <iframe
            src={`https://maps.google.com/maps?q=${lat},${long}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            width={isMobile ? "100%" : "60%"}
            height={200}
            loading="lazy"
            title="map"
            className="mt-5 animate__animated animate__fadeIn"
          />
        )}
        {/* {error && (
          <span className="text-white animate__animated animate__headShake bg-rose-600 font-medium px-4 py-2 text-center mt-2">
            {error}
          </span>
        )} */}
        {current.matches('error') && (
          <span className="text-white animate__animated animate__headShake bg-rose-600 font-medium px-4 py-2 text-center mt-2">
            {error}
          </span>
        )}
        {!showMap && distance > 500 && (
          <Button
            text="Capture Location"
            onClick={getLocation}
            styles={
              loading
                ? "bg-white text-primary opacity-75 w-80 lg:w-[60%]"
                : "w-80 lg:w-[60%] animate__animated animate__fadeInDown"
            }
          />
        )}
        {current.matches('success') &&
          <Linker
            text="Continue"
            styles={
              "w-80 lg:w-[60%]"
            }
            link={ROUTE_MAP.assessment_type} disabled={false}
          />}

      </div>
    </CommonLayout>
  );
};

export default CaptureLocation;
