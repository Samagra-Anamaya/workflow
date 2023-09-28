"use client"
import React, { useEffect, useState } from "react";
import styles from './index.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import CommonHeader from "src/app/components/Commonheader";
import { v4 as uuidv4 } from 'uuid';
import { addCitizen, setCurrentCitizen } from "../../redux/store";
import { getVillageDetails } from "../../services/api";

const SurveyPage = ({ params }) => {
    /* Component States and Refs*/
    const _currLocation = useSelector((state) => state?.userData?.currentLocation);
    const [hydrated, setHydrated] = React.useState(false);
    const [citizens, setCitizens] = useState(_currLocation?.citizens || []);
    const [villageData, setVillageData] = useState({});
    const router = useRouter();
    const dispatch = useDispatch();

    /* Use Effects */
    useEffect(() => {
        setHydrated(true);
        console.log(_currLocation)
        getVillageData();
    }, [])

    useEffect(() => {
        setCitizens(_currLocation?.citizens || [])
    }, [_currLocation])

    /* Utility Functions */
    const addNewCitizen = () => {
        const newCitId = uuidv4();
        dispatch(addCitizen({ id: newCitId, formId: 'household-citizen' }))
    }

    const getVillageData = async () => {
        try {
            if (_currLocation?.villageCode) {
                let data = await getVillageDetails(_currLocation.villageCode);
                if (Object.keys(data)?.length) setVillageData(data);
            }
        } catch (err) {
            alert("Unable to fetch village details", err.toString())
        }
    }

    return !hydrated ? null : (
        <div className={styles.root}>
            <CommonHeader text={`${_currLocation?.villageName} Survey`} onBack={() => router.back()} sx={{ justifyContent: 'space-between !important', padding: '2rem 0rem' }} />
            <div className={styles.locationItem}>
                <div>
                    <img src={"/assets/uplogo.png"} />
                </div>
                <div>
                    <p>{_currLocation?.villageName} - {_currLocation?.villageCode}</p>
                </div>
            </div>
            <div style={{ fontSize: 18, marginBottom: 10 }}>Surveys to conduct: {villageData?.surveyToConduct}</div>
            <div style={{ fontSize: 18 }}>Total surveys completed: {villageData?.surveySubmitted}</div>
            {/* <div className={styles.surveyInfoContainer}>
                <div className={styles.surveyBox}>
                    <p>5</p>
                    <p>Surveys to conduct</p>
                </div>
                <div className={styles.surveyBox}>
                    <p>5</p>
                    <p>Surveys completed</p>
                </div>
            </div> */}
            <div className={styles.citizenContainer}>
                <p>Citizens</p>
                <div className={styles.separator}></div>
                {citizens?.length != 0 &&
                    citizens?.map((el, i) =>
                        <div key={el.citizenId} className={el?.status == 'SUBMITTED' ? styles.submittedCitizen : styles.householdBtn}
                            onClick={() => { dispatch(setCurrentCitizen(el)); router.push(`/pages/citizen-survey`) }}>
                            {el?.status == 'SUBMITTED' ? el?.submissionData?.beneficiaryName : `Citizen ${i + 1}`}
                        </div>
                    )}
                <div className={styles.addNewBtn} onClick={addNewCitizen}>
                    + Add New
                </div>
            </div>
        </div >
    );
};


export default SurveyPage;
