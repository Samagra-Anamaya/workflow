"use client"
import React, { useEffect, useState } from "react";
import CommonLayout from "../../../components/CommonLayout";
import ROUTE_MAP from "../../../services/routing/routeMap";
import Linker from "src/app/components/Link";
import styles from './index.module.scss';
import LocationItem from "src/app/components/LocationItem";
import { useScrollTrigger } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from 'semantic-ui-react'
import CommonHeader from "src/app/components/Commonheader";
import GenericOdkForm from "src/app/components/GenericOdkForm";


const VillageSurveyPage = ({ params }) => {
    const [hydrated, setHydrated] = React.useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const _currLocation = useSelector((state) => state?.userData?.currentLocation);

    useEffect(() => {
        setHydrated(true);
        console.log(params.slug)
    }, [])

    return !hydrated ? null : (
        <div className={styles.root}>
            <CommonHeader text={`${_currLocation.location} Village Survey`} onBack={() => router.back()} />
            <GenericOdkForm formId={decodeURIComponent(params.slug)} />
        </div>
    );
};

export default VillageSurveyPage;
