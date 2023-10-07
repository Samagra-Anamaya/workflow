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
import { TextField, InputAdornment, CircularProgress } from "@mui/material";
import { debounce } from "debounce";
import GovtBanner from "../../components/GovtBanner";
import SelectionItem from '../../components/SelectionItem';
import SearchIcon from "@mui/icons-material/Search";

const CompletedEntries = ({ params }) => {
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
    const [fetching, setFetching] = useState(false);
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
                setFetching(true);
                let data = await getVillageSubmissions(_currLocation.villageCode, currPage);
                console.log("PREV SUBMISSIONS -->", data);
                setFetching(false);
                if (Object.keys(data)?.length) {
                    setPrevSubmissions(data?.result?.submissions);
                    setPrevTempSubmissions(data?.result?.submissions)
                    setTotalPages(data?.result?.totalPages)
                }
            }
        } catch (err) {
            console.log(err);
            setFetching(false);
        }
    }

    const searchCitizenSubmission = async (e) => {
        setSearchQuery(e.target.value);
        dispatch(updateSearchQuery({ villageId: _currLocation.villageCode, query: e.target.value }))
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollIntoView();
        }
    })

    function padTwoDigits(num) {
        return num.toString().padStart(2, "0");
    }

    function dateInYyyyMmDdHhMmSs(date, dateDiveder = "-") {
        // :::: Exmple Usage ::::
        // The function takes a Date object as a parameter and formats the date as YYYY-MM-DD hh:mm:ss.
        // 👇️ 2023-04-11 16:21:23 (yyyy-mm-dd hh:mm:ss)
        //console.log(dateInYyyyMmDdHhMmSs(new Date()));

        //  👇️️ 2025-05-04 05:24:07 (yyyy-mm-dd hh:mm:ss)
        // console.log(dateInYyyyMmDdHhMmSs(new Date('May 04, 2025 05:24:07')));
        // Date divider
        // 👇️ 01/04/2023 10:20:07 (MM/DD/YYYY hh:mm:ss)
        // console.log(dateInYyyyMmDdHhMmSs(new Date(), "/"));
        return (
            [
                date.getFullYear(),
                padTwoDigits(date.getMonth() + 1),
                padTwoDigits(date.getDate()),
            ].join(dateDiveder) +
            " " +
            [
                padTwoDigits(date.getHours()),
                padTwoDigits(date.getMinutes()),
                padTwoDigits(date.getSeconds()),
            ].join(":")
        );
    }

    return !hydrated ? null : (
        <div className={styles.container} ref={containerRef}>
            <GovtBanner sx={{ paddingTop: '2rem' }} />
            <CommonHeader
                onBack={() => router.back()}
                text={`${_currLocation.villageName}`}
                subText={`Completed Entries`}
                showLogout={false}
                sx={{ justifyContent: 'space-between !important', padding: '2rem 1rem' }} />

            <div className={styles.citizenContainer + ` animate__animated animate__fadeInUp`}>
                <div className={styles.submissionContainer}>
                    <TextField
                        id="search"
                        color="success"
                        type="search"
                        label={searchQuery ? "" : "Search submissions here ..."}
                        value={searchQuery}
                        onChange={searchCitizenSubmission}
                        sx={{ marginBottom: '2rem', border: 'none', border: '2px solid #007922', borderRadius: '1rem' }}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    {fetching && <CircularProgress color="success" />}
                    {!fetching && prevSubmissions?.length > 0 && prevSubmissions?.map(el =>
                        <SelectionItem
                            key={el.citizenId}
                            leftImage={'/assets/citizen.png'}
                            rightImage={'/assets/verified.png'}
                            mainText={el?.submissionData?.beneficiaryName}
                            mainSubtext={dateInYyyyMmDdHhMmSs(new Date(el?.updatedAt))}
                            sx={{ background: '#fff', marginBottom: '1rem' }}
                            mode={1}
                            onClick={() => { dispatch(setCurrentCitizen(el)); router.push(`/pages/citizen-survey`) }}
                        />)}
                </div>
                {!searchQuery && !fetching && <Pagination count={totalPages} color="success" onChange={(event, page) => setCurrPage(page)} className={styles.paginationContainer} />}

            </div>


        </div >
    );
};


export default CompletedEntries;

{/* <div key={el.citizenId} className={styles.submittedCitizen}
onClick={() => { dispatch(setCurrentCitizen(el)); router.push(`/pages/citizen-survey`) }}>
{el?.submissionData?.beneficiaryName}
</div> */}