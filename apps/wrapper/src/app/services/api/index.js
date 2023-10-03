import axios from "axios";
import { addFormUri } from "../../redux/store";
import { getFromLocalForage, makeHasuraCalls } from "../utils";

const BASE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL;
const applicationId = process.env.NEXT_PUBLIC_APPLICATION_ID;
const ENKETO_URL = process.env.NEXT_PUBLIC_ENKETO_EXPRESS_URL;
const CENTRO_API = process.env.NEXT_PUBLIC_CENTRO_URL;
const BACKEND_SERVICE_URL = process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL;

export const userLogin = async (username, pass) => {
  try {
    const res = await axios.post(BASE_URL + "login", {
      password: pass,
      loginId: username,
      applicationId: applicationId,
    });
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const sendOtpToMobile = async (mobile) => {
  try {
    const res = await axios.post(
      BASE_URL + "changePassword/sendOTP",
      {
        username: mobile,
      },
      { headers: { "x-application-id": applicationId } }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const verifyOtpSavePassword = async (mobile, pass, otp) => {
  try {
    const res = await axios.patch(
      BASE_URL + "changePassword/update",
      {
        username: mobile,
        password: pass,
        OTP: otp,
      },
      { headers: { "x-application-id": applicationId } }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getMedicalAssessments = () => {
  const query = {
    query: `
      query ($date: date) {
        assessment_schedule(where: {date: {_eq: $date}}) {
          id
          institute{
            id
            name
            sector
            district
            latitude
            longitude
            email
            institute_types{
              id
              types
            }
            institute_specializations {
              id
              specializations
            }
            institute_pocs {
              id
              name
              number
            }
          }
        }
      }
      `,
    variables: { date: new Date().toISOString().split("T")[0] },
  };
  return makeHasuraCalls(query);
};

export const getMedicalAssessmentsUpcoming = () => {
  const query = {
    query: `
      query {
        assessment_schedule(where: {date: {_gt: "${new Date().toISOString().split("T")[0]
      }"}}, order_by: {date: asc}){
          id
          date
          institute{
            id
            district
          }
        }
      }
      `,
    variables: {},
  };
  return makeHasuraCalls(query);
};

export const getPrefillXML = async (form, onFormSuccessData, prefillXML, imageUrls) => {
  try {
    const appEnvs = await getFromLocalForage('appEnvs', false);
    const ENKETO_MANAGER_URL = appEnvs.NEXT_PUBLIC_ENKETO_MANAGER_URL;
    const res = await axios.post(
      `${ENKETO_MANAGER_URL}/prefillXML?form=${form}&onFormSuccessData=${encodeURI(
        JSON.stringify(onFormSuccessData)
      )}`,
      {
        prefillXML,
        imageUrls
      },
      { headers: {} }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getSubmissionXML = async (form, prefillXML, imageUrls) => {
  try {
    const appEnvs = await getFromLocalForage('appEnvs', false);
    const ENKETO_MANAGER_URL = appEnvs.ENKETO_MANAGER_URL;
    const res = await axios.post(
      `${ENKETO_MANAGER_URL}/submissionXML?form=${form}`,
      {
        prefillXML,
        imageUrls
      },
      { headers: {} }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getRandomOsceFormsTeacher = async (type) => {
  try {
    // const years = ['1st_year', '2nd_year', '3rd_year'];
    const appEnvs = await getFromLocalForage('appEnvs', false);
    const ENKETO_MANAGER_URL = appEnvs.ENKETO_MANAGER_URL;
    const years = ["1st_year"];
    const year = years[Math.floor(Math.random() * years.length)];
    const res = await axios.get(
      `${ENKETO_MANAGER_URL}/osceFormTeachers/${type}/${year}`
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getRandomOsceForm = async (type, year, speciality) => {
  try {
    const appEnvs = await getFromLocalForage('appEnvs', false);
    const ENKETO_MANAGER_URL = appEnvs.ENKETO_MANAGER_URL;
    let url = speciality
      ? `${ENKETO_MANAGER_URL}/osceForm/${type}/${year}/${speciality}`
      : `${ENKETO_MANAGER_URL}/osceForm/${type}/${year}`;
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const createUser = async (data) => {
  try {
    const body = {
      registration: {
        applicationId: applicationId,
        usernameStatus: "ACTIVE",
        roles: [data.role],
      },
      user: {
        password: data?.password,
        username: data?.mobile,
        mobilePhone: data?.mobile,
      },
    };

    const userRes = await axios.post(BASE_URL + "signup", body, {
      headers: { "x-application-id": applicationId },
    });

    if (userRes?.data?.responseCode === "OK") {
      return userRes.data;
    } else if (userRes?.data?.status != 200) {
      const errorStrings = [];
      const errors = userRes?.data?.exception?.fieldErrors;
      Object.keys(errors).forEach((key) => {
        errorStrings.push(errors[key]?.[0]?.message);
      });
      return errorStrings.join(". \n");
    }
  } catch (error) {
    const errorStrings = [];
    const errors = error?.response?.data?.exception?.fieldErrors;
    Object.keys(errors).forEach((key) => {
      errorStrings.push(errors[key]?.[0]?.message);
    });
    return (
      errorStrings.join(". \n") ||
      "An error occured while creating user. Try again"
    );
  }
  return null;
};

export const saveFormSubmission = (data) => {
  const query = {
    query: `mutation ($object: [form_submissions_insert_input!] = {}) {
      insert_form_submissions(objects: $object) {
        returning {
          id
          created_at
        }
      }
    }`,
    variables: { object: data },
  };
  return makeHasuraCalls(query);
};

export const getAssessmentStatus = () => {
  const query = {
    query: `
      {
        form_submissions(where: {assessment_schedule: {date: {_eq: "${new Date().toISOString().split("T")[0]
      }"}}}) {
          id
          form_name
          created_at
        }
      }
      `,
    variables: {},
  };
  return makeHasuraCalls(query);
};

export const getAssignedForms = (course, assType) => {
  const query = {
    query: `
      {
        osce_assignment(where: {assessment_schedule: {date: {_eq: "${new Date().toISOString().split("T")[0]
      }"}}, _and: {assessment_type: {_eq: "${assType}"}, _and: {course_type: {_eq: "${course}"}}}}) {
          assessment_type
          course_type
          id
          osce_names
        }
      }
      `,
    variables: {},
  };
  return makeHasuraCalls(query);
};

export const assignOsceForm = (data) => {
  const query = {
    query: `
    mutation ($object: [osce_assignment_insert_input!] = {}) {
      insert_osce_assignment(objects: $object) {
        returning {
          id
          created_at
        }
      }
    }
      `,
    variables: { object: data },
  };
  return makeHasuraCalls(query);
};

export const getFormSubmissions = () => {
  const query = {
    query: `
      query {
        form_submissions(order_by: {created_at : desc}){
          form_data
          form_name
          created_at
          assessment_schedule {
            institute_id
            assessor_code
          }
      }
    }
      `,
    variables: {},
  };
  return makeHasuraCalls(query);
};


export const saveDataToHasura = (data) => {
  const query = {
    query: `
    mutation ($object: [dummy_poc_table_insert_input!] = {}) {
      insert_dummy_poc_table(objects: $object) {
        returning {
          id
        }
      }
    }
      `,
    variables: { object: data },
  };
  return makeHasuraCalls(query);
};

export const getDataFromHasura = (userData) => {
  const query = {
    query: `
    query MyQuery {
      dummy_poc_table(order_by: {created_at: desc}, limit: 1) {
        text_input
        date_input
        id
      }
    }
      `,
    variables: {},
  };
  return makeHasuraCalls(query, userData);
};

export const getOfflineCapableForm = async (formId, dispatch) => {
  try {
    if (navigator.onLine) {
      let res = await axios.post(ENKETO_URL + "/api/v2/survey/offline",
        {
          server_url: CENTRO_API,
          form_id: formId
        },
        {
          headers: {
            Authorization: 'Basic ' + btoa('enketorules:')
          }
        });
      if (res?.data?.offline_url) {
        dispatch(addFormUri({ formId: formId, formUrl: res?.data?.offline_url }))
      }
      return res?.data?.offline_url || undefined;
    } else {
      // Return false if offline
      return false
    }
  } catch (err) {
    console.log(err);
  }
}

export const getEnumeratorSchedule = async (userId) => {
  try {
    let res = await axios.get(BACKEND_SERVICE_URL + `/schedule/enumerator/${userId}`);
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const submitCitizenRecord = async (submissionData, submitterId) => {
  try {
    let res = await axios.post(BACKEND_SERVICE_URL + `/submissions`, {
      submissionData,
      submitterId
    });
    return res;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const getVillageDetails = async (id) => {
  try {
    let res = await axios.get(BACKEND_SERVICE_URL + `/utils/villageData/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const getVillageSubmissions = async (id, page) => {
  try {
    let res = await axios.get(BACKEND_SERVICE_URL + `/submissions/${id}?limit=5&page=${page}`);
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const searchCitizen = async (query) => {
  try {
    let res = await axios.get(BACKEND_SERVICE_URL + `/submissions/search/${query}`);
    return res.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}