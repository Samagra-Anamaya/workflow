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
// import QrReader from 'react-qr-scanner'
import { QrScanner } from '@yudiel/react-qr-scanner';
import GovtBanner from "../../components/GovtBanner";

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
    const [showForm, setShowForm] = useState(false);
    const [formEditable, setFormEditable] = useState(false);

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
            } else if (Object.keys(currCitizen?.submissionData)?.length > 0) {
                setMode('manual')
                setFormState(currCitizen.submissionData)
            }
        }
    }, [])

    /* Util Functions */
    const handleSubmit = async (e) => {
        if (loading) return;
        try {
            setLoading(true);
            e.preventDefault();
            let capturedAt = new Date()
            capturedAt.toISOString().slice(0, 19).replace('T', ' ')
            // const config = {
            //     method: 'POST',
            //     url: BACKEND_SERVICE_URL + `/submissions`,
            //     data: {
            // submissionData: formState,
            // spdpVillageId: _currLocation.villageCode,
            // citizenId: currCitizen.citizenId,
            // submitterId: user.id,
            // capturedAt
            //     },
            // };
            // const response = await sendRequest(config);
            // if (response?.result?.submission?.status == 'SUBMITTED') {
            //     dispatch(saveCitizenFormData({ id: currCitizen.citizenId, data: formState, capturedAt: capturedAt }))
            //     setLoading(false);
            //     showSubmittedModal(true);
            // } else {
            //     // Either an error or offline
            //     if (!navigator.onLine) {
            //         // Submitted Offline
            //         dispatch(saveCitizenFormData({ id: currCitizen.citizenId, data: formState, capturedAt: capturedAt }))
            //         setLoading(false);
            //         showSubmittedModal(true);
            //     } else
            //         alert("An error occured while submitting form. Please try again")
            //     setLoading(false);
            // }
            dispatch(saveCitizenFormData({
                submissionData: formState,
                spdpVillageId: _currLocation.villageCode,
                citizenId: currCitizen.citizenId,
                submitterId: user.id,
                capturedAt
            }))
            setLoading(false);
            showSubmittedModal(true);
        } catch (err) {
            console.log(err)
            setLoading(false);
        }
    }

    const handleScannedAadhaar = async (data) => {
        if (data?.length) {
            var XMLParser = require('react-xml-parser');
            var xml = new XMLParser().parseFromString(data);
            console.log(xml)
            let dob = "";
            let gender = "";

            // Handling DOB discrepancy
            if (xml?.attributes?.dob?.includes("/")) {
                let dobArr = xml?.attributes?.dob.split("/");
                dob = `${dobArr[2]}-${dobArr[1]}-${dobArr[0]}`;
            }
            else {
                let dobArr = xml?.attributes?.dob.split("-");
                dob = `${dobArr[0]}-${dobArr[1]}-${dobArr[2]}`;
            }

            // Handling gender discrepancy
            if (xml?.attributes?.gender?.length == 1) {
                gender = xml?.attributes?.gender == 'F' ? 'female' : xml?.attributes?.gender == 'M' ? 'male' : 'other';
            } else {
                gender = xml?.attributes?.gender?.toLowerCase();
            }

            setFormState({
                beneficiaryName: xml?.attributes?.name,
                aadharNumber: xml?.attributes?.uid,
                dateOfBirth: dob,
                gender: gender
            })
            setShowForm(true);
        }
    }

    return !hydrated ? null : (
        <div className={styles.root}>
            <GovtBanner sx={{ paddingTop: '2rem' }} />
            <CommonHeader
                onBack={() => router.back()}
                text={'Citizen Survey'}
                showLogout={false}
                sx={{ justifyContent: 'space-between !important', padding: '2rem 1rem' }} />

            {!mode ?
                <>
                    <div className={styles.collectionMode} onClick={() => setMode('qr')}>
                        <div><img src="/assets/qr.png" /></div>
                        <p>Scan Aadhar QR</p>
                        <div>
                            <span>Scan</span>
                            <img src="/assets/circleArrowGreen.png" />
                        </div>
                    </div>
                    <div className={styles.collectionMode} onClick={() => setMode('manual')}>
                        <div><img src="/assets/docFill.png" /></div>
                        <p>Fill Form Manually</p>
                        <div>
                            <span>Fill Form</span>
                            <img src="/assets/circleArrowGreen.png" />
                        </div>
                    </div>
                </>
                : mode == 'manual' && !showForm ?
                    <CitizenForm mode={mode} formEditable={(currCitizen?.status == 'SUBMITTED' || Object.keys(currCitizen?.submissionData)?.length > 0) ? false : true} handleSubmit={handleSubmit} setFormState={setFormState} formState={formState} currCitizen={currCitizen} submittedModal={submittedModal} loading={loading} />
                    : !showForm && <div className={styles.qrContainer}>
                        <QrScanner
                            onDecode={(result) => handleScannedAadhaar(result)}
                            onError={(error) => console.log(error?.message)}
                        />
                        <p>Align QR Code within the scanner</p>
                    </div>
            }

            {showForm && <CitizenForm mode={mode} formEditable={formEditable} handleSubmit={handleSubmit} setFormState={setFormState} formState={formState} currCitizen={currCitizen} submittedModal={submittedModal} loading={loading} />}

            {submittedModal && <CommonModal sx={{ maxHeight: '40vh', overflow: 'scroll' }}>
                <div className={styles.submitModal}>
                    <div>
                        <Lottie options={defaultOptions}
                            style={{ marginTop: -40 }}
                            height={200}
                            width={200}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <p style={{ fontSize: '1.5rem', marginTop: -40, fontWeight: 600 }}>Citizen Data Saved</p>
                        <p>You will get edit access after next cycle</p>
                        <div onClick={() => router.back()} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#017922', height: '3.5rem', borderRadius: '0.75rem', color: '#fff', marginTop: 30 }}>End Survey</div>
                    </div>
                </div>
            </CommonModal>}
        </div>
    );
};

export default CitizenSurveyPage;
