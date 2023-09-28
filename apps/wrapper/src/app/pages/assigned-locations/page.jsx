"use client"
import React, { useEffect, useState } from "react";
import CommonLayout from "../../components/CommonLayout";
import ROUTE_MAP from "../../services/routing/routeMap";
import Linker from "src/app/components/Link";
import styles from './index.module.scss';
import LocationItem from "src/app/components/LocationItem";
import { useScrollTrigger } from "@mui/material";
import { useDispatch } from "react-redux";
import { setAssignedLocations } from "src/app/redux/store";
import CommonHeader from "src/app/components/Commonheader";

const AssignedLocations = () => {
  const [hydrated, setHydrated] = React.useState(false);

  const [locations, setLocations] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    setHydrated(true);
    dispatch(setAssignedLocations([
      {
        location: 'Safdarjung Enclave',
        deadline: '2023-12-12',
        assignedBy: 'Gaurav Goel',
        iconUrl: 'https://content.jdmagicbox.com/comp/allahabad/p5/0532px532.x532.140814163535.e9p5/catalogue/uttar-pradesh-public-service-commision-allahabad-ho-allahabad-government-organisations-1mqu6fv.jpg',
        villageModule: {
          enketoFormId: 'Nursing Form-Medical (CRP)'
        },
        householdModule: {
        }
      },
      {
        location: 'Green Park',
        deadline: '2023-12-12',
        assignedBy: 'Gaurav Goel',
        iconUrl: 'https://content.jdmagicbox.com/comp/allahabad/p5/0532px532.x532.140814163535.e9p5/catalogue/uttar-pradesh-public-service-commision-allahabad-ho-allahabad-government-organisations-1mqu6fv.jpg',
        villageModule: {
          enketoFormId: 'Nursing Form-Medical (CRP)'
        },
        householdModule: {
        }
      },
      {
        location: 'Hauz Khas',
        deadline: '2023-12-12',
        assignedBy: 'Gaurav Goel',
        iconUrl: 'https://content.jdmagicbox.com/comp/allahabad/p5/0532px532.x532.140814163535.e9p5/catalogue/uttar-pradesh-public-service-commision-allahabad-ho-allahabad-government-organisations-1mqu6fv.jpg',
        villageModule: {
          enketoFormId: 'Nursing Form-Medical (CRP)'
        },
        householdModule: {
        }
      },
      {
        location: 'Malviya Nagar',
        deadline: '2023-12-12',
        assignedBy: 'Gaurav Goel',
        iconUrl: 'https://content.jdmagicbox.com/comp/allahabad/p5/0532px532.x532.140814163535.e9p5/catalogue/uttar-pradesh-public-service-commision-allahabad-ho-allahabad-government-organisations-1mqu6fv.jpg',
        villageModule: {
          enketoFormId: 'Nursing Form-Medical (CRP)'
        },
        householdModule: {
        }
      },
    ]))
    setLocations([
      {
        location: 'Safdarjung Enclave',
        deadline: '2023-12-12',
        assignedBy: 'Gaurav Goel',
        iconUrl: 'https://content.jdmagicbox.com/comp/allahabad/p5/0532px532.x532.140814163535.e9p5/catalogue/uttar-pradesh-public-service-commision-allahabad-ho-allahabad-government-organisations-1mqu6fv.jpg',
        villageModule: {
          enketoFormId: 'Nursing Form-Medical (CRP)'
        },
        householdModule: {
        }
      },
      {
        location: 'Green Park',
        deadline: '2023-12-12',
        assignedBy: 'Gaurav Goel',
        iconUrl: 'https://content.jdmagicbox.com/comp/allahabad/p5/0532px532.x532.140814163535.e9p5/catalogue/uttar-pradesh-public-service-commision-allahabad-ho-allahabad-government-organisations-1mqu6fv.jpg',
        villageModule: {
          enketoFormId: 'Nursing Form-Medical (CRP)'
        },
        householdModule: {
        }
      },
      {
        location: 'Hauz Khas',
        deadline: '2023-12-12',
        assignedBy: 'Gaurav Goel',
        iconUrl: 'https://content.jdmagicbox.com/comp/allahabad/p5/0532px532.x532.140814163535.e9p5/catalogue/uttar-pradesh-public-service-commision-allahabad-ho-allahabad-government-organisations-1mqu6fv.jpg',
        villageModule: {
          enketoFormId: 'Nursing Form-Medical (CRP)'
        },
        householdModule: {
        }
      },
      {
        location: 'Malviya Nagar',
        deadline: '2023-12-12',
        assignedBy: 'Gaurav Goel',
        iconUrl: 'https://content.jdmagicbox.com/comp/allahabad/p5/0532px532.x532.140814163535.e9p5/catalogue/uttar-pradesh-public-service-commision-allahabad-ho-allahabad-government-organisations-1mqu6fv.jpg',
        villageModule: {
          enketoFormId: 'Nursing Form-Medical (CRP)'
        },
        householdModule: {
        }
      },
    ])
  }, [])

  return !hydrated ? null : (
    <div className={styles.container}>
      <CommonHeader text={'Data Collection App'} showBack={false} sx={{ padding: 0, justifyContent: 'center', marginBottom: 30 }} />
      <div className={styles.enmCard}>
        <p>Welcome enumerator_id</p>
        <div className={styles.enmCardInfo}>
          <div>Total Locations Assigned: 5</div>
          <div className={styles.separator}></div>
          <div>Unresolved Flags: 5</div>
        </div>
      </div>
      <div className={styles.divider}></div>
      <div>
        <h3>Assigned Locations</h3>
        {locations.map(el => <LocationItem {...el} />)}
      </div>
    </div>
  );
};

export default AssignedLocations;
