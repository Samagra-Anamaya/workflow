"use client"
import React, { useEffect, useState } from "react";
import CommonLayout from "../../../components/CommonLayout";
import ROUTE_MAP from "../../../services/routing/routeMap";
import Linker from "src/app/components/Link";
import styles from './index.module.scss';
import LocationItem from "src/app/components/LocationItem";
import { useScrollTrigger } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Icon } from 'semantic-ui-react'
import CommonHeader from "src/app/components/Commonheader";


const SurveyPage = ({ params }) => {
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
            <CommonHeader text={`Start ${_currLocation.location} Survey`} onBack={() => router.back()} />
            <div className={styles.moduleContainer}>
                <LocationItem {..._currLocation} sx={{ width: '90%' }} />
                <div className={styles.module}>
                    <p>Village Module</p>
                    <div className={styles.separator}></div>
                    <p className={styles.textLight}>POC Name : {'{POC NAME}'}</p>
                    <p className={styles.textLight}>Status : {'{STATUS}'}</p>
                    <div className={styles.mainSeparator}></div>
                    <div className={styles.fullWidth}>
                        <div className={styles.getStarted} onClick={() => router.push(`/pages/village-survey/${params.slug}`)}>
                            <span>Get Started</span>
                            <img src="/assets/arrow-right-circle.png" />
                        </div>
                    </div>
                </div>
                <div className={styles.module}>
                    <p>Household Module</p>
                    <div className={styles.separator}></div>
                    <p className={styles.textLight}>POC Name : {'{POC NAME}'}</p>
                    <p className={styles.textLight}>Status : {'{STATUS}'}</p>
                    <p className={styles.textLight}>Total household's covered : {'{X}'}</p>
                    <div className={styles.mainSeparator}></div>
                    <div className={styles.fullWidth}>
                        <div className={styles.getStarted}>
                            <span>Get Started</span>
                            <img src="/assets/arrow-right-circle.png" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SurveyPage;
