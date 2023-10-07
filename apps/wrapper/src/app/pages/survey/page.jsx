"use client"
import React, { useEffect, useRef, useState } from "react";
import styles from './index.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import CommonHeader from "src/app/components/Commonheader";
import { v4 as uuidv4 } from 'uuid';
import { addCitizen, setCurrentCitizen, updateSearchQuery } from "../../redux/store";
import { getVillageDetails, getVillageSubmissions, searchCitizen } from "../../services/api";
import Pagination from '@mui/material/Pagination';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { TextField } from "@mui/material";
import { debounce } from "debounce";
import GovtBanner from "../../components/GovtBanner";
import SelectionItem from '../../components/SelectionItem';

const SurveyPage = ({ params }) => {
    /* Component States and Refs*/
    const userData = useSelector((state) => state?.userData);
    const _currLocation = useSelector((state) => state?.userData?.currentLocation);
    const [hydrated, setHydrated] = React.useState(false);
    const [citizens, setCitizens] = useState(_currLocation?.citizens || []);
    const [villageData, setVillageData] = useState({});
    const [currTab, setCurrTab] = React.useState(0);
    const [currPage, setCurrPage] = React.useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [prevSubmissions, setPrevSubmissions] = useState([]);
    const [prevTempSubmissions, setPrevTempSubmissions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const dispatch = useDispatch();
    const containerRef = useRef();

    /* Use Effects */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setHydrated(true);
        console.log(_currLocation)
        setSearchQuery(userData?.searchQuery?.[_currLocation.villageCode] || "")
        getVillageData();
    }, [])

    useEffect(() => {
        setCitizens(_currLocation?.citizens || [])
    }, [_currLocation])

    useEffect(() => {
        getVillageSubmissionData();
    }, [currPage])

    useEffect(() => {
        async function searchCitizens() {
            if (searchQuery?.length) {
                let res = await searchCitizen(_currLocation.villageCode, searchQuery)
                setPrevSubmissions(res?.result?.submissions || []);
            } else setPrevSubmissions(prevTempSubmissions)
        }
        searchCitizens();
    }, [searchQuery])

    useEffect(() => {
        if (containerRef.current) {
            console.log("ref->", containerRef.current)
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
                    setPrevTempSubmissions(data?.result?.submissions)
                    setTotalPages(data?.result?.totalPages)
                }
            }
        } catch (err) {
            console.log(err);
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
                leftImage={'/assets/unresolvedFlags.png'}
                sx={{ width: '90%' }}
                mainText={'Unresolved Flags'}
                rightImage={'/assets/circleArrow.png'}
                href="/pages/unresolved-flags"
            />

        </div >
    );
};


export default SurveyPage;
