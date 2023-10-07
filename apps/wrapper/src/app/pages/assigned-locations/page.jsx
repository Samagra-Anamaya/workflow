"use client"
import React, { useEffect, useRef, useState } from "react";
import styles from './index.module.scss';
import SelectionItem from "src/app/components/SelectionItem";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import GovtBanner from "../../components/GovtBanner";
import { setCurrentLocation } from "../../redux/store";
import CommonHeader from '../../components/Commonheader';

const AssignedLocations = () => {

  const [hydrated, setHydrated] = React.useState(false);
  const assignedLocations = useSelector((state) => state?.userData?.assignedLocations);
  const user = useSelector((state) => state?.userData?.user);
  const [locations, setLocations] = useState([]);
  const dispatch = useDispatch();
  const containerRef = useRef();

  useEffect(() => {
    setHydrated(true);
    setLocations(assignedLocations || []);
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      console.log("ref->", containerRef.current)
      containerRef.current.scrollIntoView();
    }
  })

  console.log("AL ----->", locations)
  console.log("User", user)

  return !hydrated ? null : (
    <div className={styles.container + " animate__animated animate__fadeIn"} ref={containerRef}>
      <GovtBanner />
      <div className={styles.mainContent}>
        <CommonHeader
          text={'Hello there 👋'}
          subText={`Enumerator ID : ${user?.user?.username}`}
          showBack={false}
        />
        <div className={styles.userInfoCard}>
          <img src="/assets/infoHeaderIcon.png" />
          <div className={styles.infoitem}>
            <div>Total Villages Assigned</div>
            <div>{locations?.length}</div>
          </div>
          <div className={styles.infoitem}>
            <div>Total Entries Made</div>
            <div>6</div>
          </div>
          <div className={styles.infoitem}>
            <div>Total Unresolved Flags</div>
            <div>0</div>
          </div>
        </div>
        <div className={styles.assignedLocations}>
          <p>Assigned Villages</p>
          {locations?.length > 0 && locations?.map(el => <SelectionItem
            key={el.villageCode}
            onClick={() => { dispatch(setCurrentLocation(el)) }}
            leftImage={'/assets/villageIcon.png'}
            mainText={el.villageName}
            mainSubtext={"Village Code - " + el.villageCode}
            rightImage={'/assets/circleArrow.png'}
            href="/pages/survey"
          />)}
        </div>
      </div>
    </div >
  );
};

export default AssignedLocations;
