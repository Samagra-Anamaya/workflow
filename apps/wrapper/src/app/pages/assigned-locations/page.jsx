"use client"
import React, { useEffect, useState } from "react";
import styles from './index.module.scss';
import LocationItem from "src/app/components/LocationItem";
import { useSelector } from "react-redux";
import CommonHeader from "src/app/components/Commonheader";

const AssignedLocations = () => {

  const [hydrated, setHydrated] = React.useState(false);
  const assignedLocations = useSelector((state) => state?.userData?.assignedLocations);
  const user = useSelector((state) => state?.userData?.user);
  const [locations, setLocations] = useState([]);


  useEffect(() => {
    setHydrated(true);
    setLocations(assignedLocations || []);
  }, [])

  console.log("AL ----->", locations)
  console.log("User", user)

  return !hydrated ? null : (
    <div className={styles.container}>
      <CommonHeader text={'Data Collection App'} showBack={false} sx={{ padding: 0, justifyContent: 'center', marginBottom: 30 }} />
      <div className={styles.mainContent}>
        <div className={styles.enmCard}>
          <p>Welcome {user?.user?.username}</p>
          <div className={styles.enmCardInfo}>
            <div>Villages in GP: {assignedLocations?.length || 0}</div>
            <div className={styles.separator}></div>
            <div>Completed Villages: NA</div>
          </div>
        </div>
        <div className={styles.divider}></div>
        <div>
          <h3>Assigned Villages</h3>
          {locations?.length > 0 && locations?.map(el => <LocationItem key={el.id} {...el} />)}
        </div>
      </div>
    </div>
  );
};

export default AssignedLocations;
