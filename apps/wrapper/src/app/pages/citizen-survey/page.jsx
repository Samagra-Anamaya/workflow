"use client"
import React, { useEffect, useState } from "react";
import styles from './index.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import CommonHeader from "src/app/components/Commonheader";
import * as submissionLottie from 'public/lottie/submission.json';
import { saveCitizenFormData } from "../../redux/store";
import CommonModal from "../../components/Modal";
import Lottie from 'react-lottie';
import { useOfflineSyncContext } from 'offline-sync-handler';
import CitizenForm from '../../components/CitizenForm';

const BACKEND_SERVICE_URL = process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL;

// Lottie Options
const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: submissionLottie,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

const CitizenSurveyPage = ({ params }) => {
    /* Util Hooks */
    const { sendRequest } = useOfflineSyncContext();
    const router = useRouter();
    const dispatch = useDispatch();

    /* Use States */
    const [hydrated, setHydrated] = React.useState(false);
    const [formState, setFormState] = useState({
        beneficiaryName: "",
        aadharNumber: "",
        dateOfBirth: "",
        gender: ""
    });
    const user = useSelector((state) => state?.userData?.user?.user);
    const _currLocation = useSelector((state) => state?.userData?.currentLocation);
    const currCitizen = useSelector((state) => state?.userData?.currentCitizen);
    const [submittedModal, showSubmittedModal] = useState(false);
    const [isMobile, setIsMobile] = useState(true);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState(null);

    console.log("CURR CITIZEN -->", currCitizen)

    /* Use Effects */
    useEffect(() => {
        setHydrated(true);
        if (window.innerWidth < 769) setIsMobile(true)
        else setIsMobile(false);
        if (Object.keys(currCitizen)?.length) {
            if (currCitizen?.status == 'SUBMITTED') {
                setMode('manual')
                setFormState(currCitizen.submissionData)
            }
        }
    }, [])

    /* Util Functions */
    const handleSubmit = async (e) => {
        try {
            setLoading(true);
            e.preventDefault();
            let capturedAt = new Date()
            capturedAt.toISOString().slice(0, 19).replace('T', ' ')
            const config = {
                method: 'POST',
                url: BACKEND_SERVICE_URL + `/submissions`,
                data: {
                    submissionData: formState,
                    spdpVillageId: _currLocation.villageCode,
                    citizenId: currCitizen.citizenId,
                    submitterId: user.id,
                    capturedAt
                },
            };
            const response = await sendRequest(config);
            if (response?.result?.submission?.status == 'SUBMITTED') {
                dispatch(saveCitizenFormData({ id: currCitizen.citizenId, data: formState, capturedAt: capturedAt }))
                setLoading(false);
                showSubmittedModal(true);
            } else {
                // Either an error or offline
                if (!navigator.onLine) {
                    // Submitted Offline
                    dispatch(saveCitizenFormData({ id: currCitizen.citizenId, data: formState, capturedAt: capturedAt }))
                    setLoading(false);
                    showSubmittedModal(true);
                } else
                    alert("An error occured while submitting form. Please try again")
                setLoading(false);
            }
        } catch (err) {
            console.log(err)
            setLoading(false);
        }
    }

    return !hydrated ? null : (
        <div className={styles.root}>
            <CommonHeader text={`Citizen Survey`} onBack={() => router.back()} sx={{ padding: '2rem 0rem' }} />
            {!mode ?
                <>

                    <p className={styles.commonHeading}>How do you want to fill survey?</p>
                    <div className={styles.collectionMode} onClick={() => setMode('qr')}>
                        <div>Scan Aadhar QR</div>
                        <img src="/assets/scanQr.png" />
                    </div>
                    <div className={styles.collectionMode} onClick={() => setMode('manual')}>
                        <div>Fill Manually</div>
                        <img src="/assets/survey.png" style={{ opacity: 0.6 }} />
                    </div>
                </>
                :
                <CitizenForm handleSubmit={handleSubmit} setFormState={setFormState} formState={formState} currCitizen={currCitizen} submittedModal={submittedModal} loading={loading} />
            }

            {submittedModal && <CommonModal>
                <div className={styles.submitModal}>
                    <div>
                        <Lottie options={defaultOptions}
                            style={{ marginTop: -40 }}
                            height={isMobile ? 300 : 300}
                            width={isMobile ? 300 : 300}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <p style={{ fontSize: '1.5rem', marginTop: -40, fontWeight: 600 }}>Citizen Data Submitted</p>
                        <p>You will get edit access after next cycle</p>
                        <div onClick={() => router.back()} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#1e2061', height: '2.5rem', borderRadius: '0.25rem', color: '#fff', marginTop: 30 }}>Go to village list</div>
                    </div>
                </div>
            </CommonModal>}
        </div>
    );
};

export default CitizenSurveyPage;
