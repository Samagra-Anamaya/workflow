"use client"
import React, { useState, useEffect, useRef } from "react";
import { saveFormSubmission } from "../../services/api";
// import { StateContext } from "@/app/page";
import { getCookie, getFormData, getFromLocalForage, handleFormEvents, isImage, makeDataForPrefill, setCookie, setToLocalForage, updateFormData } from "../../services/utils";
import ROUTE_MAP from "../../services/routing/routeMap";
import { useUserData } from "src/app/hooks/useAuth";
import { useRouter } from 'next/navigation'
import formSubmissionMachine from "src/app/xstate/formSubmissionMachine";
import { useMachine } from '@xstate/react';
import SuccessPopup from "src/app/components/popup";
import { useDispatch, useSelector } from "react-redux";
import { coordinates, form } from "src/app/redux/store";
import { getOfflineCapableForm } from "src/app/services/api";

// import Loader from "@/app/components/Loader";
const GenericOdkForm = (props) => {
    const dispatch = useDispatch();
    const formStates = useSelector((state) => state.userData.forms)
    const router = useRouter()
    const user = useUserData();
    const scheduleId = useRef();
    const formName = props.formId;
    console.log("FORM NAME -->", formName);
    const [current, send] = useMachine(formSubmissionMachine);
    const [surveyUrl, setSurveyUrl] = useState("");
    const [formSubmitted] = useState(false);
    const formSpec = {
        forms: {
            [formName]: {
                skipOnSuccessMessage: true,
                prefill: {},
                submissionURL: "",
                name: formName,
                successCheck: "async (formData) => { return true; }",
                onSuccess: {
                    notificationMessage: "Form submitted successfully",
                    sideEffect: "async (formData) => { console.log(formData); }",
                },
                onFailure: {
                    message: "Form submission failed",
                    sideEffect: "async (formData) => { console.log(formData); }",
                    next: {
                        type: "url",
                        id: "google",
                    },
                },
            },
        },
        start: formName,
        metaData: {},
    };


    const encodeFunction = (func) => encodeURIComponent(JSON.stringify(func));
    const startingForm = formSpec.start;
    const [formId, setFormId] = useState(startingForm);
    const [encodedFormSpec, setEncodedFormSpec] = useState(
        encodeURI(JSON.stringify(formSpec.forms[formId]))
    );
    const [onFormSuccessData, setOnFormSuccessData] = useState(undefined);
    const [onFormFailureData, setOnFormFailureData] = useState(undefined);
    const [encodedFormURI, setEncodedFormURI] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    // const [encodedFormURI, setEncodedFormURI] = useState(
    //   getFormURI(
    //     formId,
    //     formSpec.forms[formId].onSuccess,
    //     formSpec.forms[formId].prefill
    //   )
    // );
    const [prefilledFormData, setPrefilledFormData] = useState();

    const loading = useRef(false);
    const [assData, setData] = useState({
        district: "",
        instituteName: "",
        nursing: "",
        paramedical: "",
        type: "",
        latitude: null,
        longitude: null,
    });
    const handleCloseSuccessPopup = () => {
        setShowSuccessPopup(false);
        send('CLOSE_SUCCESS_POPUP');
    };
    async function afterFormSubmit(e) {
        send("FORM_SUBMIT");

        console.log("Form Submit Event ----->", e.data);
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (JSON.parse(e?.data)?.state === "ON_FORM_SUCCESS_COMPLETED") {
            send("FORM_SUBMISSION_SUCCESS");
            dispatch(coordinates());
            dispatch(form(formName));
            setShowSuccessPopup(true);
        }
        try {

            const { nextForm, formData, onSuccessData, onFailureData } = data;
            if (data?.state === "ON_FORM_SUCCESS_COMPLETED") {
                const updatedFormData = await updateFormData(formSpec.start);

                saveFormSubmission({
                    schedule_id: scheduleId.current,
                    form_data: updatedFormData,
                    assessment_type: formName.startsWith('hospital') ? 'hospital' : 'institute',
                    form_name: formSpec.start,
                });;
                // setCookie(startingForm + `${new Date().toISOString().split("T")[0]}`, '');
                // setCookie(startingForm + `Images${new Date().toISOString().split("T")[0]}`, '');
            }

            if (nextForm?.type === "form") {
                setFormId(nextForm.id);
                setOnFormSuccessData(onSuccessData);
                setOnFormFailureData(onFailureData);
                setEncodedFormSpec(encodeURI(JSON.stringify(formSpec.forms[formId])));
                router.push(ROUTE_MAP.assessment_type)
            } else if (nextForm?.type === 'url') {
                window.location.href = nextForm.url;
            }
        } catch (e) {
            console.log(e);
            send('FORM_SUBMISSION_FAILURE');

        }
    }

    const handleEventTrigger = async (e) => {
        handleFormEvents(startingForm, afterFormSubmit, e, user)

    }

    const bindEventListener = () => {
        window.addEventListener("message", handleEventTrigger);
    };
    const detachEventBinding = () => {
        window.removeEventListener("message", handleEventTrigger);
    };

    useEffect(() => {
        bindEventListener();
        getFormData({ loading, scheduleId, formSpec, startingForm, formId, setData, setEncodedFormSpec, setEncodedFormURI });
        getSurveyUrl();
        return () => {
            detachEventBinding();
            setData(null);
            setPrefilledFormData(null);
        };
    }, []);

    const getSurveyUrl = async () => {
        let surveyUrl = await getOfflineCapableForm(formName, dispatch);
        console.log("SURVERY URL --> ", surveyUrl ? surveyUrl : formStates[formName])
        console.log("SURVERY URL from state --> ", formStates[formName])
        surveyUrl ? setSurveyUrl(surveyUrl) : setSurveyUrl(formStates[formName])
    }


    // TODO
    const clearFormCache = async () => {
        let formUri = await getFromLocalForage('formUri');
        const formId = formUri.slice(formUri.lastIndexOf('/') + 1);
        const enketoDB = indexedDB.open('enketo', 3);
        indexedDB.databases().then(r => console.log(r))
        console.log(enketoDB)
    }
    useEffect(() => {
        console.log('Current state:', current);
    }, [current]);


    return (
        <>
            {/* {console.log(current)} */}
            < div className="flex flex-col items-center" >
                {/* {encodedFormURI && assData && (
          <>
            <iframe
              title="form"
              src={`${ENKETO_URL}/preview?formSpec=${encodedFormSpec}&xform=${encodedFormURI}&userId=${user.user.id}`}
              style={{ height: "80vh", width: "100%", marginTop: "20px" }}
            />
          </>
        )} */}
                {/* {current.matches("submitting") && (
          <>
            <Loader/>
          </>)
        } */}
                {/* !current.matches("submitting") && */}
                {
                    (surveyUrl) && (
                        <>
                            <iframe
                                title="form"
                                src={surveyUrl}
                                style={{ height: "80vh", width: "100%", marginTop: "20px" }}
                            />
                        </>
                    )
                }
                {
                    current.matches("success") && (
                        <>
                            <SuccessPopup onClose={handleCloseSuccessPopup} />
                        </>)
                }
                {/* <div className="mt-5 p-4 border border-orange-300" onClick={clearFormCache}> Clear saved data</div> */}
            </div >
        </>
    );

};

export default GenericOdkForm;
