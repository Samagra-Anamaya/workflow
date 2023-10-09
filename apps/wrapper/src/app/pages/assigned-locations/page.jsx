"use client"
import React, { useEffect, useRef, useState } from "react";
import styles from './index.module.scss';
import SelectionItem from "src/app/components/SelectionItem";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import GovtBanner from "../../components/GovtBanner";
import { clearSubmissions, setCurrentLocation } from "../../redux/store";
import CommonHeader from '../../components/Commonheader';
import { useOfflineSyncContext } from 'offline-sync-handler';
import CommonModal from "../../components/Modal";
import CircularProgress from '@mui/material/CircularProgress';

const BACKEND_SERVICE_URL = process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL;

const AssignedLocations = () => {
  const { sendRequest } = useOfflineSyncContext();
  const [hydrated, setHydrated] = React.useState(false);
  const [submitModal, showSubmitModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const assignedLocations = useSelector((state) => state?.userData?.assignedLocations);
  const user = useSelector((state) => state?.userData?.user);
  const submissions = useSelector((state) => state?.userData?.submissions);
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

  const submitData = async () => {
    try {
      const config = {
        method: 'POST',
        url: BACKEND_SERVICE_URL + `/submissions/bulk`,
        data: submissions,
      };
      const response = await sendRequest(config);
      console.log("Submission Respons,", response)
      if (Object.keys(response)?.length) {
        // dispatch(saveCitizenFormData({ id: currCitizen.citizenId, data: formState, capturedAt: capturedAt }))
        dispatch(clearSubmissions());
        setLoading(false);
        showSubmitModal(false);
      } else {
        // Either an error or offline
        if (!navigator.onLine) {
          // Submitted Offline
          // dispatch(saveCitizenFormData({ id: currCitizen.citizenId, data: formState, capturedAt: capturedAt }))
          setLoading(false);
          showSubmitModal(false);
        } else
          alert("An error occured while submitting form. Please try again")
        setLoading(false);
      }

    } catch (err) {
      console.error("ERR", err);
    }
  }

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
          {Object.keys(submissions)?.length > 0 && <div className={styles.submitBtn} onClick={() => showSubmitModal(true)}>Submit Saved Entries</div>}
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
      {submitModal && <CommonModal sx={{ maxHeight: '50vh', overflow: 'scroll' }}>
        {loading ?
          <div style={{ ...modalStyles.container, justifyContent: 'center' }}>
            <CircularProgress color="success" />
          </div>
          :
          <div style={modalStyles.container}>
            <div style={modalStyles.mainText}>Following Entries will be submitted</div>
            <div style={modalStyles.itemContainer}>
              {Object.keys(submissions)?.map(el => <div style={modalStyles.entryItem}>
                <p style={modalStyles.entryItemHeading}> Village Code : {el}</p>
                <p> Total submissions for this village: {submissions[el].length}</p>
              </div>)}
            </div>
            <p style={modalStyles.warningText}>Please ensure you are in good internet connectivity before submitting</p>
            <div style={modalStyles.btnContainer}>
              <div style={modalStyles.confirmBtn} onClick={() => {
                submitData();
              }}>Submit</div>
              <div style={modalStyles.exitBtn} onClick={() => showSubmitModal(false)}>Cancel</div>
            </div>
          </div>}

      </CommonModal>}
    </div >
  );
};

const modalStyles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', width: '100%' },
  mainText: { fontSize: '1.4rem', color: '#007922', textAlign: 'center', marginTop: 10 },
  itemContainer: { display: 'flex', flexDirection: 'column', height: '20vh', overflowY: 'scroll', width: '100%', margin: '2rem 0rem 1rem 0rem', border: '2px solid rgba(0,0,0,0.2)', borderRadius: '0.5rem', padding: '0.5rem' },
  entryItem: { border: '1px solid #007922', padding: '0.5rem', borderRadius: '0.5rem', margin: '1rem 0rem' },
  entryItemHeading: { color: '#007922', fontWeight: 'bolder' },
  warningText: { color: 'red', textAlign: 'center' },
  btnContainer: { width: '100%', display: 'flex', flexDirection: 'row', gap: '2rem', justifyContent: 'space-evenly', marginTop: '1rem' },
  confirmBtn: { width: '50%', height: '3rem', background: '#017922', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem' },
  exitBtn: { width: '50%', height: '3rem', border: '1px solid #017922', color: '#017922', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem' },

}

export default AssignedLocations;

