"use client"
import Cookies from "js-cookie";
import XMLParser from "react-xml-parser";
import localforage from "localforage";
import { getMedicalAssessments, getPrefillXML, getSubmissionXML } from "../api";
import axios from "axios";
// import { userData } from "@/app/pages/Default/page";
// import { useUserData } from "@/app/hooks/useAuth";

export const makeHasuraCalls = async (query, userData) => {
  return fetch(process.env.NEXT_PUBLIC_HASURA_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${userData?.user.token}`,
    },
    body: JSON.stringify(query),
  })
    .then(async (response) => await validateResponse(response))
    .catch((error) => {
      return error;
    });
};

const validateResponse = async (response) => {
  const apiRes = await response.json();
  const jsonResponse = {
    ...apiRes,
    responseStatus: false,
  };
  return jsonResponse;
};

export const makeDataForPrefill = (prev, xmlDoc, key, finalObj, formName) => {
  if (Array.isArray(xmlDoc) && xmlDoc.length == 0 && prev.value) {
    finalObj[key] = prev.value;
  } else {
    for (const el in xmlDoc) {
      makeDataForPrefill(
        xmlDoc[el],
        xmlDoc[el].children,
        key + "_*_" + xmlDoc[el].name,
        finalObj,
        formName
      );
    }
  }
};

export const updateFormData = async (startingForm) => {
  try {
    let data = await getFromLocalForage(startingForm + `${new Date().toISOString().split("T")[0]}`)
    let prefilledForm = await getSubmissionXML(startingForm, data.formData, data.imageUrls);
    return prefilledForm;
  } catch (err) {

  }
};

export const setCookie = (cname, cvalue) => {
  try {
    Cookies.set(cname, JSON.stringify(cvalue));
  } catch (error) {
    return false;
  }
};

export const getCookie = (cname) => {
  try {
    let cookie = Cookies.get(cname);
    if (cookie) return JSON.parse(cookie);
  } catch (error) {
    return false;
  }
};

export const logout = () => {

  localStorage.clear();
  sessionStorage.clear();
  window.location = "/";
  localforage.removeItem('appEnvs')
  removeCookie("userData");

};

export const removeCookie = (cname) => {
  try {
    Cookies.remove(cname);
    return true;
  } catch (error) {
    return false;
  }
};

export const isImage = (key, filename) => {
  if (filename.includes(".png") || filename.includes(".tif") || filename.includes(".tiff") || filename.includes(".jpg") || filename.includes(".jpeg") || filename.includes(".bmp") || filename.includes(".gif") || filename.includes(".eps"))
    return true;
  if (key.includes("img") || key.includes("image"))
    return true;
  return false;
}


export const getFromLocalForage = async (key, isLoggedIn = true, userData) => {
  const user = userData;
  console.log(user);
  try {
    if (isLoggedIn)
      return await localforage.getItem(user?.user.id + "_" + key);
    else
      return await localforage.getItem(key);
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const setToLocalForage = async (key, value, isLoggedIn = true,user) => {
  // const user = getCookie("userData");
  console.log(user);
  if (isLoggedIn)
    await localforage.setItem(user?.user.id + "_" + key, value);
  else
    await localforage.setItem(key, value);
}

export const handleFormEvents = async (startingForm, afterFormSubmit, e,user) => {
  // const user = getCookie("userData");
  const appEnvs = await getFromLocalForage('appEnvs', false);
  const ENKETO_URL = process.env.NEXT_PUBLIC_ENKETO_URL;
  
  if (
    e.origin == ENKETO_URL &&
    JSON.parse(e?.data)?.state !== "ON_FORM_SUCCESS_COMPLETED"
  ) {
    console.log("Form Change Event------->", e)
    var formData = new XMLParser().parseFromString(JSON.parse(e.data).formData);
    if (formData) {
      let images = JSON.parse(e.data).fileURLs;
      let prevData = await getFromLocalForage(startingForm + `${new Date().toISOString().split("T")[0]}`);
      console.log("Local Forage Data ---->", prevData)
      await setToLocalForage(startingForm + `${new Date().toISOString().split("T")[0]}`, {
        formData: JSON.parse(e.data).formData,
        imageUrls: { ...prevData?.imageUrls, ...images }
      },true,user)
    }
  }
  afterFormSubmit(e);
};

export const getFormData = async ({ loading, scheduleId, formSpec, startingForm, formId, setData, setEncodedFormSpec, setEncodedFormURI }) => {
  const res = await getMedicalAssessments();
  if (res?.data?.assessment_schedule?.[0]) {
    loading.current = true;
    let ass = res?.data?.assessment_schedule?.[0];
    scheduleId.current = ass.id;
    setData({
      schedule_id: ass.id,
      id: ass.institute.id,
      district: ass.institute.district,
      instituteName: ass.institute.name,
      specialization:
        ass.institute?.institute_specializations?.[0]?.specializations,
      courses: ass.institute?.institute_types?.[0]?.types,
      type: ass.institute.sector,
      latitude: ass.institute.latitude,
      longitude: ass.institute.longitude,
    });
    let formData = await getFromLocalForage(startingForm + `${new Date().toISOString().split("T")[0]}`);
    console.log("Form Data Local Forage --->", formData)
    if (formData) {
      setEncodedFormSpec(encodeURI(JSON.stringify(formSpec.forms[formId])));
      let prefilledForm = await getPrefillXML(startingForm, formSpec.forms[formId].onSuccess, formData.formData, formData.imageUrls);
      console.log("Prefilled Form:", prefilledForm)
      setEncodedFormURI(prefilledForm)
      // setEncodedFormURI(
      //   getFormURI(
      //     formId,
      //     formSpec.forms[formId].onSuccess,
      //     formData
      //   )
      // );
    } else {
      let prefilledForm = await getPrefillXML(startingForm, formSpec.forms[formId].onSuccess);
      console.log("Prefilled Form Empty:", prefilledForm)
      setEncodedFormURI(prefilledForm)
    }
  } else setData(null);
  loading.current = false;
};

// export const cacheForms = async (formName) => {
//   const user = getCookie("userData");
//   console.log("userData:", user)
//   console.log("Caching Forms ... ");
//   let prefilledFormUrl = await getPrefillXML(formName, {});
//   console.log(prefilledFormUrl)
//   let transformedForm = await axios.get('http://localhost:8085/transform?xform=' + prefilledFormUrl);
//   console.log("Trans form:", transformedForm.data)
//   setToLocalForage(formName, transformedForm.data);
// }

export const getOfflineCapableForm = async (formId) => {
  try {
    const appEnvs = await getFromLocalForage('appEnvs', false);
    const ENKETO_URL = appEnvs.ENKETO_URL;
    const OPEN_ROSA_SERVER_URL = appEnvs.OPEN_ROSA_SERVER_URL;
    if (navigator.onLine) {
      let res = await axios.post(ENKETO_URL + "/api/v2/survey/offline",
        {
          server_url: OPEN_ROSA_SERVER_URL,
          form_id: formId
        },
        {
          headers: {
            Authorization: 'Basic ' + btoa('enketorules:')
          }
        });
      if (res?.data?.offline_url) {
        setToLocalForage('formUri', res?.data?.offline_url)
      }
      return res?.data?.offline_url || undefined;
    } else {
      let formUri = await getFromLocalForage('formUri');
      console.log(formUri);
      return formUri;
    }
  } catch (err) {
    console.log(err);
  }
}