"use client"
import React from 'react'
import { useEffect } from "react";
import { useState } from "react";
import CommonLayout from "../../components/CommonLayout";
import ROUTE_MAP from "../../services/routing/routeMap";
import { getFromLocalForage, setToLocalForage } from "../../services/utils";
import toast from 'react-hot-toast';
import { getDataFromHasura, saveDataToHasura } from "../../services/api";
import { useUserData } from '../../../app/hooks/useAuth';
import Linker from 'src/app/components/Link';
import { useSelector } from 'react-redux';
const Page = () => {
  const [textData, setTextData] = useState();
  const [dateData, setDateData] = useState();
  const [formData, setformData] = useState()

  const userData = useUserData();
  const forms = [
    { name: "Nursing Form-Medical (CRP)", link: ROUTE_MAP.generic_form_test + "/Nursing Form-Medical (CRP)" },
    { name: "once", link: ROUTE_MAP.generic_form_test + "/once" },
    { name: "distress", link: ROUTE_MAP.generic_form_test + "/distress" },
    { name: "cascading_pictures", link: ROUTE_MAP.generic_form_test + "/cascading_pictures" }
  ];
  
  const formSubmitted = useSelector((state) => state.auth.formSubmitted); 

  useEffect(() => {
    const isFormSubmitted = (formName) => formSubmitted.includes(formName);
    const updatedForms = forms.map((form) => ({
      ...form,
      disabled: isFormSubmitted(form.name),
    }));
  setformData(updatedForms);    
  }, [formSubmitted])
  
  const getInitialData = async () => {
    if (navigator.onLine) {
      let appData = await getDataFromHasura(userData);
      if (appData?.data?.dummy_poc_table?.length) {
        setTextData(appData?.data?.dummy_poc_table?.[0].text_input)
        setDateData(appData?.data?.dummy_poc_table?.[0].date_input)
      }
    } else {
      let appData = await getFromLocalForage('appData', true, userData);
      setTextData(appData?.textData)
      setDateData(appData?.dateData);
    }
  }

  const handleInput = async (setter, val, type) => {
    setter(val);
    let appData = await getFromLocalForage('appData', true, userData) || {};
    appData[type] = val;
    setToLocalForage('appData', appData);
  }

  const saveDataOnline = async () => {
    if (!navigator.onLine) {
      setToLocalForage('syncData', true);
      toast('Your data has been saved and will be synced with server once internet is available ✅')
    } else
      saveDataToHasura({
        text_input: textData,
        date_input: dateData
      })
  }

  useEffect(() => {
    getInitialData();
  }, [])
  return (
    <CommonLayout back={ROUTE_MAP.capture_location}>
      <div className="flex flex-col px-5 py-8 items-center justify-center">
        <p className="text-secondary text-[28px] font-bold mt-4 lg:text-[45px] animate__animated animate__fadeIn">
          Select Form
        </p>
        {formData?.map((form) => (
          <Linker
            key={form.name}
            text={!form.disabled ? form.name : `${form.name} (Already Submitted)`}
            styles="lg:w-[70%] animate__animated animate__fadeInDown"
            link={form.link}
            disabled={form.disabled}
          />
        ))}    
      </div>
    </CommonLayout>
  )
}

export default Page