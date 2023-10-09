"use client"
import React, { useEffect, useRef, useState } from "react";
import styles from './index.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import CommonHeader from "src/app/components/Commonheader";
import { v4 as uuidv4 } from 'uuid';
import { clearSubmissions, setCurrentCitizen } from "../../redux/store";
import { useOfflineSyncContext } from 'offline-sync-handler-test';
import GovtBanner from "../../components/GovtBanner";
import SelectionItem from '../../components/SelectionItem';
import CircularProgress from '@mui/material/CircularProgress';
import CommonModal from "../../components/Modal";

const BACKEND_SERVICE_URL = process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL;

const SurveyPage = ({ params }) => {
    /* Component States and Refs*/
    const offlinePackage = useOfflineSyncContext();
    const userData = useSelector((state) => state?.userData);
    const [loading, setLoading] = useState(false);
    const _currLocation = useSelector((state) => state?.userData?.currentLocation);
    const submissions = useSelector((state) => state?.userData?.submissions?.[_currLocation?.villageCode])
    const [hydrated, setHydrated] = React.useState(false);
    const [submitModal, showSubmitModal] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const containerRef = useRef();

    /* Use Effects */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setHydrated(true);
    }, [])

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollIntoView();
        }
    })


    /* Utility Functions */
    const addNewCitizen = () => {
        const newCitId = uuidv4();
        // dispatch(addCitizen({ id: newCitId, formId: 'household-citizen' }))
        dispatch(setCurrentCitizen({ citizenId: newCitId }));
        router.push(`/pages/citizen-survey`)
    }

    const submitData = async () => {
        try {
            const submissionData = {
                [_currLocation.villageCode]: submissions
            }
            const config = {
                method: 'POST',
                url: BACKEND_SERVICE_URL + `/submissions/bulk`,
                data: submissionData,
            };
            const response = await offlinePackage?.sendRequest(config);
            if (Object.keys(response)?.length) {
                // dispatch(saveCitizenFormData({ id: currCitizen.citizenId, data: formState, capturedAt: capturedAt }))
                dispatch(clearSubmissions(_currLocation?.villageCode));
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
        <div className={styles.container} ref={containerRef} >
            <GovtBanner sx={{ paddingTop: '2rem' }} />
            <CommonHeader
                onBack={() => router.back()}
                text={'Hello there 👋'}
                subText={`Enumerator ID : ${userData?.user?.user?.username}`}
                showLogout={false}
                sx={{ justifyContent: 'space-between !important', padding: '2rem 1rem' }}
            />

            <SelectionItem
                key={_currLocation.id}
                leftImage={'/assets/villageIcon.png'}
                mainText={_currLocation.villageName}
                mainSubtext={"Village Code - " + _currLocation.villageCode}
                sx={{ width: '90%', background: '#fff', minHeight: '15vh' }}
                mode={1}
            />

            {submissions?.length > 0 && <div className={styles.submitBtn} onClick={() => showSubmitModal(true)}>Submit Saved Entries</div>}

            <SelectionItem
                key={_currLocation.id}
                leftImage={'/assets/citizen.png'}
                sx={{ width: '90%' }}
                rightImage={'/assets/circleArrow.png'}
                onClick={addNewCitizen}
                mainText={'Add New Citizen'}
            />
            <SelectionItem
                key={_currLocation.id}
                onClick={() => { }}
                leftImage={'/assets/assessment.png'}
                rightImage={'/assets/circleArrow.png'}
                sx={{ width: '90%' }}
                mainText={'View Completed Entries'}
                href="/pages/completed-entries"
            />
            <SelectionItem
                key={_currLocation.id}
                onClick={() => { }}
                leftImage={'/assets/assessment.png'}
                rightImage={'/assets/circleArrow.png'}
                sx={{ width: '90%' }}
                mainText={'View Saved Entries'}
                href="/pages/saved-entries"
            />
            <SelectionItem
                key={_currLocation.id}
                onClick={() => { }}
                leftImage={'/assets/unresolvedFlags.png'}
                sx={{ width: '90%' }}
                mainText={'Unresolved Flags'}
                rightImage={'/assets/circleArrow.png'}
                href="/pages/unresolved-flags"
            />

            {submitModal && <CommonModal sx={{ maxHeight: '30vh', overflow: 'scroll' }}>
                {loading ?
                    <div style={{ ...modalStyles.container, justifyContent: 'center' }}>
                        <CircularProgress color="success" />
                    </div>
                    :
                    <div style={modalStyles.container}>
                        <div style={modalStyles.mainText}>A total of {submissions?.length} entries will be submitted for {_currLocation.villageName}</div>
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
    mainText: { fontSize: '1.4rem', color: '#007922', textAlign: 'center', margin: '2rem 0rem' },
    itemContainer: { display: 'flex', flexDirection: 'column', height: '20vh', overflowY: 'scroll', width: '100%', margin: '2rem 0rem 1rem 0rem', border: '2px solid rgba(0,0,0,0.2)', borderRadius: '0.5rem', padding: '0.5rem' },
    entryItem: { border: '1px solid #007922', padding: '0.5rem', borderRadius: '0.5rem', margin: '1rem 0rem' },
    entryItemHeading: { color: '#007922', fontWeight: 'bolder' },
    warningText: { color: 'red', textAlign: 'center' },
    btnContainer: { width: '100%', display: 'flex', flexDirection: 'row', gap: '2rem', justifyContent: 'space-evenly', marginTop: '1rem' },
    confirmBtn: { width: '50%', height: '3rem', background: '#017922', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem' },
    exitBtn: { width: '50%', height: '3rem', border: '1px solid #017922', color: '#017922', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem' },

}


export default SurveyPage;
