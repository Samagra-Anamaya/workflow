"use client"
import React, { useEffect, useState } from "react";
import styles from './index.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import CommonHeader from "src/app/components/Commonheader";
import { v4 as uuidv4 } from 'uuid';
import { addCitizen, setCurrentCitizen } from "../../redux/store";
import { getVillageDetails, getVillageSubmissions } from "../../services/api";
import Pagination from '@mui/material/Pagination';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const SurveyPage = ({ params }) => {
    /* Component States and Refs*/
    const _currLocation = useSelector((state) => state?.userData?.currentLocation);
    const [hydrated, setHydrated] = React.useState(false);
    const [citizens, setCitizens] = useState(_currLocation?.citizens || []);
    const [villageData, setVillageData] = useState({});
    const [currTab, setCurrTab] = React.useState(0);
    const [currPage, setCurrPage] = React.useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [prevSubmissions, setPrevSubmissions] = useState([]);
    const router = useRouter();
    const dispatch = useDispatch();

    /* Use Effects */
    useEffect(() => {
        setHydrated(true);
        console.log(_currLocation)
        getVillageData();
        getVillageSubmissionData();
    }, [])

    useEffect(() => {
        setCitizens(_currLocation?.citizens || [])
    }, [_currLocation])

    useEffect(() => {
        getVillageSubmissionData();
    }, [currPage])

    /* Utility Functions */
    const addNewCitizen = () => {
        const newCitId = uuidv4();
        dispatch(addCitizen({ id: newCitId, formId: 'household-citizen' }))
    }

    const getVillageData = async () => {
        try {
            if (_currLocation?.villageCode) {
                let data = await getVillageDetails(_currLocation.villageCode);
                if (Object.keys(data?.result)?.length) setVillageData(data?.result);
            }
        } catch (err) {
            console.log(err)
        }
    }

    const getVillageSubmissionData = async () => {
        try {
            if (_currLocation?.villageCode) {
                let data = await getVillageSubmissions(_currLocation.villageCode, currPage);
                console.log("PREV SUBMISSIONS -->", data);
                if (Object.keys(data)?.length) {
                    setPrevSubmissions(data?.result?.submissions);
                    setTotalPages(data?.result?.totalPages)
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
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


            <Box sx={{ marginTop: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={currTab} onChange={(event, newValue) => setCurrTab(newValue)} aria-label="basic tabs example" >
                    <Tab label="Previous Submissions" {...a11yProps(0)} />
                    <Tab label="Create Submission" {...a11yProps(1)} />
                </Tabs>
            </Box>
            {currTab == 1 &&
                <div className={styles.citizenContainer + ` animate__animated animate__fadeInUp`}>
                    <></>
                    {/* <p>Citizens</p>
                <div className={styles.separator}></div> */}
                    {citizens?.length != 0 &&
                        citizens?.map((el, i) => {
                            if (el?.status != 'SUBMITTED') return <div key={el.citizenId} className={styles.householdBtn}
                                onClick={() => { dispatch(setCurrentCitizen(el)); router.push(`/pages/citizen-survey`) }}>
                                Citizen {i + 1}
                            </div>
                        }
                        )}
                    <div className={styles.addNewBtn} onClick={addNewCitizen}>
                        + Add New
                    </div>
                </div>
            }
            {currTab == 0 &&
                <div className={styles.citizenContainer + ` animate__animated animate__fadeInUp`}>
                    <div className={styles.submissionContainer}>
                        {prevSubmissions?.length > 0 && prevSubmissions?.map(el => <div key={el.citizenId} className={styles.submittedCitizen}
                            onClick={() => { dispatch(setCurrentCitizen(el)); router.push(`/pages/citizen-survey`) }}>
                            {el?.submissionData?.beneficiaryName}
                        </div>)}
                    </div>
                    <Pagination count={totalPages} color="primary" onChange={(event, page) => setCurrPage(page)} className={styles.paginationContainer} />

                </div>
            }

        </div >
    );
};


export default SurveyPage;
